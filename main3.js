//Adding rewards for miners
const {Block,Blockchain, Transaction} = require('./Blockchain3.js');

let orCoin = new Blockchain();

orCoin.createTransaction(new Transaction('address1','address2',100));
orCoin.createTransaction(new Transaction('address2','address1',50));

console.log('[+] Start mining block 1...');

// Bob is the miner
orCoin.miningPendingTransactions('Bob');
console.log('\n Balance of Bob: '+ orCoin.getBalanceOfAddress('Bob'));


console.log('Start Mining again....')
orCoin.createTransaction(new Transaction('Bob', 'address1', 50))
orCoin.miningPendingTransactions('Bob')
console.log('\n Balance of Bob ', orCoin.getBalanceOfAddress('Bob'))
console.log(JSON.stringify(orCoin, null, 4))