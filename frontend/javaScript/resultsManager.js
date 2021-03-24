async function resultsBuilder(resultObject) {
    async function resultsHeaderPopulator() {
        let resultsFirstRow = $("#resultsFirstRow")[0];
        let resultsSecondRow = $("#resultsSecondRow")[0];
        let classHolder;
        let seriesHolder;
        if (resultObject.CLASS) {
            classHolder = resultObject.CLASS;
        } else {
            classHolder = "N/A";
        }
        if (resultObject.SERIES) {
            seriesHolder = resultObject.SERIES;
        } else {
            seriesHolder = "N/A";
        }
        $(resultsFirstRow).html("Symbol: " + resultObject.MGMT_CODE + resultObject.FUND_ID +
            " Issuer: N/A");
        $(resultsSecondRow).html("Name: " + resultObject.ENG_LONG_NM + " Class: " + classHolder +
        " Series: " + seriesHolder + " Load: " + resultObject.LOAD_TYPE); 
    }
    async function resultsDetailsPopulator() {
        let query = "SELECT prod.*, fpte.FULL_PROD_TYPE, flte.FULL_LOAD_TYPE, mins.*, elig.DIV_FREQ, elig.DIV_OPT_1," +
            " elig.DIV_OPT_4, elig.DIV_OPT_5, fce.FULL_CURRENCY" +
            " FROM fsrv_prod prod, fsrv_mins mins, fsrv_elig_div_opt elig, fsrv_prod_type_enum fpte, fsrv_load_type_enum flte," +
            " fsrv_currency_enum fce" +
            " WHERE prod.FSRV_ID=('" + resultObject.FSRV_ID + "') AND prod.FSRV_ID=mins.SEQ_ID AND prod.FSRV_ID=elig.SEQ_ID" +
            " AND prod.PROD_TYPE=fpte.PROD_TYPE AND prod.LOAD_TYPE=flte.LOAD_TYPE AND prod.CURR=fce.CURRENCY";
        let fullResults = await queryProcess(query);
        fullResults = fullResults[0];
        console.log(fullResults);
        let objectKeys = Object.keys(fullResults);
        let holder;
        for (let i = 0; i < objectKeys.length; i++) {
            holder = fullResults[objectKeys[i]];
            if ($("#" + objectKeys[i])[0] !== null) {
                $("#" + objectKeys[i]).html(holder);
            }
        }

        query = "SELECT * FROM fsrv_elig_acct_types acct WHERE acct.SEQ_ID=('" + resultObject.FSRV_ID + "') AND acct.DESIGNATION=('1')";
        let accountResults = await queryProcess(query);
        console.log(accountResults);
        let statusButton = $("#cnaccountsStatusButton")[0];
        await listInterpreter(accountResults, ["01", "02", "04", "05", "06", "07", "08", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"],
            "_CNACC", "ACCT_TYPE", statusButton);

        query = "SELECT * FROM fsrv_elig_acct_types acct WHERE acct.SEQ_ID=('" + resultObject.FSRV_ID + "') AND acct.DESIGNATION=('2')";
        accountResults = await queryProcess(query);
        console.log(accountResults);
        statusButton = $("#niaccountsStatusButton")[0];
        await listInterpreter(accountResults, ["01", "02", "04", "05", "06", "07", "08", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"],
            "_NIACC", "ACCT_TYPE", statusButton);

        query = "SELECT * FROM fsrv_elig_prov prov WHERE prov.SEQ_ID=('" + resultObject.FSRV_ID + "')";
        let eligibleProvs = await queryProcess(query);
        console.log(eligibleProvs);
        statusButton = $("#provincesStatusButton")[0];
        await listInterpreter(eligibleProvs, ["AB", "BC", "MB", "NB", "NL", "NT", "NS", "NU", "ON", "PE", "QC", "SK", "YT"],
            "_prov", "PROV_STATE", statusButton);

        query = "SELECT * FROM fsrv_elig_trxn trxn WHERE trxn.SEQ_ID=('" + resultObject.FSRV_ID + "')";
        let eligibleTrxns = await queryProcess(query);
        console.log(eligibleTrxns);
        await trxnsInterpreter(eligibleTrxns);

        query = "SELECT * FROM fsrv_prod_model model WHERE model.SEQ_ID=('" + resultObject.FSRV_ID + "')";
        let productModels = await queryProcess(query);
        console.log(productModels);
        await modelsInterpreter(productModels);
    }
    async function modelsInterpreter(resultsHolder) {
        let holder;
        let freqID;
        let settleID;
        for (let i = 0; i < resultsHolder.length; i++) {
            holder = resultsHolder[i];
            freqID = holder["TYPE"] + "_freq";
            settleID = holder["TYPE"] + "_settle";
            $("#" + freqID).html(holder.FREQ);
            $("#" + settleID).html(holder.SETTLE_PERIOD);
        }
    }
    async function trxnsInterpreter(resultsHolder) {
        let holder;
        let trxnID;
        let allCount = 0;
        let statusButton = $("#transactionsStatusButton")[0];
        for (let i = 0; i < resultsHolder.length; i++) {
            holder = resultsHolder[i];
            trxnID = holder["TRXN_TYPE"] + "_status";
            $("#" + trxnID).html(holder.TRXN_STATUS);
            if (holder.TRXN_STATUS === "A") {
                allCount++;
            }
        }
        await statusInterpreter(allCount, resultsHolder.length, statusButton);
    }
    async function listInterpreter(resultsHolder, list, type, check, statusButton) {
        let ID;
        let found;
        let yesCount = 0;
        for (let i = 0; i < list.length; i++) {
            found = false;
            ID = list[i] + type;
            for (let k = 0; k < resultsHolder.length; k++) {
                if (resultsHolder[k][check] === list[i]) {
                    $("#" + ID).html("Y");
                    found = true;
                    yesCount++;
                }
            }
            if (found === false) {
                $("#" + ID).html("N");
            }
        }
        await statusInterpreter(yesCount, list.length, statusButton);
    }
    async function statusInterpreter(foundCount, maxCount, buttonElement) {
        if (foundCount === maxCount) {
            $(buttonElement).addClass("greenStatusBackground");
        } else if (foundCount < maxCount && foundCount > 0) {
            $(buttonElement).addClass("yellowStatusBackground");
        } else if (foundCount === 0) {
            $(buttonElement).addClass("redStatusBackground");
        }
    }
    await resultsHeaderPopulator();
    await resultsDetailsPopulator();
}