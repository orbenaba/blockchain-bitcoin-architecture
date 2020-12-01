const {TransactionModel, TransactionSchema} = require('./Transactions');
const {BlockModel, BlockSchema} = require('./Block');
const mongoose = require('../Backend/node_modules/mongoose');


const db = require('../Schemas/keysToRemote').MongoURI;
mongoose.connect(db, {useNewUrlParser: true})
.then(console.log('[+] MongoDB connected ...'))
.catch(err=> console.error(err));


async function temp(){
    let block =  new BlockModel({
        timestamp: Date.now(),
        transactions: null,
        hash: "wednsoc",
        nonce: 0
    });
    try{
        await block.save();
        console.log('[+] Block saved !');
    }catch(err){
        throw new Error('[+] Failure');
    }

    console.log("Amount of TX: ", block.amountOfTX());
    
    /*
    block.addTransaction('1.1.1.1', '2.2.2.2',100);
    console.log("Amount of TX: ", block.amountOfTX());
    
     block.addTransaction('1.1.1.1', '2.2.2.2',100);
    console.log("Amount of TX: ", block.amountOfTX());
    
     block.addTransaction('1.1.1.1', '2.2.2.2',100);
    console.log("Amount of TX: ", block.amountOfTX());
    
     block.addTransaction('1.1.1.1', '2.2.2.2',100);
    console.log("Amount of TX: ", block.amountOfTX());
*/
}

temp();