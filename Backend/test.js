const WalletSPV = require('./WalletSPV').WalletSPV;
const WalletCreator = require('./WalletSPV').WalletCreator;
const { Miner } = require('./Miner');
const Blockchain = require('./Blockchain');
const { Transaction } = require('./Transaction');
const mongoose = require('mongoose');


//customized
const db = require('./Schemas/keysToRemote').MongoURI;

//Connecting the DB
mongoose.connect(db, {useNewUrlParser: true})
.then(console.log('[+] MongoDB connected ...'))
.catch(err=> console.error(err));


async function main(){
    let blockchain = new Blockchain();
    let user1 = WalletSPV.WalletCreator(1000);
    let user2 = WalletSPV.WalletCreator(1000)
                .then((res)=>{
                    console.log("user1 = ",user1.privateKey);
                    console.log("\n\nuser2 = ",user2.privateKey);
                })
                .catch((err)=>{
                    console.log("Error saving the Data");
                });
}

main();
/*
let user1 = new WalletSPV(1000);
let user2 = new WalletSPV(1000)
*/


/* 
let miner1 = new Miner(blockchain);

let tx1 = new Transaction(user1, user2, 300);

blockchain.addTransaction(tx1);

blockchain.miningPendingTransactions(miner1) */