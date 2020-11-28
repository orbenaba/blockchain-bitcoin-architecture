const mongoose = require('mongoose');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


//Keys schema
const KeysSchema = new mongoose.Schema({
    publicKey:{
        type: String,
        required: true
    },
    privateKey:{
        type: String,
        required: true
    }
})
const Keys = mongoose.model('Keys', KeysSchema);

//Basic functions to use with the DB

//Generating pair of keys and inserting, returning em
async function addNewKeys(){
    const genKeys = ec.genKeyPair();
    const publicKey = genKeys.getPublic('hex');
    const privateKey = genKeys.getPrivate('hex');
    let pair = new Keys({publicKey, privateKey});
    pair.save()
        .then(item =>{
            console.log("Data saved in DB !");
            return pair;
        })
        .catch(err =>{
            console.error("Error in saving the Data ...");
        })
}

//Removing set of keys from the schema
function removePairOfKeys(pubKey, priKey){
    const removed = new Keys({pubKey, priKey});
    removed.remove((err, deleted)=>{
        if(err){
            return console.error("Error in removing the keys, maybe don't exist ...");
        }
        return deleted;
    })
}

//Removing all the rows of the schema
function removeAllKeys(){
    //{} means ALL
    KeysSchema.remove({},(err)=>{
        if(err)
            return console.error("Error removing all the rows in the schema ...");
    })
}


module.exports = {KeysSchema, Keys, removeAllKeys, removePairOfKeys, addNewKeys};