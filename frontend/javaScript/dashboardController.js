async function dashboardController(buttonType, refiltering) {
    let fundCountsTable = document.getElementById("fundCountsTable");
    let fundDisplayTable = document.getElementById("fundDisplayTable");
    if (fundCountsTable.getAttribute("currentType") == undefined) {
        fundCountsTable.setAttribute("currentType", buttonType);
        await filterSetup();
        await queryChooser(buttonType);
    } else if (refiltering == true) {
        await removeAllChildNodes(fundCountsTable);
        await queryChooser(fundCountsTable.getAttribute("currentType"));
    } else if (fundCountsTable.getAttribute("currentType") != buttonType) {
        await removeAllChildNodes(fundCountsTable);
        await queryChooser(buttonType);
        fundCountsTable.setAttribute("currentType", buttonType);
    }
    async function filterSetup() {
        let filters = await filterGather();
        for (let i = 0; i < filters.length; i++) {
            filters[i].onchange = async () => { await dashboardController("", true) };
        }
        let query;
        for (let i = 0; i < filters.length; i++) {
            if (i != 3) {
                query = "SELECT DISTINCT(fp." + filters[i].name + "), f2.FULL_" + filters[i].name + " FROM fsrv_prod fp, fsrv_" +
                    filters[i].name + "_enum f2 WHERE fp." + filters[i].name + "=f2." + filters[i].name;
            } else {
                query = "SELECT DISTINCT(fp." + filters[i].name + ") FROM fsrv_prod fp";
            }
            let result = await queryProcess(query);
            for (let k = 0; k < result.length; k++) {
                let currentKeys = Object.keys(result[k]);
                let optionText = "";
                for (let p = 0; p < currentKeys.length; p++) {
                    if (p != (currentKeys.length - 1)) {
                        optionText += result[k][currentKeys[p]] + " ";
                    } else {
                        optionText += result[k][currentKeys[p]];
                    }
                }
                let option = document.createElement("option");
                option.value = result[k][currentKeys[0]];
                option.innerHTML = optionText;
                filters[i].append(option);
            }
        }
    }
    async function filterGather() {
        let filters = [];
        filters[0] = document.getElementById("prodTypeChooser");
        filters[1] = document.getElementById("loadTypeChooser");
        filters[2] = document.getElementById("classificationChooser");
        filters[3] = document.getElementById("riskChooser");
        return filters;
    }
    async function queryFilterAssembler(choices, filters, hasWhere) {
        let statement = " ";
        let noFiltering = true;
        let prior = false;
        for (let i = 0; i < choices.length; i++) {
            if (choices[i] != "") {
                noFiltering = false;
            }
        }
        for (let i = 0; i < choices.length; i++) {
            if (!hasWhere && i == 0 && noFiltering == false) {
                statement += "WHERE ";
            } else if (hasWhere && i == 0 && noFiltering == false) {
                statement += "AND ";
            }
            if (choices[i] != "" && prior == true) {
                statement += " AND " + "f." + filters[i].name + "=('" + choices[i] + "')";
            } else if (choices[i] != "") {
                statement += "f." + filters[i].name + "=('" + choices[i] + "')";
                prior = true;
            }
        }
        console.log(statement);
        return statement;
    }
    async function queryChooser(buttonType) {
        let query;
        let headers;
        let filters = await filterGather();
        let choices = [];
        let filterPart = "";
        let copy = "";
        for (let i = 0; i < filters.length; i++) {
            choices[i] = filters[i].options[filters[i].selectedIndex].value;
        }
        switch (buttonType) {
            case "mgmtCo":
                filterPart = await queryFilterAssembler(choices, filters, false);
                if(filterPart.substring(0,6) == " WHERE"){
                    copy = " AND" + filterPart.substring(6, filterPart.length);
                }
                copy = copy.replace(/\sf\W/g," f2.");
                query = "SELECT DISTINCT(MGMT_CODE)," +
                    " (SELECT COUNT(*) FROM fsrv_prod f2 WHERE f2.MGMT_CODE=f.MGMT_CODE" + copy + ") FUND_COUNT," +
                    " (SELECT COUNT(DISTINCT(f2.FUND_LINK_ID)) from fsrv_prod f2 WHERE f2.MGMT_CODE=f.MGMT_CODE" + copy + ") DISTINCT_FUND_COUNT" +
                    " FROM fsrv_prod f" + filterPart;
                headers = ["Mgmt Code", "Fund Count", "Distinct Fund Count"];
                break;
            case "prodType":
                filterPart = await queryFilterAssembler(choices, filters, true);
                copy = filterPart;
                copy = copy.replace(/\sf\W/g," f2.");
                query = "SELECT DISTINCT(f.PROD_TYPE)," +
                    " fe.FULL_PROD_TYPE," +
                    " (SELECT COUNT(*) FROM fsrv_prod f2 WHERE f2.PROD_TYPE=f.PROD_TYPE" + copy + ") FUND_COUNT," +
                    " (SELECT COUNT(DISTINCT(f2.FUND_LINK_ID)) from fsrv_prod f2 WHERE f2.PROD_TYPE=f.PROD_TYPE" + copy + ") DISTINCT_FUND_COUNT" +
                    " FROM fsrv_prod f, fsrv_prod_type_enum fe" +
                    " WHERE fe.PROD_TYPE=f.PROD_TYPE" + filterPart;
                headers = ["Product Type", "Full Name", "Fund Count", "Distinct Fund Count"];
                break;
            case "loadType":
                filterPart = await queryFilterAssembler(choices, filters, true);
                copy = filterPart;
                copy = copy.replace(/\sf\W/g," f2.");
                query = "SELECT DISTINCT(f.LOAD_TYPE)," +
                    " fe.FULL_LOAD_TYPE," +
                    " (SELECT COUNT(*) FROM fsrv_prod f2 WHERE f2.LOAD_TYPE=f.LOAD_TYPE" + copy + ") FUND_COUNT," +
                    " (SELECT COUNT(DISTINCT(f2.FUND_LINK_ID)) from fsrv_prod f2 WHERE f2.LOAD_TYPE=f.LOAD_TYPE" + copy + ") DISTINCT_FUND_COUNT" +
                    " FROM fsrv_prod f, fsrv_load_type_enum fe " +
                    " WHERE fe.LOAD_TYPE=f.LOAD_TYPE" + filterPart;
                headers = ["Load Type", "Full Name", "Fund Count", "Distinct Fund Count"];
                break;
            case "classification":
                filterPart = await queryFilterAssembler(choices, filters, true);
                copy = filterPart;
                copy = copy.replace(/\sf\W/g," f2.");
                query = "SELECT DISTINCT(f.CLASSIFICATION)," +
                    " fe.FULL_CLASSIFICATION," +
                    " (SELECT COUNT(*) FROM fsrv_prod f2 WHERE f2.CLASSIFICATION=f.CLASSIFICATION" + copy + ") FUND_COUNT," +
                    " (SELECT COUNT(DISTINCT(f2.FUND_LINK_ID)) from fsrv_prod f2 WHERE f2.CLASSIFICATION=f.CLASSIFICATION" + copy + ") DISTINCT_FUND_COUNT" +
                    " FROM fsrv_prod f, fsrv_classification_enum fe" +
                    " WHERE fe.CLASSIFICATION=f.CLASSIFICATION" + filterPart;
                headers = ["Classification", "Full Name", "Fund Count", "Distinct Fund Count"];
                break;
            case "risk":
                filterPart = await queryFilterAssembler(choices, filters, false);
                if(filterPart.substring(0,6) == " WHERE"){
                    copy = " AND" + filterPart.substring(6, filterPart.length);
                }
                copy = copy.replace(/\sf\W/g," f2.");
                query = "SELECT DISTINCT(RISK_CLASS)," +
                    " (SELECT COUNT(*) FROM fsrv_prod f2 WHERE f2.RISK_CLASS=f.RISK_CLASS" + copy + ") FUND_COUNT," +
                    " (SELECT COUNT(DISTINCT(f2.FUND_LINK_ID)) from fsrv_prod f2 WHERE f2.RISK_CLASS=f.RISK_CLASS" + copy + ") DISTINCT_FUND_COUNT" +
                    " FROM fsrv_prod f" + filterPart;
                headers = ["Risk Class", "Fund Count", "Distinct Fund Count"];
                break;
        }
        console.log(query);
        let result = await queryProcess(query);
        await countsTablePopulator(result, headers, filterPart);
    }
    async function countsTablePopulator(result, headers, filterPart) {
        let currentRow;
        let currentColumn;
        let currentKeys;
        let currentHeader;
        let currentButton;
        if(filterPart.substring(0,6) == " WHERE"){
            filterPart = " AND" + filterPart.substring(6, filterPart.length);
        }
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
                    currentButton.onclick = async () => { await fundTablePopulator(fundDisplayTable, currentKeys[k], result[i][currentKeys[k]], filterPart) };
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
    async function fundTablePopulator(fundDisplayTable, queryType, queryTarget, filterPart) {
        await removeAllChildNodes(fundDisplayTable);
        let currentRow;
        let currentColumn;
        let currentKeys;
        let currentHeader;
        let headers = ["Management Code + Fund ID", "English Long Name"];
        let query = "SELECT CONCAT(MGMT_CODE, FUND_ID), ENG_LONG_NM FROM fsrv_prod f WHERE f." + queryType + "=('" + queryTarget + "')" + filterPart;
        console.log(query);
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
}

