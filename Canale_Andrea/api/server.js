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
const fileUpload = require('express-fileupload');

app.use(fileUpload());
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
      fs.mkdir(path.join('./users', req.body.username), (err) => {
        if (err) {
          res.send({status:500})
        }
        res.send({status:1})
    });
    }
  )

  
});

app.post("/folder", function(req,res){
  try {
    var arrayOfFiles = fs.readdirSync('./users/'+ req.body.user);
    res.send(arrayOfFiles)
  } catch(e) {
    console.log(e)
    res.send({status:500})
  }

});
app.post("/newfolder", function(req,res){
  try {
    fs.mkdirSync(path.join('./users/'+ req.body.user, req.body.folder));
  res.send({status:1})
  } catch (error) {
    res.send({status:501})
  }


});
app.post('/upload', function(req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath ='./users/' + req.body.user + '/' +  sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('<meta http-equiv="refresh" content="0; URL=http://localhost:3000/area/" />');
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
app.use(express.urlencoded({ extended: true }));
app.use(express.static('register'));
app.listen(port, () => console.log(`Server controller on port ${port}!`));
