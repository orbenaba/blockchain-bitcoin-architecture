const mongoose = require('mongoose');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

//Keys schema
const KeysSchema = mongoose.Schema({
    publicKey:{
        type: String,
        required
    },
    privateKey:{
        type: String,
        required
    }
})
const Keys = mongoose.model('Keys', KeysSchema);

//Basic functions to use with the DB

//Generating pair of keys and inserting, returning em
function addNewKeys(){
    const genKeys = ec.genKeyPair();
    const publicKey = genKeys.getPublic('hex');
    const privateKey = genKeys.getPrivate('hex');
    const pair = new Keys({publicKey, privateKey});
    pair.save((err, inserted)=>{
        if(err){
            return console.error("Error in saving the keys on schema ...");
        }
        return inserted;
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
        return console.error("Error removing all the rows in the schema ...");
    })
}


module.exports = {KeysSchema, Keys, removeAllKeys, removePairOfKeys, addNewKeys};