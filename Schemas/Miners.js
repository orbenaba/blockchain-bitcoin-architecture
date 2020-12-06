const mongoose = require('../Backend/node_modules/mongoose');
const EC = require('../Backend/node_modules/elliptic').ec;
const ec = new EC('secp256k1');

const MinerSchema = new mongoose.Schema({
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
});


/**
 * We need to assure that there are no more miners in the DB
 * We supply singleton design pattern !
 */

MinerSchema.statics.addMiner = async (name, money)=>{
    try{
        const items = await MinerModel.findOne({});
        if(items !== null){
            //In case there has already a user, we just return him
            console.log('[+] There is already a miner in the DB !');
            return items.publicKey;
        }
        const genKeys = ec.genKeyPair();
        const publicKey = genKeys.getPublic('hex');
        const privateKey = genKeys.getPrivate('hex');
        let miner = await new MinerModel({publicKey, privateKey, name, money});
        await miner.save()
            .then(item =>{
                console.log("Miner created !");
            })
            .catch(err =>{
                console.error("Error in saving miner credentials ...");
            })
        return miner;
    }
    catch(err){
        console.error('[-] Error in retrieving data from the DB');
    }
}

//Retrieving all the rows from DB
MinerSchema.statics.displayAll = async ()=>{
    try{
        const data = await MinerModel.find({});
        return data.length === 0 ? null:data[0];
    }
    catch(err){
        console.log('[-] Error displaying all the schema');
    }
}


MinerSchema.statics.removeAll = async ()=>{
    //{} means ALL
    try{
        await MinerModel.deleteMany({});
    }
    catch(err){
        return console.error("[-] Error removing all the rows in the schema ...");
    }
}


MinerSchema.statics.getMoneyByPublic = async(publicKey)=>{
    try{
        const miner = await MinerModel.findOne({publicKey});
        if(miner === null){
            console.log("[-] Miner not found");
            return null;
        }
        return miner;
    }catch(err){
        console.error(err);
    }
}



const MinerModel = mongoose.model('Miners', MinerSchema);

module.exports = {MinerSchema, MinerModel};