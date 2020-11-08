var pageManager;
async function pageManagement(){
    let explore_viewProduct;
    let explore_dashboard;
    let manage;
    let displayArea;
    let resultsArea;
    return {
        pageGather: async function(){
            explore_dashboard = document.getElementById("explore_dashboard");
            explore_viewProduct = document.getElementById("explore_viewProduct");
            manage = document.getElementById("manage");
            resultsArea = document.getElementById("resultsArea");
            displayArea = document.getElementById("displayArea");
            await removeAllChildNodes(displayArea);            
        },
        changePage: async function(mainSection, subSection, resultsSubSection){
            if(mainSection == 1){

            }else if(mainSection == 2){
                if(subSection == 1){
                    await removeAllChildNodes(displayArea);
                    displayArea.appendChild(explore_dashboard);
                    await dashboardController("mgmtCo");
                }
                if(subSection == 2){
                    await removeAllChildNodes(displayArea);
                    displayArea.appendChild(explore_viewProduct);
                    await queryConnector();
                }
                if(resultsSubSection == 1){
                    await removeAllChildNodes(displayArea);
                    displayArea.appendChild(resultsArea);
                }
            }else if(mainSection == 3){

            }else if(mainSection == 4){

            }
        }
    };
}
async function removeAllChildNodes(parent){
    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}
(async function () {
    pageManager = await pageManagement();
    await pageManager.pageGather();
})();
