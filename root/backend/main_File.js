const express = require("express");
const app = express();
const upload =  require("express-fileupload");
app.use(upload());
app.use(express.static(".."));
app.listen(3000);
console.log("Listening on port 3000");

app.get("/", function(req,res){
    res.sendFile("frontend/index.html",{root: ".."});
});
app.post("/test", async function(req,res){
    if(req.files){
        let files = req.files;
        let fileKeyArray = Object.keys(files);
        for(let i = 0;i < fileKeyArray.length;i++)
        {
           let currentFile = files[fileKeyArray[i]];
           console.log(currentFile);
           await currentFile.mv("./uploads/" + currentFile.name); 
        }
    }
    res.send("Files received!");
});