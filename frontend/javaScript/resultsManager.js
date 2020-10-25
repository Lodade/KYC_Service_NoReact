async function resultsBuilder(resultObject){
    function resultsHeaderPopulator(){
        let resultsFirstRow = document.getElementById("resultsFirstRow");
        let resultsSecondRow = document.getElementById("resultsSecondRow");
        let classHolder;
        let seriesHolder;
        if(resultObject.CLASS){
            classHolder = resultObject.CLASS;
        }else {
            classHolder = "N/A";
        }
        if(resultObject.SERIES){
            seriesHolder = resultObject.SERIES;
        }else {
            seriesHolder = "N/A";
        }
        resultsFirstRow.innerHTML = "Symbol: " + resultObject.MGMT_CODE + resultObject.FUND_ID +  
        " Issuer: N/A";
        resultsSecondRow.innerHTML = "Name: " +  resultObject.ENG_LONG_NM + " Class: " + classHolder + 
        " Series: " + seriesHolder + " Load: " + resultObject.LOAD_TYPE; 
    }
    async function resultsDetailsPopulator(){
        let objectKeys = Object.keys(resultObject);
        let holder;
        let elementHolder;
        for(let i = 0; i < objectKeys.length;i++){
            holder = resultObject[objectKeys[i]];
            if(document.getElementById(objectKeys[i]) != null){
                elementHolder = document.getElementById(objectKeys[i]);
                elementHolder.innerHTML =  holder; 
            }
        }
    }
    resultsHeaderPopulator();
    await resultsDetailsPopulator();
}