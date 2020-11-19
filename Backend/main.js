//Adding rewards for miners
const {Blockchain} = require('./Blockchain.js');
const {Block} = require('./Block.js');
const {Transaction} = require('./Transaction');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');



const myKey = ec.keyFromPrivate('8aa786597a16003b0e7a41726b2e266a548c5114a844f69659a76dd775c8b4ea');
const myWalletAddress = myKey.getPublic('hex');

let orCoin = new Blockchain();


const tx1 = new Transaction(myWalletAddress,'address2',10);
tx1.signTransaction(myKey);
orCoin.addTransaction(tx1);
orCoin.miningPendingTransactions(myWalletAddress);;


const tx2 = new Transaction(myWalletAddress,'address1',50);
tx2.signTransaction(myKey);
orCoin.addTransaction(tx2);
orCoin.miningPendingTransactions(myWalletAddress);


console.log('Balance of my wallet',orCoin.getBalanceOfAddress(myWalletAddress));
console.log(JSON.stringify(orCoin, null, 4))