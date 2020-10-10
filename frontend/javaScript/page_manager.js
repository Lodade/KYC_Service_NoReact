function pageManagement(){
    let explore_viewProduct;
    let manage;
    let displayArea;
    function removeAllChildNodes(parent){
        while(parent.firstChild){
            parent.removeChild(parent.firstChild);
        }
    }
    return {
        pageGather: function(){
            explore_viewProduct = document.getElementById("explore_viewProduct");
            manage = document.getElementById("manage");
            displayArea = document.getElementById("displayArea");
            removeAllChildNodes(displayArea);            
        },
        changePage: function(mainSection, subSection){
            if(mainSection == 1){

            }else if(mainSection == 2){
                if(subSection == 2){
                    removeAllChildNodes(displayArea);
                    displayArea.appendChild(explore_viewProduct);
                }
            }else if(mainSection == 3){

            }else if(mainSection == 4){

            }
        }
    };
}
var pageManager = pageManagement();
pageManager.pageGather();