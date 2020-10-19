function pageManagement(){
    let explore_viewProduct;
    let manage;
    let displayArea;
    let resultsAreaHeader;
    let resultsAreaDetails;
    function removeAllChildNodes(parent){
        while(parent.firstChild){
            parent.removeChild(parent.firstChild);
        }
    }
    return {
        pageGather: function(){
            explore_viewProduct = document.getElementById("explore_viewProduct");
            manage = document.getElementById("manage");
            resultsAreaHeader = document.getElementById("resultsAreaHeader");
            resultsAreaDetails = document.getElementById("resultsAreaDetails");
            displayArea = document.getElementById("displayArea");
            removeAllChildNodes(displayArea);            
        },
        changePage: function(mainSection, subSection, resultsSubSection){
            if(mainSection == 1){

            }else if(mainSection == 2){
                if(subSection == 2){
                    removeAllChildNodes(displayArea);
                    displayArea.appendChild(explore_viewProduct);
                    queryConnector();
                }
                if(resultsSubSection == 1){
                    removeAllChildNodes(displayArea);
                    displayArea.appendChild(resultsAreaHeader);
                    displayArea.appendChild(resultsAreaDetails);
                }
            }else if(mainSection == 3){

            }else if(mainSection == 4){

            }
        }
    };
}
var pageManager = pageManagement();
pageManager.pageGather();