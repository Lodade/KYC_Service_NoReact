const express = require("express");
const service = express();
const upload =  require("express-fileupload");
service.use(upload());
service.listen(3000);
console.log("Listening on port 3000");

service.get("/test", function(req,res){
    
});
service.post("/test", function(req,res){
    if(req.files){
        var file = req.files.xmlFileUpload;
        console.log(file);
        file.mv("./uploads/" + file.name);
        res.send("File received!");
    }
});