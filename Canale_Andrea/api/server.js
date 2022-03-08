const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs')
const app = express();
const port = 3001;
const path = require('path');
const directoryPath = path.join(__dirname, './');
const { response } = require('express');
const readdb= require("./function/read.js")
const writedb=require("./function/write.js")
function close(){
  res.connection.close();
}
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post("/login", function(req,res){
  (async() => {
 
    res.send(await readdb(req.body.username, req.body.password));
  })();
});
app.post("/register", function(req,res){
  writedb(req.body.username,req.body.password,req.body.piano,req.body.pag,req.body.met).then(
    result=>{
      res.send(result)
    }
  )
  //res.send(writedb(req.body.username,req.body.password,req.body.piano,req.body.pag,req.body.met))
  
});

app.post("/folder", function(req,res){
  try {
    var arrayOfFiles = fs.readdirSync(req.body.user);
    console.log(arrayOfFiles)
    res.send(arrayOfFiles)
  } catch(e) {
    console.log(e)
    res.send("Error 500")
  }

});
app.post("/newfolder", function(req,res){
  fs.mkdir(path.join(req.body.user, 'test'), (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('Directory created successfully!');
});

});
app.post("/delete", function(req,res){
  try {
    fs.unlinkSync(req.body.user + '/' + req.body.file)
    console.log("Cancellato")
  } catch(err) {
    console.error(err)
  }
});

app.get("/", function(req,res){
res.send("Welcome to cloud API")
});
app.use(express.static('register'));
app.listen(port, () => console.log(`Server controller on port ${port}!`));
setTimeout(close,900000)
