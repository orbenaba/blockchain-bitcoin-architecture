const mongoose = require('../Backend/node_modules/mongoose');
const EC = require('../Backend/node_modules/elliptic').ec;
const ec = new EC('secp256k1');

const MinersSchema = new mongoose.Schema({
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
});


//Basic functions to use with the DB
MinersSchema.statics.addMiner = async (name)=>{
    /**
     * We need to assure that there are no more miners in the DB
     * We supply singleton design pattern !
     */
    try{
        Miners.findOne({},async (err, items)=>{
            if(items !== null){
                //In case there has already a user, we just return him
                console.log('[+] There is already a miner in the DB !');
                return items;
            }
            else{
                const genKeys = ec.genKeyPair();
                const publicKey = genKeys.getPublic('hex');
                const privateKey = genKeys.getPrivate('hex');
                let user = new Miners({publicKey, privateKey, name});
                await user.save()
                .then(item =>{
                    console.log("Miner created !");
                    return user;
                })
                .catch(err =>{
                    console.error("Error in saving miner credentials ...");
                })
            }
        });
    }
    catch(err){
        console.error('[-] Error in retrieving data from the DB');
    }
}

//Retrieving all the rows from DB
MinersSchema.statics.displayAll = async ()=>{
    try{
        const data = await Miners.find({});
        return data.toString().length == 0 ? null:data;
    }
    catch(err){
        console.log('[-] Error displaying all the schema');
    }
}


MinersSchema.statics.removeAll = async ()=>{
    //{} means ALL
    try{
        await Miners.deleteMany({});
    }
    catch(err){
        return console.error("[-] Error removing all the rows in the schema ...");
    }
}


const Miners = mongoose.model('Miners', MinersSchema);

module.exports = Miners;