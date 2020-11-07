var pageManager;
async function pageManagement(){
    let explore_viewProduct;
    let explore_dashboard;
    let manage;
    let displayArea;
    let resultsArea;
    function removeAllChildNodes(parent){
        while(parent.firstChild){
            parent.removeChild(parent.firstChild);
        }
    }
    return {
        pageGather: async function(){
            explore_dashboard = document.getElementById("explore_dashboard");
            explore_viewProduct = document.getElementById("explore_viewProduct");
            manage = document.getElementById("manage");
            resultsArea = document.getElementById("resultsArea");
            displayArea = document.getElementById("displayArea");
            removeAllChildNodes(displayArea);            
        },
        changePage: async function(mainSection, subSection, resultsSubSection){
            if(mainSection == 1){

            }else if(mainSection == 2){
                if(subSection == 1){
                    removeAllChildNodes(displayArea);
                    displayArea.appendChild(explore_dashboard);
                    await dashboardController();
                }
                if(subSection == 2){
                    removeAllChildNodes(displayArea);
                    displayArea.appendChild(explore_viewProduct);
                    await queryConnector();
                }
                if(resultsSubSection == 1){
                    removeAllChildNodes(displayArea);
                    displayArea.appendChild(resultsArea);
                }
            }else if(mainSection == 3){

            }else if(mainSection == 4){

            }
        }
    };
}
(async function () {
    pageManager = await pageManagement();
    await pageManager.pageGather();
})();
