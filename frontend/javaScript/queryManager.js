function queryConnector(){
    let queryForm = document.getElementById("queryForm");
    let symbolInput = document.getElementById("symbolInput");
    if(queryForm.getAttribute('hasListener') == null){
        queryForm.addEventListener("submit", async function (e){
            let mgmtCode;
            let fundID;
            let input;
            if(symbolInput.value != ""){
                input = symbolInput.value;
                mgmtCode = symbolInput.value.substring(0, 3);
                fundID = symbolInput.value.substring(3, symbolInput.value.length);
                e.preventDefault();
                let result = await queryProcess("SELECT * FROM fsrv_prod WHERE (MGMT_CODE='" + mgmtCode + "') AND (FUND_ID='" +
                fundID + "')");
                if(result[0] != null){
                    openResultsPage(result);
                }else{
                    console.log("No product exists by that name");
                }
            }else{
                console.log("No product has been entered");
                e.preventDefault();
            }
        });
        queryForm.setAttribute('hasListener', true);
    }
}
function openResultsPage(result){
    pageManager.changePage(2,0,1);
    resultsBuilder(result[0]);
}
async function queryProcess(query){
    let response = await fetch("/query", {
        method: "POST",
        body: query
    });
    if(response.ok){
        let result = await response.json();
        return result;
    } else {
        console.log("Query results not received");
    }
}