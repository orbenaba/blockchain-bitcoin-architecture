const {TransactionModel, TransactionSchema} = require('./Transactions');
const {BlockModel, BlockSchema} = require('./Block');
const {BlockchainModel, BlockchainSchema} = require('./Blockchain');
const mongoose = require('../Backend/node_modules/mongoose');
const { UserModel,UserSchema } = require('./Users');
const {MinerModel, MinerSchema} = require('./Miners');


const db = require('../Schemas/keysToRemote').MongoURI;
mongoose.connect(db, {useNewUrlParser: true})
.then(console.log('[+] MongoDB connected ...'))
.catch(err=> console.error(err));


async function temp(){/*
    let chain = await new BlockchainModel({difficulty: 2});
    await chain.save();
    await chain.addTransaction("1","2",100);
    await chain.addTransaction("3","1",200);
    await chain.addTransaction("1","6",300);
    await chain.addTransaction("7","1",400);
    await chain.addTransaction("1","10",500);
    chain = await chain.refresh();
    console.log("(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)(1)\n");
    await chain.miningPendingTransactions("1.1.1.1");
    console.log("(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)(2)\n",chain);
    console.log("(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)(DONE)");
    console.log(await chain.getBalanceOfAddress("1"));*/

    let user1 = await UserModel.addUser("moshe");
    let user2 = await UserModel.addUser("Itzik");
    let miner3 = await MinerModel.addMiner('Ahmed');
    let miner4 = await MinerModel.addMiner('Jamal');
    console.log("miner3 = ", miner3);
    console.log("miner4 = ", miner4);

    let tx1 = await new TransactionModel({externalModelType1:'Users',externalModelType2:'Users',fromAddress:user1,toAddress:user2,amount:300});
    try{
        await tx1.save();
        console.log(tx1);
    }catch(err){
        console.error(err);
    }


    let tx2 = await new TransactionModel({externalModelType1:'Users',externalModelType2:'Miners',fromAddress:user1,toAddress:miner3,amount:300});
    try{
        await tx2.save();
        console.log(tx2);
    }catch(err){
        console.error(err);
    }

    let tx3 = await new TransactionModel({externalModelType1:'Miners',externalModelType2:'Users',
                                            fromAddress:miner3,toAddress:user2,amount:300});
    try{
        await tx3.save();
        console.log(tx3);
    }catch(err){
        console.error(err);
    }

    let tx4 = await new TransactionModel({externalModelType1:'Miners',externalModelType2:'Miners',fromAddress:miner3,toAddress:miner4,amount:300});
    try{
        await tx4.save();
        console.log(tx4);
    }catch(err){
        console.error(err);
    }





    console.log("||||DONE||||");
}

temp();