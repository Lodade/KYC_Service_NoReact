let xml2js = require("xml2js");
let fs = require("fs");
const e = require("express");
const { Console } = require("console");

let parser = xml2js.Parser();
fs.readFile(__dirname + "/uploads/FUNDLIST_I110.xml", function(err, data){
    parser.parseString(data, function(err, result){
        let provinceList = ["AB","BC","MB","NB","NL","NT","NS","NU","ON","PE","QC","SK","YT"];
        let accountTypeList = ["01","02","04","05","06","07","08","10","11","12","13","14",
        "15","16","17","18","19","20","21"];
        let completedNum = 0;
        let bulkContent = "";
        let currentObject = "";
        let currentKeys = [];
        let currentSubObject = "";
        let selectedProduct = "";
        let firstProduct = true;
        let fundListNum = result.FundSetup.FundList.length;
        for(let a = 0;a < fundListNum;a++)
        {
            let investProductNum = result.FundSetup.FundList[a].InvstProduct.length;
            for(let b = 0;b < investProductNum;b++)
            {
                try{
                    if(firstProduct == true)
                    {
                        firstProduct = false;
                    } else {
                        bulkContent += ",";
                    }
                    bulkContent += "(";
                    selectedProduct = result.FundSetup.FundList[a].InvstProduct[b];
                    bulkContent += parseFloat(selectedProduct.FundID[0]) + ",";
                    bulkContent += "'" + selectedProduct.FundLinkID[0] + "'" + ",";
                    bulkContent += parseFloat(selectedProduct.CutoffTime[0]) + ",";
                    bulkContent += "'" + selectedProduct.MgmtCoBrandNm[0]+ "'" + ",";
                    bulkContent += "'" + selectedProduct.FundName[0].EngName[0].ShortName[0] + "'" + ",";
                    bulkContent += "'" + selectedProduct.FundName[0].EngName[0].LongName[0] + "'" + ",";
                    bulkContent += "'" + selectedProduct.FundName[0].FreName[0].ShortName[0] + "'" + ",";
                    bulkContent += "'" + selectedProduct.FundName[0].FreName[0].LongName[0] + "'" + ",";
                    if(selectedProduct.Model[0].FundModel[0].Daily)
                    {
                        bulkContent += parseFloat(selectedProduct.Model[0].FundModel[0].Daily[0].SettlPeriod[0]) + ",";
                    } else if(selectedProduct.Model[0].FundModel[0].Monthly)
                    {
                        bulkContent += parseFloat(selectedProduct.Model[0].FundModel[0].Monthly[0].SettlPeriod[0]) + ",";
                    }
                    bulkContent += "'" + selectedProduct.Properties[0].ProductType[0] + "'" + ",";
                    bulkContent += parseFloat(selectedProduct.Properties[0].Currency[0]) + ",";
                    bulkContent += "'" + selectedProduct.Properties[0].LoadType[0] + "'" + ",";
                    if(selectedProduct.Properties[0].Classification)
                    {
                        bulkContent += parseFloat(selectedProduct.Properties[0].Classification[0]) + ",";
                    } else {
                        bulkContent +=  null + ",";
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
                    for(let i = 0;i < currentKeys.length;i++)
                    {
                        currentSubObject = currentObject[currentKeys[i]];
                        bulkContent += parseFloat(currentSubObject[0]) + ","; 
                    }
                    //Adding eligible provinces to the bulk content
                    if(selectedProduct.Eligible[0].EligProv)
                    {
                        currentObject = selectedProduct.Eligible[0].EligProv[0].ProvState;
                        for(let i = 0;i < 13;i++)
                        {
                            if(currentObject.indexOf(provinceList[i]) > -1)
                            {
                                bulkContent += "'" + provinceList[i] + "'" + ",";  
                            } else {
                                bulkContent += null + ",";
                            }
                        }
                    } else {
                        for(let i = 0;i < 13;i++)
                        {
                            bulkContent += null + ",";
                        }
                    }
                    //Adding eligible transaction entries to the bulk content
                    currentObject = selectedProduct.Eligible[0].EligTrxn[0];
                    currentKeys = Object.keys(currentObject);
                    for(let i = 0;i < currentKeys.length;i++)
                    {
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
                    if(selectedProduct.Eligible[0].CNAcctTypes && selectedProduct.Eligible[0].CNAcctTypes[0].ALL)
                    {
                        for(let  i = 0;i < accountTypeList;i++)
                        {
                            bulkContent += "'" + accountTypeList[i] + "'"; 
                        }
                    } else if(selectedProduct.Eligible[0].CNAcctTypes){
                        currentObject = selectedProduct.Eligible[0].CNAcctTypes[0].AcctTypes[0].AcctType;
                        for(let i = 0;i < accountTypeList.length;i++)
                        {
                            if(currentObject.indexOf(accountTypeList[i]) > -1)
                            {
                                bulkContent += "'" + accountTypeList[i] + "'";
                                if(i < (accountTypeList.length - 1))
                                {
                                    bulkContent += ",";
                                }
                            } else {
                                bulkContent += null;
                                if(i < (accountTypeList.length - 1))
                                {
                                    bulkContent += ",";
                                }
                            }
                        }
                    }
                    if(selectedProduct.Eligible[0].NomAcctTypes && selectedProduct.Eligible[0].NomAcctTypes[0].ALL)
                    {
                        for(let  i = 0;i < accountTypeList;i++)
                        {
                            bulkContent += "'" + accountTypeList[i] + "'"; 
                        }
                    } else if(selectedProduct.Eligible[0].NomAcctTypes){
                        currentObject = selectedProduct.Eligible[0].NomAcctTypes[0].AcctTypes[0].AcctType;
                        for(let i = 0;i < accountTypeList.length;i++)
                        {
                            if(currentObject.indexOf(accountTypeList[i]) > -1)
                            {
                                bulkContent += "'" + accountTypeList[i] + "'";
                                if(i < (accountTypeList.length - 1))
                                {
                                    bulkContent += ",";
                                }
                            } else {
                                bulkContent += null;
                                if(i < (accountTypeList.length - 1))
                                {
                                    bulkContent += ",";
                                }
                            }
                        }
                    }
                    bulkContent += ")";
                    completedNum++;
                    if(completedNum == 1000)
                    {
                        bulkContent = "";
                        completedNum = 0;
                        firstProduct = true;
                    }
                } catch (err){
                    console.log("Current Fund: " + selectedProduct.MgmtCoBrandNm[0] + 
                    "\n" +  "Current product: " + selectedProduct.FundID[0] + 
                    "\n" + err.stack);
                }
            }
        }
        console.log(bulkContent);
    });
});