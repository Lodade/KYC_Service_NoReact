async function queryConnector(){
    let queryForm = $("#queryForm")[0];
    let symbolInput = $("#symbolInput")[0];
    $(queryForm).submit(async function (e){
        if($(symbolInput).val() !== ""){
            e.preventDefault();
            let result = await queryProcess("SELECT * FROM fsrv_prod WHERE concat(MGMT_CODE, FUND_ID) = '" + $(symbolInput).val() + "'");
            if(result[0] !== null){
                await openResultsPage(result);
            }else{
                console.log("No product exists by that name");
            }
        }else{
            console.log("No product has been entered");
            e.preventDefault();
        }
    });
}
async function openResultsPage(result){
    await pageManager.changePage(2,0,1);
    await resultsBuilder(result[0]);
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