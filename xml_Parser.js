let xml2js = require("xml2js");
let fs = require("fs");
const e = require("express");
let mariadb = require("mariadb");
let parser = xml2js.Parser();
let pool;

async function createMariadbConnection() {
    try {
        pool = mariadb.createPool({
            host: "127.0.0.1",
            user: "root",
            password: "kyc_service",
            database: "kyc_test",
            connectionLimit: 5
        });
    } catch (err) {
        throw err;
    } finally {
        console.log("Pool Established!");
    }
}
createMariadbConnection();
fundlistReader();
async function fundlistReader() {
    fs.readFile(__dirname + "/uploads/FUNDLIST_I110.xml",'utf8', async function (err, data) {
        await fsrv_prodParser(err, data);
    });
}
async function fsrv_prodParser(err, data) {
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
                curProdArray[23] = selectedProduct.Properties[0].RegDocType[0];
                curProdArray[24] = selectedProduct.Eligible[0].EligUS[0];
                curProdArray[25] = selectedProduct.Eligible[0].EligOffshore[0];
                curProdArray[26] = selectedProduct.Eligible[0].EligPAC[0];
                curProdArray[27] = selectedProduct.Eligible[0].EligSWP[0];
                completedNum++;
                bulkContent[bulkContentSpot] = curProdArray;
                bulkContentSpot++;
                if (completedNum == 1000) {
                    await fsrv_prodBulkInsert(bulkContent);
                    bulkContentSpot = 0;
                    bulkContent = [];
                    completedNum = 0;
                }
                curProdArray = [];
            }
        }
        await fsrv_prodBulkInsert(bulkContent);
        pool.end();
        //console.log(bulkContent);
    });
}
async function fsrv_prodBulkInsert(bulkContent){
    let con;
    let sql = "INSERT INTO fsrv_prod(MGMT_CODE, EFF_DT, FUND_ID, FUND_LINK_ID, CUT_OFF_TIME, MGMT_CO_BRAND_NM, ENG_SHORT_NM, ENG_LONG_NM, FRE_SHORT_NM, FRE_LONG_NM, PROD_TYPE, CURR, LOAD_TYPE, CLASSIFICATION, TAX_STRUCT, MM_FLAG, BARE_TRUSTEE_FLAG, RISK_CLASS, ACCT_SETUP_FEE, SERV_FEE_RATE, SERV_FEE_FREQ, MAX_COMM, MAX_SW_COMM, REG_DOC_TYPE, ELIG_US, ELIG_OFFSHORE, ELIG_PAC, ELIG_SWP) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    try {
        con = await pool.getConnection();
        con.beginTransaction();
        await con.batch(sql, bulkContent);
        con.commit();
        console.log("Query Completed Successfully!");
    } catch (batchError) {
        con.rollback();
        throw bulkContent + "\n" + batchError;
    } finally {
        if (con) {
            con.release();
        }
    }
}
async function fundlistParser(err, data) {
    parser.parseString(data, async function (err, result) {
        let provinceList = ["AB", "BC", "MB", "NB", "NL", "NT", "NS", "NU", "ON", "PE", "QC", "SK", "YT"];
        let accountTypeList = ["01", "02", "04", "05", "06", "07", "08", "10", "11", "12", "13", "14",
            "15", "16", "17", "18", "19", "20", "21"];
        let completedNum = 0;
        let bulkContent = "";
        let currentObject = "";
        let currentKeys = [];
        let currentSubObject = "";
        let selectedProduct = "";
        let firstProduct = true;
        let fundListNum = result.FundSetup.FundList.length;
        for (let a = 0; a < fundListNum; a++) {
            let investProductNum = result.FundSetup.FundList[a].InvstProduct.length;
            for (let b = 0; b < investProductNum; b++) {
                try {
                    if (firstProduct == true) {
                        firstProduct = false;
                    } else {
                        bulkContent += ",";
                    }
                    bulkContent += "(";
                    selectedProduct = result.FundSetup.FundList[a].InvstProduct[b];
                    bulkContent += parseFloat(selectedProduct.FundID[0]) + ",";
                    bulkContent += "'" + selectedProduct.FundLinkID[0] + "'" + ",";
                    bulkContent += parseFloat(selectedProduct.CutoffTime[0]) + ",";
                    bulkContent += "'" + selectedProduct.MgmtCoBrandNm[0] + "'" + ",";
                    bulkContent += "'" + selectedProduct.FundName[0].EngName[0].ShortName[0] + "'" + ",";
                    bulkContent += "'" + selectedProduct.FundName[0].EngName[0].LongName[0] + "'" + ",";
                    bulkContent += "'" + selectedProduct.FundName[0].FreName[0].ShortName[0] + "'" + ",";
                    bulkContent += "'" + selectedProduct.FundName[0].FreName[0].LongName[0] + "'" + ",";
                    if (selectedProduct.Model[0].FundModel[0].Daily) {
                        bulkContent += parseFloat(selectedProduct.Model[0].FundModel[0].Daily[0].SettlPeriod[0]) + ",";
                    } else if (selectedProduct.Model[0].FundModel[0].Monthly) {
                        bulkContent += parseFloat(selectedProduct.Model[0].FundModel[0].Monthly[0].SettlPeriod[0]) + ",";
                    }
                    bulkContent += "'" + selectedProduct.Properties[0].ProductType[0] + "'" + ",";
                    bulkContent += parseFloat(selectedProduct.Properties[0].Currency[0]) + ",";
                    bulkContent += "'" + selectedProduct.Properties[0].LoadType[0] + "'" + ",";
                    if (selectedProduct.Properties[0].Classification) {
                        bulkContent += parseFloat(selectedProduct.Properties[0].Classification[0]) + ",";
                    } else {
                        bulkContent += null + ",";
                    }
                    bulkContent += "'" + selectedProduct.Properties[0].TaxStructure[0] + "'" + ",";
                    bulkContent += "'" + selectedProduct.Properties[0].MoneyMrktFlg[0] + "'" + ",";
                    bulkContent += "'" + selectedProduct.Properties[0].BareTrusteeFlg[0] + "'" + ",";
                    bulkContent += parseFloat(selectedProduct.Properties[0].RiskClass[0]) + ",";
                    bulkContent += parseFloat(selectedProduct.Properties[0].FeeComm[0].AcctSetupFee[0]) + ",";
                    bulkContent += parseFloat(selectedProduct.Properties[0].FeeComm[0].ServFee[0].ServFeeRate[0]) + ",";
                    bulkContent += "'" + selectedProduct.Properties[0].FeeComm[0].ServFee[0].ServFeeFreq[0] + "'" + ",";
                    bulkContent += parseFloat(selectedProduct.Properties[0].FeeComm[0].MaxComm[0]) + ",";
                    bulkContent += parseFloat(selectedProduct.Properties[0].FeeComm[0].MaxSwitchComm[0]) + ",";
                    bulkContent += "'" + selectedProduct.Properties[0].RegDocType[0] + "'" + ",";
                    //Adding minimums to the bulk content
                    currentObject = selectedProduct.Minimums[0];
                    currentKeys = Object.keys(currentObject);
                    for (let i = 0; i < currentKeys.length; i++) {
                        currentSubObject = currentObject[currentKeys[i]];
                        bulkContent += parseFloat(currentSubObject[0]) + ",";
                    }
                    //Adding eligible provinces to the bulk content
                    if (selectedProduct.Eligible[0].EligProv) {
                        currentObject = selectedProduct.Eligible[0].EligProv[0].ProvState;
                        for (let i = 0; i < 13; i++) {
                            if (currentObject.indexOf(provinceList[i]) > -1) {
                                bulkContent += "'" + provinceList[i] + "'" + ",";
                            } else {
                                bulkContent += null + ",";
                            }
                        }
                    } else {
                        for (let i = 0; i < 13; i++) {
                            bulkContent += null + ",";
                        }
                    }
                    //Adding eligible transaction entries to the bulk content
                    currentObject = selectedProduct.Eligible[0].EligTrxn[0];
                    currentKeys = Object.keys(currentObject);
                    for (let i = 0; i < currentKeys.length; i++) {
                        currentSubObject = currentObject[currentKeys[i]];
                        bulkContent += "'" + currentSubObject[0] + "'" + ",";
                    }
                    bulkContent += "'" + selectedProduct.Eligible[0].EligUS[0] + "'" + ",";
                    bulkContent += "'" + selectedProduct.Eligible[0].EligOffshore[0] + "'" + ",";
                    bulkContent += "'" + selectedProduct.Eligible[0].EligPAC[0] + "'" + ",";
                    bulkContent += "'" + selectedProduct.Eligible[0].EligSWP[0] + "'" + ",";
                    bulkContent += "'" + selectedProduct.Eligible[0].EligDivOpt[0].DivFrequency[0] + "'" + ",";
                    bulkContent += "'" + selectedProduct.Eligible[0].EligDivOpt[0].DivOpt1[0] + "'" + ",";
                    bulkContent += "'" + selectedProduct.Eligible[0].EligDivOpt[0].DivOpt4[0] + "'" + ",";
                    bulkContent += "'" + selectedProduct.Eligible[0].EligDivOpt[0].DivOpt5[0] + "'" + ",";
                    //Adding eligible account types to the bulk content
                    if (selectedProduct.Eligible[0].CNAcctTypes && selectedProduct.Eligible[0].CNAcctTypes[0].ALL) {
                        for (let i = 0; i < accountTypeList; i++) {
                            bulkContent += "'" + accountTypeList[i] + "'";
                        }
                    } else if (selectedProduct.Eligible[0].CNAcctTypes) {
                        currentObject = selectedProduct.Eligible[0].CNAcctTypes[0].AcctTypes[0].AcctType;
                        for (let i = 0; i < accountTypeList.length; i++) {
                            if (currentObject.indexOf(accountTypeList[i]) > -1) {
                                bulkContent += "'" + accountTypeList[i] + "'";
                                if (i < (accountTypeList.length - 1)) {
                                    bulkContent += ",";
                                }
                            } else {
                                bulkContent += null;
                                if (i < (accountTypeList.length - 1)) {
                                    bulkContent += ",";
                                }
                            }
                        }
                    } else {
                        for (let i = 0; i < accountTypeList.length; i++) {
                            bulkContent += null;
                            if (i < (accountTypeList.length - 1)) {
                                bulkContent += ",";
                            }
                        }
                    }
                    if (selectedProduct.Eligible[0].NomAcctTypes && selectedProduct.Eligible[0].NomAcctTypes[0].ALL) {
                        for (let i = 0; i < accountTypeList; i++) {
                            bulkContent += "'" + accountTypeList[i] + "'";
                        }
                    } else if (selectedProduct.Eligible[0].NomAcctTypes) {
                        currentObject = selectedProduct.Eligible[0].NomAcctTypes[0].AcctTypes[0].AcctType;
                        for (let i = 0; i < accountTypeList.length; i++) {
                            if (currentObject.indexOf(accountTypeList[i]) > -1) {
                                bulkContent += "'" + accountTypeList[i] + "'";
                                if (i < (accountTypeList.length - 1)) {
                                    bulkContent += ",";
                                }
                            } else {
                                bulkContent += null;
                                if (i < (accountTypeList.length - 1)) {
                                    bulkContent += ",";
                                }
                            }
                        }
                    } else {
                        for (let i = 0; i < accountTypeList.length; i++) {
                            bulkContent += null;
                            if (i < (accountTypeList.length - 1)) {
                                bulkContent += ",";
                            }
                        }
                    }
                    bulkContent += ")";
                    completedNum++;
                    if (completedNum == 1000) {
                        bulkContent = "";
                        completedNum = 0;
                        firstProduct = true;
                    }
                } catch (err) {
                    console.log("Current Fund: " + selectedProduct.MgmtCoBrandNm[0] +
                        "\n" + "Current product: " + selectedProduct.FundID[0] +
                        "\n" + err.stack);
                }
            }
        }
        console.log(bulkContent);
    });
}
