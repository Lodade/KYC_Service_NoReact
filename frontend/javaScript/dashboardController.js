async function dashboardController(){
    let dataType = "fundServ";
    let sortingType = "mgmtCo";
    let fundCountsTable = document.getElementById("fundCountsTable");
    let query = "SELECT DISTINCT(MGMT_CODE)," +
    " (SELECT COUNT(*) FROM fsrv_prod f2 WHERE f2.MGMT_CODE=f.MGMT_CODE) FUND_COUNT," +
    " (SELECT COUNT(DISTINCT(f2.FUND_LINK_ID)) from fsrv_prod f2 WHERE f2.MGMT_CODE=f.MGMT_CODE) DISTINCT_FUND_COUNT" +
    " FROM fsrv_prod f";
    let result = await queryProcess(query);
    console.log(result);
    async function countsTablePopulator(result, headers){
        let currentRow;
        let currentColumn;
        let currentKeys;
        let currentHeader;
        for(let i = -1;i < result.length;i++){
            currentRow = document.createElement("tr");
            if(i == -1){
                currentKeys = Object.keys(result[0]);
            }else{
                currentKeys = Object.keys(result[i]);
            }
            for(let k = 0;k < currentKeys.length;k++){
                if(i == -1){
                    currentHeader = document.createElement("th");
                    currentHeader.innerHTML = headers[k];
                    currentRow.append(currentHeader);
                }else{
                    currentColumn = document.createElement("td");
                    currentColumn.innerHTML = result[i][currentKeys[k]];
                    currentRow.append(currentColumn);
                }
            }
            fundCountsTable.append(currentRow);
        }
    }
    countsTablePopulator(result,["Mgmt Code","Fund Count","Distinct Fund Count"]);
}