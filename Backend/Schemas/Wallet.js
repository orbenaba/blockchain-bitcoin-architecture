const mongoose = require('mongoose');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
//customized
const db = require('./keysToRemote').MongoURI;

//Connecting the DB
mongoose.connect(db, {useNewUrlParser: true})
.then(console.log('[+] MongoDB connected ...'))
.catch(err=> console.error(err));

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
    let pair = await new Keys({publicKey, privateKey});
    await pair.save(function (err, inserted){
        console.log("nicdxiosxoia");
        if(err){
            throw new Error("Error in saving the keys on schema ...");
        }
        return [publicKey, privateKey];
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