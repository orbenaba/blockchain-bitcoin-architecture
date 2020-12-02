const mongoose = require('../Backend/node_modules/mongoose');
const EC = require('../Backend/node_modules/elliptic').ec;
const ec = new EC('secp256k1');


//Users schema
const UserSchema = new mongoose.Schema({
    publicKey:{
        unique: true,
        type: String,
        required: true
    },
    privateKey:{
        type: String,
        required: true
    },
    //Note that this attribute does not appear in real Crypto-currency systems but I chose to add 
    //it, in order to facilitate with the users
    name:{
        type: String,
        required: false
    }
})



//Basic functions to use with the DB
UserSchema.statics.addUser = async (name)=>{
    const genKeys = ec.genKeyPair();
    const publicKey = genKeys.getPublic('hex');
    const privateKey = genKeys.getPrivate('hex');
    let user = new UserModel({publicKey, privateKey, name});
    await user.save()
        .then(item =>{
            console.log("Data saved in DB !");
            return user;
        })
        .catch(err =>{
            console.error("Error in saving the Data ...");
        })
}

UserSchema.statics.removeUser = async (pubKey, priKey, name)=>{
    const removed = new UserModel({pubKey, priKey,name});
    removed.remove((err, deleted)=>{
        if(err){
            return console.error("Error in removing the users, maybe don't exist ...");
        }
        return deleted;
    })
}

UserSchema.statics.removeAllUsers = async ()=>{
    //{} means ALL
    try{
        await UserModel.deleteMany({});
    }
    catch(err){
        return console.error("[-] Error removing all the rows in the schema ...");
    }
}

//Retrieving all the rows from DB
UserSchema.statics.displayAll = async ()=>{
    try{
        const data = await UserModel.find({});
        return data;
    }
    catch(err){
        console.log('[-] Error displaying all the schema');
    }
}

const UserModel = mongoose.model('Users', UserSchema);

module.exports = {UserModel, UserSchema};