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
        let query = "SELECT prod.*, mins.*, elig.DIV_FREQ, elig.DIV_OPT_1, elig.DIV_OPT_4, elig.DIV_OPT_5"+ 
        " FROM fsrv_prod prod, fsrv_mins mins, fsrv_elig_div_opt elig" +
        " WHERE prod.FSRV_ID=('" + resultObject.FSRV_ID + "') AND prod.FSRV_ID=mins.SEQ_ID AND prod.FSRV_ID=elig.SEQ_ID";
        let fullResults = await queryProcess(query);
        fullResults = fullResults[0];
        console.log(fullResults);
        let objectKeys = Object.keys(fullResults);
        let holder;
        let elementHolder;
        for(let i = 0; i < objectKeys.length;i++){
            holder = fullResults[objectKeys[i]];
            if(document.getElementById(objectKeys[i]) != null){
                elementHolder = document.getElementById(objectKeys[i]);
                elementHolder.innerHTML =  holder; 
            }
        }
        query = "SELECT * FROM fsrv_elig_acct_types acct WHERE acct.SEQ_ID=('" + resultObject.FSRV_ID + "') AND acct.DESIGNATION=('1')";
        let accountResults = await queryProcess(query);
        console.log(accountResults);
        listInterpreter(accountResults, ["01","02","04","05","06","07","08","10","11","12","13","14","15","16","17","18","19","20","21"],
         "_CNACC", "ACCT_TYPE");

        query = "SELECT * FROM fsrv_elig_acct_types acct WHERE acct.SEQ_ID=('" + resultObject.FSRV_ID + "') AND acct.DESIGNATION=('2')";
        accountResults = await queryProcess(query);
        console.log(accountResults);
        listInterpreter(accountResults, ["01","02","04","05","06","07","08","10","11","12","13","14","15","16","17","18","19","20","21"],
         "_NIACC", "ACCT_TYPE");

        query = "SELECT * FROM fsrv_elig_prov prov WHERE prov.SEQ_ID=('" + resultObject.FSRV_ID + "')";
        let eligibleProvs = await queryProcess(query);
        console.log(eligibleProvs);
        listInterpreter(eligibleProvs, ["AB","BC","MB","NB","NL","NT","NS","NU","ON","PE","QC","SK","YT"], "_prov", "PROV_STATE");
        
        query = "SELECT * FROM fsrv_elig_trxn trxn WHERE trxn.SEQ_ID=('" + resultObject.FSRV_ID + "')";
        let eligibleTrxns = await queryProcess(query);
        console.log(eligibleTrxns);
        trxnsInterpreter(eligibleTrxns);
        
        query = "SELECT * FROM fsrv_prod_model model WHERE model.SEQ_ID=('" + resultObject.FSRV_ID + "')";
        let productModels = await queryProcess(query);
        console.log(productModels);
        modelsInterpreter(productModels);
    }
    async function modelsInterpreter(resultsHolder){
        let holder;
        let freqID;
        let settleID;
        for(let i = 0;i < resultsHolder.length;i++){
            holder = resultsHolder[i];
            freqID = holder["TYPE"] + "_freq";
            settleID = holder["TYPE"] + "_settle";
            document.getElementById(freqID).innerHTML = holder.FREQ;
            document.getElementById(settleID).innerHTML = holder.SETTLE_PERIOD
        }
    }
    async function trxnsInterpreter(resultsHolder){
        let holder;
        let trxnID;
        for(let i = 0;i < resultsHolder.length;i++){
            holder = resultsHolder[i];
            trxnID = holder["TRXN_TYPE"] + "_status";
            document.getElementById(trxnID).innerHTML = holder.TRXN_STATUS;
        } 
    }
    async function listInterpreter(resultsHolder, list, type, check){
        let ID;
        let found;
        for(let i = 0;i < list.length;i++){
            found = false;
            ID = list[i] + type;
            for(let k = 0;k < resultsHolder.length;k++){
                if(resultsHolder[k][check] == list[i]){
                    document.getElementById(ID).innerHTML = "Y";
                    found = true;
                }
            }
            if(found == false){
                document.getElementById(ID).innerHTML = "N";
            }
        } 
    }
    resultsHeaderPopulator();
    await resultsDetailsPopulator();
}