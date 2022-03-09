var admin = require("firebase-admin");
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
var serviceAccount = require("../thecloud.json");
var check=0



    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://thecloud.firebaseio.com'
    });
    const db = getFirestore();

    const collection = db.collection('credentials');

module.exports=async function lettura(user,pass){
    const querySnapshot = await collection.get();
  querySnapshot.forEach((doc) => {
    if(user==`${doc.data().username}`&&pass==`${doc.data().password}`){
      check=1
    }
  });
  if(check==1){
    check=0;
    return {status:1};
    
  }else{
    return {status:0}
  }
  }
