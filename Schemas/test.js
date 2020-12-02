const {TransactionModel, TransactionSchema} = require('./Transactions');
const {BlockModel, BlockSchema} = require('./Block');
const {BlockchainModel, BlockchainSchema} = require('./Blockchain');
const mongoose = require('../Backend/node_modules/mongoose');


const db = require('../Schemas/keysToRemote').MongoURI;
mongoose.connect(db, {useNewUrlParser: true})
.then(console.log('[+] MongoDB connected ...'))
.catch(err=> console.error(err));


async function temp(){
/*    let block =  new BlockModel({
        timestamp: Date.now(),
        transactions: [],
        hash: "wednsoc",
        nonce: 0
    });
    try{
        await block.save();
        console.log('[+] Block saved !');
    }catch(err){
        return console.error('[+] Failure');
    }
    let te = await BlockModel.amountOfTX(block);
    console.log("Amount of TX: ", te);


    await block.addTransaction('1.1.ew1.1', '2.w2.2.2',10220);
    block = await block.refresh()
    console.log('[+] Block added');
    try{
        await block.save();
        console.log('[+] Block saved !');
    }catch(err){
        return new Error('[+] Failure');
    }
    console.log(block);
    te = await BlockModel.amountOfTX(block);
    console.log("Amount of TX: ", te,"\n");


    await block.addTransaction('1.1.aew1.1', '2.w2.2.2',102120);
    block = await block.refresh()
    console.log('[+] Block added');
    try{
        await block.save();
        console.log('[+] Block saved !');
    }catch(err){
        return new Error('[+] Failure');
    }
    console.log(block);
    te = await BlockModel.amountOfTX(block);
    console.log("Amount of TX: ", te,"\n");


    await block.addTransaction('1.1.daew1.1', '2.w2sa2.2',101220);
    block = await block.refresh()
    console.log('[+] Block added');
    try{
        await block.save();
        console.log('[+] Block saved !');
    }catch(err){
        return new Error('[+] Failure');
    }
    console.log(block);
    te = await BlockModel.amountOfTX(block);
    console.log("Amount of TX: ", te,"\n");



    await block.addTransaction('1.1.edadxsaw1.1', '2.wcds2.2.2',102210);
    block = await block.refresh()
    console.log('[+] Block added');
    try{
        await block.save();
        console.log('[+] Block saved !');
    }catch(err){
        return new Error('[+] Failure');
    }
    console.log(block);
    te = await BlockModel.amountOfTX(block);
    console.log("Amount of TX: ", te,"\n");


    console.log("[+] Checking ...");
    console.log("Valid? ",await block.hasValidTransactions());*/
    let chain = await new BlockchainModel({difficulty: 1});
    await chain.save();
    
}

temp();