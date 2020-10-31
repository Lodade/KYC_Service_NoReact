const express = require("express");
const fs = require("fs");
const xmlParser = require("./fileParser");
const upload =  require("express-fileupload");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(upload());
app.use(express.text());
app.use(express.static(`${__dirname}`));
app.listen(PORT);
console.log("Listening on port " + PORT);
let pool;

app.get("/", function(req, res){
    res.sendFile("frontend/index.html",{root: `${__dirname}`});
    console.log("Webpage served");
});
app.post("/test", async function(req, res){
    if(req.files){
        let files = req.files;
        let fileKeyArray = Object.keys(files);
        for(let i = 0;i < fileKeyArray.length;i++)
        {
           let currentFile = files[fileKeyArray[i]];
           console.log(currentFile);
           await currentFile.mv(`${__dirname}/uploads/` + currentFile.name);
           fs.readFile(`${__dirname}/uploads/` + currentFile.name, "utf8", (err, data) =>{
               if(err){
                   console.error(err);
                   return;
               }
               console.log(data);
           }); 
        }
    }
    res.send("Files received!");
});
app.post("/query", async function(req, res){
    let result;
    if(pool == undefined){
        pool = await xmlParser.createMariadbConnectionPool();
    }
    if(pool.getConnection){
        console.log("Query being sent to database");
        result = await xmlParser.query(req.body, pool);
    }else {
        console.log("Pool creation failed");
    }
    if(result != null){
        console.log("Query completed");
        res.send(result);
    }
});
