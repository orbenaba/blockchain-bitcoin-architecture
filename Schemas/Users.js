const { error } = require('console');
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
    },
    money:{
        type:Number,
        required:true
    }
})


/**
 * @param {The name which chose to be} name
 */
UserSchema.statics.addUser = async (name,money)=>{
    const genKeys = ec.genKeyPair();
    const publicKey = genKeys.getPublic('hex');
    const privateKey = genKeys.getPrivate('hex');
    let user = new UserModel({publicKey, privateKey, name,money});
    await user.save()
        .then(item =>{
            console.log("Data saved in DB !");
        })
        .catch(err =>{
            console.error("Error in saving the Data ...");
        })
    return user;
}

/**
 * @param {*} pubKey 
 * @param {*} priKey 
 * @param {*} name
 * Deleting a specific user 
 */
UserSchema.statics.removeUser = async (pubKey, priKey, name)=>{
    const removed = new UserModel({pubKey, priKey,name});
    removed.remove((err, deleted)=>{
        if(err){
            console.error("Error in removing the users, maybe don't exist ...");
        }
        else{
            return deleted;
        }
    })
}

/**
 * Removing all the users from the schema
 */
UserSchema.statics.removeAllUsers = async ()=>{
    //{} means ALL
    try{
        await UserModel.deleteMany({});
    }
    catch(err){
        return console.error("[-] Error removing all the rows in the schema ...");
    }
}
/**
 * Retrieving all the rows from the schema
 */
UserSchema.statics.displayAll = async ()=>{
    try{
        const data = await UserModel.find({});
        return data;
    }
    catch(err){
        console.log('[-] Error displaying all the schema');
    }
}

//Checking whether the public key exists
UserSchema.statics.getMoneyByPublic = async(publicKey)=>{
    try{
        const user = await UserModel.findOne({publicKey});
        if(user === null){
            console.log("[-] User not found");
            return null;
        }
        return user;
    }catch(err){
        console.error(err);
    }
}

/**
 * Counting the total users in the DB 
 */
UserSchema.statics.usersAmount = async function(){
    try{
        const amount = await UserModel.count({});
        return amount;
    }catch(err){
        console.error(err);
    }
}

const UserModel = mongoose.model('Users', UserSchema);

module.exports = {UserModel, UserSchema};