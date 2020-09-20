let xml2js = require("xml2js");
let fs = require("fs");
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");

let parser = xml2js.Parser();
fs.readFile(__dirname + "/uploads/FUNDLIST_I110.xml", function(err, data){
    parser.parseString(data, function(err, result){
        let selectedProduct = result.FundSetup.FundList[0].InvstProduct[0];
        console.dir(selectedProduct);
        let productKeys = Object.keys(selectedProduct);
        /*
        for(let i = 0;i < productKeys.length;i++){
            console.log(selectedProduct[productKeys[i]]);
        }
        */
    });
});