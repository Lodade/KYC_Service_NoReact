function queryConnector(){
    let queryForm = document.getElementById("queryForm");
    let symbolInput = document.getElementById("symbolInput");
    if(queryForm.getAttribute('hasListener') == null){
        queryForm.addEventListener("submit", async function (e){
            if(symbolInput.value != ""){
                e.preventDefault();
                let result = await queryProcess("SELECT * FROM fsrv_prod WHERE concat(MGMT_CODE, FUND_ID) = '" + symbolInput.value + "'");
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