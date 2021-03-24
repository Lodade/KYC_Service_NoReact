var pageManager;
async function pageManagement(){
    let explore_viewProduct;
    let explore_dashboard;
    let manage;
    let displayArea;
    let resultsArea;
    return {
        pageGather: async function(){
            explore_dashboard = $("#explore_dashboard")[0];
            explore_viewProduct = $("#explore_viewProduct")[0];
            manage = $("#manage")[0];
            resultsArea = $("#resultsArea")[0];
            displayArea = $("#displayArea")[0];
            $(displayArea).empty();            
        },
        changePage: async function(mainSection, subSection, resultsSubSection){
            if(mainSection === 1){

            }else if(mainSection === 2){
                if(subSection === 1){
                    $(displayArea).empty();
                    $(displayArea).append(explore_dashboard);
                    await dashboardController("mgmtCo");
                }
                if(subSection === 2){
                    $(displayArea).empty();
                    $(displayArea).append(explore_viewProduct);
                    await queryConnector();
                }
                if(resultsSubSection === 1){
                    $(displayArea).empty();
                    $(displayArea).append(resultsArea);
                    await onResultsShow();
                }
            }else if(mainSection === 3){

            }else if(mainSection === 4){

            }
        }
    };
}
(async function () {
    pageManager = await pageManagement();
    await pageManager.pageGather();
})();
