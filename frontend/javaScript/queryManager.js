function queryConnector(){
    let queryForm = document.getElementById("queryForm");
    let symbolInput = document.getElementById("symbolInput");
    queryForm.addEventListener("submit",function(e){
        e.preventDefault();
        queryProcess();
    });
    async function queryProcess(){
        let mgmtCode;
        let fundID;
        let input;
        if(symbolInput.value != ""){
            input = symbolInput.value;
            mgmtCode = symbolInput.value.substring(0, 3);
            fundID = symbolInput.value.substring(3, symbolInput.value.length);
        }
        let query = "SELECT * FROM fsrv_prod WHERE (MGMT_CODE='" + mgmtCode + "') AND (FUND_ID='" +
        fundID + "')";
        let response = await fetch("/query", {
            method: "POST",
            body: query
        });
        if(response.ok){
            let result = await response.json();
            if(result.length > 0){
                console.log(result[0]);
                pageManager.changePage(2,0,1);
                resultsBuilder(result[0]);
            } else {
                console.log("No product exists by that name");
            }
        } else {
            console.log("Query results not received");
        }
    }
}