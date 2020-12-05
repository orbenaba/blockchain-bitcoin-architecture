const {TransactionModel, TransactionSchema} = require('./Transactions');
const {BlockModel, BlockSchema} = require('./Block');
const {BlockchainModel, BlockchainSchema} = require('./Blockchain');
const mongoose = require('../Backend/node_modules/mongoose');
const { UserModel,UserSchema } = require('./Users');
const {MinerModel, MinerSchema} = require('./Miners');
/**
 * 
 */
const { BloomFilterModel } = require('./BloomFilter');

/**
 * 
 */
const {NumberizerModel, NumberizerSchema} = require('../Backend/app/Numberizer');



const db = require('../Schemas/keysToRemote').MongoURI;
mongoose.connect(db, {useNewUrlParser: true})
.then(console.log('[+] MongoDB connected ...'))
.catch(err=> console.error(err));


async function temp(){
    /*let chain = await BlockchainModel.blockchainCreator({difficulty: 2});
    let user1 = await UserModel.addUser("MalayGay");
    let user2 = await UserModel.addUser("OmerHacker");
    let user3 = await UserModel.addUser("AmitNashnash");
    let user4 = await UserModel.addUser("OzKatan");
    let miner = await MinerModel.addMiner("OrRich");


    await chain.save();
    await chain.addTransaction(user1,user2,100);
    await chain.addTransaction(user3,user4,200);
    await chain.addTransaction(user4,user2,300);
    await chain.addTransaction(user1,user2,400);
    await chain.addTransaction(user2,user1,500);

    chain = await chain.refresh();
    console.log("(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)\n");
    await chain.miningPendingTransactions(miner);
    await chain.miningPendingTransactions(miner);
    console.log("(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)\n",chain);
    console.log("(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)");
    console.log(await chain.getBalanceOfAddress("1"));
    console.log("||||DONE||||");*/
    let chain = await BlockchainModel.blockchainCreator(2);
    let user1 = await UserModel.addUser("MalayGay",100);
    let user2 = await UserModel.addUser("OmerHacker",200);
    let user3 = await UserModel.addUser("AmitNashnash",300);
    let user4 = await UserModel.addUser("OzKatan",400);
    let miner = await MinerModel.addMiner("OrRich",500);


    await chain.save();
    await chain.addTransaction(user1,user2,10);//false
    await chain.addTransaction(user3,user4,10);//false
    await chain.addTransaction(user4,user2,10);//true
    await chain.addTransaction(user1,user2,10);//false
    await chain.addTransaction(user2,user1,100);//true
    await chain.addTransaction(user2,user1,10);//true
    await chain.addTransaction(user2,user1,10);//true
    chain = await chain.refresh();
    await chain.miningPendingTransactions(miner);
    console.log("(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)\n");
    console.log("user1 = ",user1);
    console.log("user2 = ",user2);
    console.log("user3 = ",user3);
    console.log("user4 = ",user4);
    console.log("miner = ",miner);
}

temp();