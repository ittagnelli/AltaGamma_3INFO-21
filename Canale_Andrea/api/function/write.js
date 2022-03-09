const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const db = getFirestore();
const ref = db.collection('credentials');
const collection = db.collection('credentials');
var check=0
async function write(user,pass,piano,paga,met) {
    await ref.doc(user).set({
        username:user, password:pass, spazio:piano, ciclo:paga, metodo:met
      });
}
module.exports= async function writedb(user,pass,piano,paga,met){
    const querySnapshot = await collection.get();
  querySnapshot.forEach((doc) => {
    if(user==`${doc.data().username}`){
        check++
    }
  });
if(check>0){
    check=0
    return {status:0}
}else{
    write(user,pass,piano,paga,met)
    return {status:1}
}
} 