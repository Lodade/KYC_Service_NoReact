async function dashboardController(buttonType) {
    let fundCountsTable = document.getElementById("fundCountsTable");
    let fundDisplayTable = document.getElementById("fundDisplayTable");
    if (fundCountsTable.getAttribute("currentType") == undefined) {
        fundCountsTable.setAttribute("currentType", buttonType);
        await queryChooser(buttonType);
    } else if (fundCountsTable.getAttribute("currentType") != buttonType) {
        await removeAllChildNodes(fundCountsTable);
        await queryChooser(buttonType);
        fundCountsTable.setAttribute("currentType", buttonType);
    }
    async function queryChooser(buttonType) {
        let query;
        let headers;
        switch (buttonType) {
            case "mgmtCo":
                query = "SELECT DISTINCT(MGMT_CODE)," +
                    " (SELECT COUNT(*) FROM fsrv_prod f2 WHERE f2.MGMT_CODE=f.MGMT_CODE) FUND_COUNT," +
                    " (SELECT COUNT(DISTINCT(f2.FUND_LINK_ID)) from fsrv_prod f2 WHERE f2.MGMT_CODE=f.MGMT_CODE) DISTINCT_FUND_COUNT" +
                    " FROM fsrv_prod f";
                headers = ["Mgmt Code", "Fund Count", "Distinct Fund Count"];
                break;
            case "prodType":
                query = "SELECT DISTINCT(f.PROD_TYPE)," +
                    " fe.FULL_NAME," +
                    " (SELECT COUNT(*) FROM fsrv_prod f2 WHERE f2.PROD_TYPE=f.PROD_TYPE) FUND_COUNT," +
                    " (SELECT COUNT(DISTINCT(f2.FUND_LINK_ID)) from fsrv_prod f2 WHERE f2.PROD_TYPE=f.PROD_TYPE) DISTINCT_FUND_COUNT" +
                    " FROM fsrv_prod f, fsrv_prod_type_enum fe" +
                    " WHERE fe.PROD_TYPE=f.PROD_TYPE";
                headers = ["Product Type", "Full Name", "Fund Count", "Distinct Fund Count"];
                break;
            case "loadType":
                query = "SELECT DISTINCT(f.LOAD_TYPE)," +
                    " fe.FULL_NAME," +
                    " (SELECT COUNT(*) FROM fsrv_prod f2 WHERE f2.LOAD_TYPE=f.LOAD_TYPE) FUND_COUNT," +
                    " (SELECT COUNT(DISTINCT(f2.FUND_LINK_ID)) from fsrv_prod f2 WHERE f2.LOAD_TYPE=f.LOAD_TYPE) DISTINCT_FUND_COUNT" +
                    " FROM fsrv_prod f, fsrv_load_type_enum fe " +
                    " WHERE fe.LOAD_TYPE=f.LOAD_TYPE";
                headers = ["Load Type", "Full Name", "Fund Count", "Distinct Fund Count"];
                break;
            case "classification":
                query = "SELECT DISTINCT(f.CLASSIFICATION)," +
                    " fe.FULL_NAME," +
                    " (SELECT COUNT(*) FROM fsrv_prod f2 WHERE f2.CLASSIFICATION=f.CLASSIFICATION) FUND_COUNT," +
                    " (SELECT COUNT(DISTINCT(f2.FUND_LINK_ID)) from fsrv_prod f2 WHERE f2.CLASSIFICATION=f.CLASSIFICATION) DISTINCT_FUND_COUNT" +
                    " FROM fsrv_prod f, fsrv_classification_enum fe" +
                    " WHERE fe.CLASSIFICATION=f.CLASSIFICATION";
                headers = ["Classification","Full Name", "Fund Count", "Distinct Fund Count"];
                break;
            case "risk":
                query = "SELECT DISTINCT(RISK_CLASS)," +
                    " (SELECT COUNT(*) FROM fsrv_prod f2 WHERE f2.RISK_CLASS=f.RISK_CLASS) FUND_COUNT," +
                    " (SELECT COUNT(DISTINCT(f2.FUND_LINK_ID)) from fsrv_prod f2 WHERE f2.RISK_CLASS=f.RISK_CLASS) DISTINCT_FUND_COUNT" +
                    " FROM fsrv_prod f";
                headers = ["Risk Class", "Fund Count", "Distinct Fund Count"];
                break;
        }
        let result = await queryProcess(query);
        console.log(result);
        countsTablePopulator(result, headers);
    }
    async function countsTablePopulator(result, headers) {
        let currentRow;
        let currentColumn;
        let currentKeys;
        let currentHeader;
        let currentButton;
        for (let i = -1; i < result.length; i++) {
            currentRow = document.createElement("tr");
            if (i == -1) {
                currentKeys = Object.keys(result[0]);
            } else {
                currentKeys = Object.keys(result[i]);
            }
            if (i == 0 && result[0][currentKeys[0]] == null) {
                continue;
            }
            for (let k = 0; k < currentKeys.length; k++) {
                if (i == -1) {
                    currentHeader = document.createElement("th");
                    currentHeader.innerHTML = headers[k];
                    currentRow.append(currentHeader);
                } else if (k == 0) {
                    currentColumn = document.createElement("td");
                    currentButton = document.createElement("button");
                    currentButton.innerHTML = result[i][currentKeys[k]];
                    currentButton.onclick = async () => {await fundTablePopulator(fundDisplayTable, result[i][currentKeys[k]], currentKeys[k])};
                    currentColumn.append(currentButton);
                    currentRow.append(currentColumn);
                } else { 
                    currentColumn = document.createElement("td");
                    currentColumn.innerHTML = result[i][currentKeys[k]];
                    currentRow.append(currentColumn);
                }
            }
            fundCountsTable.append(currentRow);
        }
    }
}
async function fundTablePopulator(fundDisplayTable, queryTarget, queryType) {
    await removeAllChildNodes(fundDisplayTable);
    let currentRow;
    let currentColumn;
    let currentKeys;
    let currentHeader;
    let headers = ["Management Code + Fund ID", "English Long Name"];
    let query = "SELECT CONCAT(MGMT_CODE, FUND_ID), ENG_LONG_NM FROM fsrv_prod f WHERE f." + queryType + "=('" + queryTarget + "')";
    let result = await queryProcess(query);
    for (let i = -1; i < result.length; i++) {
        currentRow = document.createElement("tr");
        if (i == -1) {
            currentKeys = Object.keys(result[0]);
        } else {
            currentKeys = Object.keys(result[i]);
        }
        for (let k = 0; k < currentKeys.length; k++) {
            if (i == -1) {
                currentHeader = document.createElement("th");
                currentHeader.innerHTML = headers[k];
                currentRow.append(currentHeader);
            } else {
                currentColumn = document.createElement("td");
                currentColumn.innerHTML = result[i][currentKeys[k]];
                currentRow.append(currentColumn);
            }
        }
        fundDisplayTable.append(currentRow);
    }
}
