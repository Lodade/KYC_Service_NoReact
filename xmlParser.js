let xml2js = require("xml2js");
let fs = require("fs");
const e = require("express");
let mariadb = require("mariadb");
let parser = xml2js.Parser();

async function createMariadbConnectionPool() {
    let tempPool;
    try {
        tempPool = mariadb.createPool({
            host: "localhost",
            user: "root",
            password: "kyc_service",
            database: "kyc_test",
            connectionLimit: 20
        });
    } catch (err) {
        throw err;
    }
    return tempPool;
}
async function test(){
    let pool =  await createMariadbConnectionPool();
    await fundlistReader(pool);
}
if(process.argv[2] == "run"){
    test();
}
async function fundlistReader(pool) {
    fs.readFile(__dirname + "/uploads/FUNDLIST_I110.xml", 'utf8', async function (err, data) {
        await fsrv_prodParser(err, data, pool);
        //await fsrv_prod_modelParser(err, data);
        //await fsrv_minsParser(err,data);
        //await fsrv_elig_provParser(err, data);
        //await fsrv_elig_trxnParser(err, data);
        //await fsrv_elig_acct_typesParser(err, data);
        //await fsrv_elig_div_optParser(err, data);
    });
}
async function fsrv_prodParser(err, data, pool) {
    parser.parseString(data, async function (err, result) {
        let completedNum = 0;
        let bulkContent = [];
        let bulkContentSpot = 0;
        let curProdArray = [];
        let selectedProduct = "";
        let fundListNum = result.FundSetup.FundList.length;
        let currMgmtCode = "";
        let currCutOffTime = "";
        let effDate = result.FundSetup.Date[0];
        effDate = effDate.substring(0, 4) + "-" + effDate.substring(4, 6) + "-"
            + effDate.substring(6, 8);
        for (let a = 0; a < fundListNum; a++) {
            currMgmtCode = result.FundSetup.FundList[a].MgmtCode[0];
            let investProductNum = result.FundSetup.FundList[a].InvstProduct.length;
            for (let b = 0; b < investProductNum; b++) {
                selectedProduct = result.FundSetup.FundList[a].InvstProduct[b];
                curProdArray[0] = currMgmtCode;
                curProdArray[1] = effDate;
                curProdArray[2] = selectedProduct.FundID[0];
                curProdArray[3] = selectedProduct.FundLinkID[0];
                currCutOffTime = selectedProduct.CutoffTime[0];
                curProdArray[4] = currCutOffTime.substring(0, 2) +
                    ":" + currCutOffTime.substring(2, 4) + ":" +
                    currCutOffTime.substring(4, 6);
                curProdArray[5] = selectedProduct.MgmtCoBrandNm[0];
                curProdArray[6] = selectedProduct.FundName[0].EngName[0].ShortName[0];
                curProdArray[7] = selectedProduct.FundName[0].EngName[0].LongName[0];
                curProdArray[8] = selectedProduct.FundName[0].FreName[0].ShortName[0];
                curProdArray[9] = selectedProduct.FundName[0].FreName[0].LongName[0];
                curProdArray[10] = selectedProduct.Properties[0].ProductType[0];
                curProdArray[11] = selectedProduct.Properties[0].Currency[0];
                curProdArray[12] = selectedProduct.Properties[0].LoadType[0];
                if (selectedProduct.Properties[0].Classification) {
                    curProdArray[13] = parseFloat(selectedProduct.Properties[0].Classification[0]);
                } else {
                    curProdArray[13] = null;
                }
                curProdArray[14] = selectedProduct.Properties[0].TaxStructure[0];
                curProdArray[15] = selectedProduct.Properties[0].MoneyMrktFlg[0];
                curProdArray[16] = selectedProduct.Properties[0].BareTrusteeFlg[0];
                curProdArray[17] = selectedProduct.Properties[0].RiskClass[0];
                curProdArray[18] = parseFloat(selectedProduct.Properties[0].FeeComm[0].AcctSetupFee[0]);
                curProdArray[19] = parseFloat(selectedProduct.Properties[0].FeeComm[0].ServFee[0].ServFeeRate[0]);
                curProdArray[20] = selectedProduct.Properties[0].FeeComm[0].ServFee[0].ServFeeFreq[0];
                curProdArray[21] = parseFloat(selectedProduct.Properties[0].FeeComm[0].MaxComm[0]);
                curProdArray[22] = parseFloat(selectedProduct.Properties[0].FeeComm[0].MaxSwitchComm[0]);
                if(selectedProduct.Properties[0].Series){
                    curProdArray[23] = selectedProduct.Properties[0].Series[0];
                }else {
                    curProdArray[23] = null;
                }
                if(selectedProduct.Properties[0].Class){
                    curProdArray[24] = selectedProduct.Properties[0].Class[0];
                }else {
                    curProdArray[24] = null;
                }
                curProdArray[25] = selectedProduct.Properties[0].RegDocType[0];
                curProdArray[26] = selectedProduct.Eligible[0].EligUS[0];
                curProdArray[27] = selectedProduct.Eligible[0].EligOffshore[0];
                curProdArray[28] = selectedProduct.Eligible[0].EligPAC[0];
                curProdArray[29] = selectedProduct.Eligible[0].EligSWP[0];
                if(selectedProduct.CUSIP){
                    curProdArray[30] = selectedProduct.CUSIP[0];
                }else {
                    curProdArray[30] = null;
                }
                if(selectedProduct.Properties[0].DiscBrokerOnly){
                    curProdArray[31] = selectedProduct.Properties[0].DiscBrokerOnly[0];
                }else {
                    curProdArray[31] = null;
                }
                if(selectedProduct.Properties[0].Brand){
                    curProdArray[32] = selectedProduct.Properties[0].Brand[0];
                }else {
                    curProdArray[32] = null;
                }
                if(selectedProduct.Properties[0].FeeComm[0].DSCSchedule){
                    curProdArray[33] = selectedProduct.Properties[0].FeeComm[0].DSCSchedule[0].DSC[0];
                    curProdArray[34] = selectedProduct.Properties[0].FeeComm[0].DSCSchedule[0].DSCDuration[0];
                }else {
                    curProdArray[33] = null;
                    curProdArray[34] = null;
                }
                if(selectedProduct.Properties[0].EligFeeAcct){
                    curProdArray[35] = selectedProduct.Properties[0].EligFeeAcct[0];
                }else {
                    curProdArray[35] =  null;
                }
                if(selectedProduct.ISIN){
                    curProdArray[36] = selectedProduct.ISIN[0];
                }else {
                    curProdArray[36] = null;
                }
                if(selectedProduct.Properties[0].NegotiateFee){
                    curProdArray[37] = selectedProduct.Properties[0].NegotiateFee[0];
                }else {
                    curProdArray[37] = null;
                }
                if(selectedProduct.Properties[0].NegotiateTrail){
                    curProdArray[38] = selectedProduct.Properties[0].NegotiateTrail[0];
                }else {
                    curProdArray[38] = null;
                }
                if(selectedProduct.Properties[0].SerClassSeq){
                    curProdArray[39] = selectedProduct.Properties[0].SerClassSeq[0];
                }else {
                    curProdArray[39] = null;
                }
                completedNum++;
                bulkContent[bulkContentSpot] = curProdArray;
                bulkContentSpot++;
                if (completedNum == 1000) {
                    await bulkInsert(pool, bulkContent, "INSERT INTO fsrv_prod(MGMT_CODE, EFF_DT, FUND_ID, FUND_LINK_ID," + 
                    " CUT_OFF_TIME, MGMT_CO_BRAND_NM, ENG_SHORT_NM, ENG_LONG_NM, FRE_SHORT_NM, FRE_LONG_NM, PROD_TYPE," +
                    " CURR, LOAD_TYPE, CLASSIFICATION, TAX_STRUCT, MM_FLAG, BARE_TRUSTEE_FLAG, RISK_CLASS, ACCT_SETUP_FEE," +
                    " SERV_FEE_RATE, SERV_FEE_FREQ, MAX_COMM, MAX_SW_COMM, SERIES, CLASS, REG_DOC_TYPE, ELIG_US," + 
                    " ELIG_OFFSHORE, ELIG_PAC, ELIG_SWP, CUSIP, DISC_BROKER_ONLY, BRAND, DSC, DSC_DURATION," +
                    " FEE_BASED_ELIG, ISIN, NEGOT_FEE, NEGOT_TRAILER, SER_CLASS_SEQ_IN_NAME)" + 
                    " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
                    bulkContentSpot = 0;
                    bulkContent = [];
                    completedNum = 0;
                }
                curProdArray = [];
            }
        }
        if (bulkContent[0] != null) {
            await bulkInsert(pool, bulkContent, "INSERT INTO fsrv_prod(MGMT_CODE, EFF_DT, FUND_ID, FUND_LINK_ID," + 
            " CUT_OFF_TIME, MGMT_CO_BRAND_NM, ENG_SHORT_NM, ENG_LONG_NM, FRE_SHORT_NM, FRE_LONG_NM, PROD_TYPE," +
            " CURR, LOAD_TYPE, CLASSIFICATION, TAX_STRUCT, MM_FLAG, BARE_TRUSTEE_FLAG, RISK_CLASS, ACCT_SETUP_FEE," +
            " SERV_FEE_RATE, SERV_FEE_FREQ, MAX_COMM, MAX_SW_COMM, SERIES, CLASS, REG_DOC_TYPE, ELIG_US," + 
            " ELIG_OFFSHORE, ELIG_PAC, ELIG_SWP, CUSIP, DISC_BROKER_ONLY, BRAND, DSC, DSC_DURATION," +
            " FEE_BASED_ELIG, ISIN, NEGOT_FEE, NEGOT_TRAILER, SER_CLASS_SEQ_IN_NAME)" + 
            " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        }
        pool.end();
        //console.log(bulkContent);
    });
}
async function fsrv_prod_modelParser(err, data) {
    parser.parseString(data, async function (err, result) {
        let completedNum = 0;
        let bulkContent = [];
        let bulkContentSpot = 0;
        let curProdArray = [];
        let selectedProduct = "";
        let currentObject = "";
        let currentSEQ_ID = 0;
        let currentType = "";
        let currentFreq = "";
        let currentSettlPeriod = null;
        let sql = "";
        let fundListNum = result.FundSetup.FundList.length;
        for (let a = 0; a < fundListNum; a++) {
            let investProductNum = result.FundSetup.FundList[a].InvstProduct.length;
            for (let b = 0; b < investProductNum; b++) {
                selectedProduct = result.FundSetup.FundList[a].InvstProduct[b];
                sql = "SELECT FSRV_ID FROM fsrv_prod WHERE (MGMT_CODE='" +
                    result.FundSetup.FundList[a].MgmtCode[0] + "') AND (FUND_ID='" +
                    selectedProduct.FundID[0] + "')";
                currentSEQ_ID = await selectQuery(sql);
                //Adding products models to the bulk content
                currentObject = selectedProduct.Model[0];
                if(currentObject.FundModel){
                    currentType = "FUND";
                    currentSubObject = currentObject.FundModel[0];
                    if(currentSubObject.Daily){
                        currentFreq = "D";
                        currentSubObject = currentSubObject.Daily[0];
                        if(currentSubObject.SettlPeriod){
                            currentSettlPeriod = currentSubObject.SettlPeriod[0];
                        }
                    } else if(currentSubObject.Weekly){
                        currentFreq = "W";
                        currentSubObject = currentSubObject.Weekly[0];
                        if(currentSubObject.SettlPeriod){
                            currentSettlPeriod = currentSubObject.SettlPeriod[0];
                        }
                    }else if(currentSubObject.Monthly){
                        currentFreq = "M";
                        currentSubObject = currentSubObject.Monthly[0];
                        if(currentSubObject.SettlPeriod){
                            currentSettlPeriod = currentSubObject.SettlPeriod[0];
                        }
                    }else if(currentSubObject.SemiMonthly){
                        currentFreq = "S";
                        currentSubObject = currentSubObject.SemiMonthly[0];
                        if(currentSubObject.SettlPeriod){
                            currentSettlPeriod = currentSubObject.SettlPeriod[0];
                        }
                    }else if(currentSubObject.Custom){
                        currentFreq = "C";
                        currentSubObject = currentSubObject.Custom[0];
                        if(currentSubObject.SettlPeriod){
                            currentSettlPeriod = currentSubObject.SettlPeriod[0];
                        }
                    }
                    curProdArray = [];
                    curProdArray[0] = currentSEQ_ID;
                    curProdArray[1] = currentType;
                    curProdArray[2] = currentFreq;
                    curProdArray[3] = currentSettlPeriod;
                    bulkContent[bulkContentSpot] = curProdArray;
                    bulkContentSpot++;
                    completedNum++;
                }
                if(currentObject.BuyModel){
                    currentType = "BUY";
                    currentSubObject = currentObject.BuyModel[0];
                    if(currentSubObject.Daily){
                        currentFreq = "D";
                        currentSubObject = currentSubObject.Daily[0];
                        if(currentSubObject.SettlPeriod){
                            currentSettlPeriod = currentSubObject.SettlPeriod[0];
                        }
                    } else if(currentSubObject.Weekly){
                        currentFreq = "W";
                        currentSubObject = currentSubObject.Weekly[0];
                        if(currentSubObject.SettlPeriod){
                            currentSettlPeriod = currentSubObject.SettlPeriod[0];
                        }
                    }else if(currentSubObject.Monthly){
                        currentFreq = "M";
                        currentSubObject = currentSubObject.Monthly[0];
                        if(currentSubObject.SettlPeriod){
                            currentSettlPeriod = currentSubObject.SettlPeriod[0];
                        }
                    }else if(currentSubObject.SemiMonthly){
                        currentFreq = "S";
                        currentSubObject = currentSubObject.SemiMonthly[0];
                        if(currentSubObject.SettlPeriod){
                            currentSettlPeriod = currentSubObject.SettlPeriod[0];
                        }
                    }else if(currentSubObject.Custom){
                        currentFreq = "C";
                        currentSubObject = currentSubObject.Custom[0];
                        if(currentSubObject.SettlPeriod){
                            currentSettlPeriod = currentSubObject.SettlPeriod[0];
                        }
                    }
                    curProdArray = [];
                    curProdArray[0] = currentSEQ_ID;
                    curProdArray[1] = currentType;
                    curProdArray[2] = currentFreq;
                    curProdArray[3] = currentSettlPeriod;
                    bulkContent[bulkContentSpot] = curProdArray;
                    bulkContentSpot++;
                    completedNum++;
                }
                if(currentObject.SellModel){
                    currentType = "SELL";
                    currentSubObject = currentObject.SellModel[0];
                    if(currentSubObject.Daily){
                        currentFreq = "D";
                        currentSubObject = currentSubObject.Daily[0];
                        if(currentSubObject.SettlPeriod){
                            currentSettlPeriod = currentSubObject.SettlPeriod[0];
                        }
                    } else if(currentSubObject.Weekly){
                        currentFreq = "W";
                        currentSubObject = currentSubObject.Weekly[0];
                        if(currentSubObject.SettlPeriod){
                            currentSettlPeriod = currentSubObject.SettlPeriod[0];
                        }
                    }else if(currentSubObject.Monthly){
                        currentFreq = "M";
                        currentSubObject = currentSubObject.Monthly[0];
                        if(currentSubObject.SettlPeriod){
                            currentSettlPeriod = currentSubObject.SettlPeriod[0];
                        }
                    }else if(currentSubObject.SemiMonthly){
                        currentFreq = "S";
                        currentSubObject = currentSubObject.SemiMonthly[0];
                        if(currentSubObject.SettlPeriod){
                            currentSettlPeriod = currentSubObject.SettlPeriod[0];
                        }
                    }else if(currentSubObject.Custom){
                        currentFreq = "C";
                        currentSubObject = currentSubObject.Custom[0];
                        if(currentSubObject.SettlPeriod){
                            currentSettlPeriod = currentSubObject.SettlPeriod[0];
                        }
                    }
                    curProdArray = [];
                    curProdArray[0] = currentSEQ_ID;
                    curProdArray[1] = currentType;
                    curProdArray[2] = currentFreq;
                    curProdArray[3] = currentSettlPeriod;
                    bulkContent[bulkContentSpot] = curProdArray;
                    bulkContentSpot++;
                    completedNum++;
                }
                if (completedNum >= 1000) {
                    await bulkInsert(bulkContent, "INSERT INTO fsrv_prod_model(SEQ_ID, TYPE, FREQ, SETTLE_PERIOD) values (?,?,?,?)");
                    bulkContentSpot = 0;
                    bulkContent = [];
                    completedNum = 0;
                }
            }
        }
        if (bulkContent[0] != null) {
            await bulkInsert(bulkContent, "INSERT INTO fsrv_prod_model(SEQ_ID, TYPE, FREQ, SETTLE_PERIOD) values (?,?,?,?)");
        }
        pool.end();
        //console.log(bulkContent);
    });
}
async function fsrv_minsParser(err, data) {
    parser.parseString(data, async function (err, result) {
        let completedNum = 0;
        let bulkContent = [];
        let bulkContentSpot = 0;
        let curProdArray = [];
        let selectedProduct = "";
        let curProdSpot = 0;
        let sql = "";
        let fundListNum = result.FundSetup.FundList.length;
        for (let a = 0; a < fundListNum; a++) {
            let investProductNum = result.FundSetup.FundList[a].InvstProduct.length;
            for (let b = 0; b < investProductNum; b++) {
                selectedProduct = result.FundSetup.FundList[a].InvstProduct[b];
                sql = "SELECT FSRV_ID FROM fsrv_prod WHERE (MGMT_CODE='" +
                    result.FundSetup.FundList[a].MgmtCode[0] + "') AND (FUND_ID='" +
                    selectedProduct.FundID[0] + "')";
                curProdArray[0] = await selectQuery(sql);
                curProdSpot++;
                //Adding minimums to the bulk content
                currentObject = selectedProduct.Minimums[0];
                currentKeys = Object.keys(currentObject);
                for (let i = 0; i < currentKeys.length; i++) {
                    currentSubObject = currentObject[currentKeys[i]];
                    curProdArray[curProdSpot] = parseFloat(currentSubObject[0]);
                    curProdSpot++;
                }
                completedNum++;
                bulkContent[bulkContentSpot] = curProdArray;
                bulkContentSpot++;
                if (completedNum == 1000) {
                    await bulkInsert(bulkContent, "INSERT INTO fsrv_mins(SEQ_ID, MIN_FIRST, MIN_NXT, MIN_SELL, MIN_SW, MIN_TRSF, MIN_BAL, MIN_PAC, MIN_SWP) values (?,?,?,?,?,?,?,?,?)");
                    bulkContentSpot = 0;
                    bulkContent = [];
                    completedNum = 0;
                }
                curProdSpot = 0;
                curProdArray = [];
            }
        }
        await bulkInsert(bulkContent, "INSERT INTO fsrv_mins(SEQ_ID, MIN_FIRST, MIN_NXT, MIN_SELL, MIN_SW, MIN_TRSF, MIN_BAL, MIN_PAC, MIN_SWP) values (?,?,?,?,?,?,?,?,?)");
        pool.end();
        //console.log(bulkContent);
    });
}
async function fsrv_elig_provParser(err, data) {
    parser.parseString(data, async function (err, result) {
        let provinceList = ["AB", "BC", "MB", "NB", "NL", "NT",
            "NS", "NU", "ON", "PE", "QC", "SK", "YT"];
        let completedNum = 0;
        let bulkContent = [];
        let bulkContentSpot = 0;
        let currentSEQ_ID = 0;
        let curProdArray = [];
        let selectedProduct = "";
        let sql = "";
        let fundListNum = result.FundSetup.FundList.length;
        for (let a = 0; a < fundListNum; a++) {
            let investProductNum = result.FundSetup.FundList[a].InvstProduct.length;
            for (let b = 0; b < investProductNum; b++) {
                selectedProduct = result.FundSetup.FundList[a].InvstProduct[b];
                sql = "SELECT FSRV_ID FROM fsrv_prod WHERE (MGMT_CODE='" +
                    result.FundSetup.FundList[a].MgmtCode[0] + "') AND (FUND_ID='" +
                    selectedProduct.FundID[0] + "')";
                currentSEQ_ID = await selectQuery(sql);
                //Adding eligible provinces to the bulk content
                if (selectedProduct.Eligible[0].EligProv) {
                    currentObject = selectedProduct.Eligible[0].EligProv[0].ProvState;
                    for (let i = 0; i < provinceList.length; i++) {
                        if (currentObject.indexOf(provinceList[i]) > -1) {
                            curProdArray = [];
                            curProdArray[0] = currentSEQ_ID;
                            curProdArray[1] = provinceList[i];
                            bulkContent[bulkContentSpot] = curProdArray;
                            bulkContentSpot++;
                            completedNum++;
                        }
                    }
                }
                if (completedNum >= 1000) {
                    await bulkInsert(bulkContent, "INSERT INTO fsrv_elig_prov(SEQ_ID, PROV_STATE) values (?,?)");
                    bulkContentSpot = 0;
                    bulkContent = [];
                    completedNum = 0;
                }
            }
        }
        await bulkInsert(bulkContent, "INSERT INTO fsrv_elig_prov(SEQ_ID, PROV_STATE) values (?,?)");
        pool.end();
        //console.log(bulkContent);
    });
}
async function fsrv_elig_trxnParser(err, data) {
    parser.parseString(data, async function (err, result) {
        let completedNum = 0;
        let bulkContent = [];
        let bulkContentSpot = 0;
        let currentSEQ_ID = 0;
        let curProdArray = [];
        let selectedProduct = "";
        let sql = "";
        let fundListNum = result.FundSetup.FundList.length;
        for (let a = 0; a < fundListNum; a++) {
            let investProductNum = result.FundSetup.FundList[a].InvstProduct.length;
            for (let b = 0; b < investProductNum; b++) {
                selectedProduct = result.FundSetup.FundList[a].InvstProduct[b];
                sql = "SELECT FSRV_ID FROM fsrv_prod WHERE (MGMT_CODE='" +
                    result.FundSetup.FundList[a].MgmtCode[0] + "') AND (FUND_ID='" +
                    selectedProduct.FundID[0] + "')";
                currentSEQ_ID = await selectQuery(sql);
                //Adding eligible transactions to the bulk content
                currentObject = selectedProduct.Eligible[0].EligTrxn[0];
                currentKeys = Object.keys(currentObject);
                for (let i = 0; i < currentKeys.length; i++) {
                    currentSubObject = currentObject[currentKeys[i]];
                    curProdArray = [];
                    curProdArray[0] = currentSEQ_ID;
                    switch (i) {
                        case (0):
                            curProdArray[1] = "B";
                            break;
                        case (1):
                            curProdArray[1] = "CR";
                            break;
                        case (2):
                            curProdArray[1] = "SI";
                            break;
                        case (3):
                            curProdArray[1] = "SO";
                            break;
                        case (4):
                            curProdArray[1] = "S";
                            break;
                        case (5):
                            curProdArray[1] = "II";
                            break;
                        case (6):
                            curProdArray[1] = "IO";
                            break;
                        case (7):
                            curProdArray[1] = "EI";
                            break;
                        case (8):
                            curProdArray[1] = "EO";
                            break;
                        case (9):
                            curProdArray[1] = "LI";
                            break;
                        case (10):
                            curProdArray[1] = "LO";
                            break;
                        case (11):
                            curProdArray[1] = "F";
                            break;
                        case (12):
                            curProdArray[1] = "R";
                            break;
                        case (13):
                            curProdArray[1] = "CI";
                            break;
                        case (14):
                            curProdArray[1] = "CO";
                            break;
                        case (15):
                            curProdArray[1] = "SM";
                            break;
                    }
                    curProdArray[2] = currentSubObject[0];
                    bulkContent[bulkContentSpot] = curProdArray;
                    bulkContentSpot++;
                    completedNum++;
                }
                if (completedNum >= 1000) {
                    await bulkInsert(bulkContent, "INSERT INTO fsrv_elig_trxn(SEQ_ID, TRXN_TYPE, TRXN_STATUS) values (?,?,?)");
                    bulkContentSpot = 0;
                    bulkContent = [];
                    completedNum = 0;
                }
            }
        }
        await bulkInsert(bulkContent, "INSERT INTO fsrv_elig_trxn(SEQ_ID, TRXN_TYPE, TRXN_STATUS) values (?,?,?)");
        pool.end();
        //console.log(bulkContent);
    });
}
async function fsrv_elig_acct_typesParser(err, data) {
    parser.parseString(data, async function (err, result) {
        let accountTypeList = ["01", "02", "04", "05", "06", "07", "08", "10", "11", "12", "13", "14",
            "15", "16", "17", "18", "19", "20", "21"];
        let completedNum = 0;
        let bulkContent = [];
        let bulkContentSpot = 0;
        let currentSEQ_ID = 0;
        let curProdArray = [];
        let selectedProduct = "";
        let sql = "";
        let fundListNum = result.FundSetup.FundList.length;
        for (let a = 0; a < fundListNum; a++) {
            let investProductNum = result.FundSetup.FundList[a].InvstProduct.length;
            for (let b = 0; b < investProductNum; b++) {
                selectedProduct = result.FundSetup.FundList[a].InvstProduct[b];
                sql = "SELECT FSRV_ID FROM fsrv_prod WHERE (MGMT_CODE='" +
                    result.FundSetup.FundList[a].MgmtCode[0] + "') AND (FUND_ID='" +
                    selectedProduct.FundID[0] + "')";
                currentSEQ_ID = await selectQuery(sql);
                //Adding eligible account types to the bulk content
                if (selectedProduct.Eligible[0].CNAcctTypes && selectedProduct.Eligible[0].CNAcctTypes[0].ALL) {
                    for (let i = 0; i < accountTypeList.length; i++) {
                        curProdArray = [];
                        curProdArray[0] = currentSEQ_ID;
                        curProdArray[1] = "1";
                        curProdArray[2] = accountTypeList[i];
                        bulkContent[bulkContentSpot] = curProdArray;
                        bulkContentSpot++;
                        completedNum++;
                    }
                } else if (selectedProduct.Eligible[0].CNAcctTypes) {
                    currentObject = selectedProduct.Eligible[0].CNAcctTypes[0].AcctTypes[0].AcctType;
                    for (let i = 0; i < accountTypeList.length; i++) {
                        if (currentObject.indexOf(accountTypeList[i]) > -1) {
                            curProdArray = [];
                            curProdArray[0] = currentSEQ_ID;
                            curProdArray[1] = "1";
                            curProdArray[2] = accountTypeList[i];
                            bulkContent[bulkContentSpot] = curProdArray;
                            bulkContentSpot++;
                            completedNum++;
                        }
                    }
                }

                if (selectedProduct.Eligible[0].NomAcctTypes && selectedProduct.Eligible[0].NomAcctTypes[0].ALL) {
                    for (let i = 0; i < accountTypeList.length; i++) {
                        curProdArray = [];
                        curProdArray[0] = currentSEQ_ID;
                        curProdArray[1] = "2";
                        curProdArray[2] = accountTypeList[i];
                        bulkContent[bulkContentSpot] = curProdArray;
                        bulkContentSpot++;
                        completedNum++;
                    }
                } else if (selectedProduct.Eligible[0].NomAcctTypes) {
                    currentObject = selectedProduct.Eligible[0].NomAcctTypes[0].AcctTypes[0].AcctType;
                    for (let i = 0; i < accountTypeList.length; i++) {
                        if (currentObject.indexOf(accountTypeList[i]) > -1) {
                            curProdArray = [];
                            curProdArray[0] = currentSEQ_ID;
                            curProdArray[1] = "2";
                            curProdArray[2] = accountTypeList[i];
                            bulkContent[bulkContentSpot] = curProdArray;
                            bulkContentSpot++;
                            completedNum++;
                        }
                    }
                }
                if (completedNum >= 1000) {
                    await bulkInsert(bulkContent, "INSERT INTO fsrv_elig_acct_types(SEQ_ID, DESIGNATION, ACCT_TYPE) values (?,?,?)");
                    bulkContentSpot = 0;
                    bulkContent = [];
                    completedNum = 0;
                }
            }
        }
        if (bulkContent[0] != null) {
            await bulkInsert(bulkContent, "INSERT INTO fsrv_elig_acct_types(SEQ_ID, DESIGNATION, ACCT_TYPE) values (?,?,?)");
        }
        pool.end();
        //console.log(bulkContent);
    });
}
async function fsrv_elig_div_optParser(err, data) {
    parser.parseString(data, async function (err, result) {
        let completedNum = 0;
        let bulkContent = [];
        let bulkContentSpot = 0;
        let curProdArray = [];
        let selectedProduct = "";
        let sql = "";
        let fundListNum = result.FundSetup.FundList.length;
        for (let a = 0; a < fundListNum; a++) {
            let investProductNum = result.FundSetup.FundList[a].InvstProduct.length;
            for (let b = 0; b < investProductNum; b++) {
                selectedProduct = result.FundSetup.FundList[a].InvstProduct[b];
                sql = "SELECT FSRV_ID FROM fsrv_prod WHERE (MGMT_CODE='" +
                    result.FundSetup.FundList[a].MgmtCode[0] + "') AND (FUND_ID='" +
                    selectedProduct.FundID[0] + "')";
                curProdArray[0] = await selectQuery(sql);
                //Adding eligible dividend options to the bulk content
                curProdArray[1] = selectedProduct.Eligible[0].EligDivOpt[0].DivFrequency[0];
                curProdArray[2] = selectedProduct.Eligible[0].EligDivOpt[0].DivOpt1[0];
                curProdArray[3] = selectedProduct.Eligible[0].EligDivOpt[0].DivOpt4[0];
                curProdArray[4] = selectedProduct.Eligible[0].EligDivOpt[0].DivOpt5[0];
                bulkContent[bulkContentSpot] = curProdArray;
                bulkContentSpot++;
                completedNum++;
                if (completedNum >= 1000) {
                    await bulkInsert(bulkContent, "INSERT INTO fsrv_elig_div_opt(SEQ_ID, DIV_FREQ, DIV_OPT_1, DIV_OPT_4, DIV_OPT_5) values (?,?,?,?,?)");
                    bulkContentSpot = 0;
                    bulkContent = [];
                    completedNum = 0;
                }
                curProdArray = [];
            }
        }
        if (bulkContent[0] != null) {
            await bulkInsert(bulkContent,  "INSERT INTO fsrv_elig_div_opt(SEQ_ID, DIV_FREQ, DIV_OPT_1, DIV_OPT_4, DIV_OPT_5) values (?,?,?,?,?)");
        }
        pool.end();
        //console.log(bulkContent);
    });
}
async function selectQuery(sql) {
    let con;
    let result;
    try {
        con = await pool.getConnection();
        result = await con.query(sql);
        result = result[0].FSRV_ID;
    } catch (queryError) {
        throw queryError;
    } finally {
        if (con) {
            con.release();
        }
    }
    return result;
}
async function query(sql, pool) {
    let con;
    let result;
    try {
        con = await pool.getConnection();
        result = await con.query(sql);
    } catch (queryError) {
        throw queryError;
    } finally {
        if (con) {
            con.release();
        }
    }
    return result;
}
async function bulkInsert(pool, bulkContent, sql) {
    let con;
    try {
        con = await pool.getConnection();
        if(con){
            con.beginTransaction();
            await con.batch(sql, bulkContent);
            con.commit();
        }
    } catch (batchError) {
        if (con) {
            con.rollback();
        }
        throw batchError;
    } finally {
        if (con) {
            con.release();
        }
    }
}
exports.createMariadbConnectionPool = createMariadbConnectionPool;
exports.query = query;
exports.fundlistReader = fundlistReader;
