const WalletSPV = require('./WalletSPV').WalletSPV;
const Miner = require('./Miner');
const Blockchain = require('./Blockchain');
const { Transaction } = require('./Transaction');


const mongoose = require('mongoose');
//customized
const db = require('../Schemas/keysToRemote').MongoURI;

//Connecting the DB
mongoose.connect(db, {useNewUrlParser: true})
.then(console.log('[+] MongoDB connected ...'))
.catch(err=> console.error(err));


async function main(){
    let blockchain = new Blockchain();
    let user1 = WalletSPV.WalletCreator(1000);
    let user2 = WalletSPV.WalletCreator(1000);
    let miner1 = Miner.MinerCreator(blockchain);

    //<- Until here, alright ->
    console.log("Done");

    let tx1 = new Transaction(user1, user2, 300);
    console.log("Done");

    blockchain.addTransaction(tx1);
    console.log("Done");

    blockchain.miningPendingTransactions(miner1);
    console.log("Done");

}

main();