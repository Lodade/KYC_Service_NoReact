const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const upload =  require("express-fileupload");
app.use(upload());
app.use(express.static(`${__dirname}`));
app.listen(PORT);
console.log("Listening on port 3000");

app.get("/", function(req,res){
    res.sendFile("frontend/index.html",{root: `${__dirname}`});
});
app.post("/test", async function(req,res){
    if(req.files){
        let files = req.files;
        let fileKeyArray = Object.keys(files);
        for(let i = 0;i < fileKeyArray.length;i++)
        {
           let currentFile = files[fileKeyArray[i]];
           console.log(currentFile);
           await currentFile.mv(`${__dirname}/uploads/` + currentFile.name); 
        }
    }
    res.send("Files received!");
});