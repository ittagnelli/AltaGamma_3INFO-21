const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs')
const app = express();
const port = 3000;
const path = require('path');
var i=0;
const { response } = require('express');
function close(){
  res.connection.close();
}
var utenti={}
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post("/login", function(req,res){
  console.log(req.body.username)
  console.log(req.body.password)
    if(req.body.username=="admin"&&req.body.password=="admin"){
      res.send({status:1})
    }else{
      res.send({status:0})
    }
});
app.post("/register", function(req,res){
  var newuser=[req.body.username,req.body.pass];
  utenti[i]=newuser;
  i++;
  res.send({reg:1})
});
app.post("/folder", function(req,res){

});
app.get("/", function(req,res){
res.send("Welcome to cloud API")
});
app.use(express.static('register'));
app.listen(port, () => console.log(`Server controller on port ${port}!`));
setTimeout(close,900000)
