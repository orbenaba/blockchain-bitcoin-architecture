const {TransactionModel, TransactionSchema} = require('./Transactions');
const {BlockModel, BlockSchema} = require('./Block');
const {BlockchainModel, BlockchainSchema} = require('./Blockchain');
const mongoose = require('../Backend/node_modules/mongoose');
const { errorMonitor } = require('stream');


const db = require('../Schemas/keysToRemote').MongoURI;
mongoose.connect(db, {useNewUrlParser: true})
.then(console.log('[+] MongoDB connected ...'))
.catch(err=> console.error(err));


async function temp(){
    let chain = await new BlockchainModel({difficulty: 2});
    await chain.save();
    await chain.addTransaction("1","2",100);
    await chain.addTransaction("3","4",100);
    await chain.addTransaction("5","6",100);
    await chain.addTransaction("7","8",100);
    await chain.addTransaction("9","10",100);
    chain = await chain.refresh();
    console.log("(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)\n");
    await chain.miningPendingTransactions("1.1.1.1");
    console.log("(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)\n",chain);
    console.log("(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)");
}

temp();