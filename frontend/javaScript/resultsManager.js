function resultsBuilder(resultObject){
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