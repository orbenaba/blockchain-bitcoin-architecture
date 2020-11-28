const WalletSPV = require('./WalletSPV').WalletSPV;
const WalletCreator = require('./WalletSPV').WalletCreator;
const { Miner } = require('./Miner');
const Blockchain = require('./Blockchain');
const { Transaction } = require('./Transaction');



async function main(){
    let blockchain = new Blockchain();
    let user1 = await WalletCreator(1000);
    let user2 = await WalletCreator(1000);
    console.log("user1 = ",user1);
    console.log("\n\nuser2 = ",user2);
    
    let miner1 = new Miner(blockchain);
    
    let tx1 = new Transaction(user1, user2, 300);
    
    blockchain.addTransaction(tx1);
    
    blockchain.miningPendingTransactions(miner1);
}

main();