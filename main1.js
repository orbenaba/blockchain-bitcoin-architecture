const {Block,Blockchain} = require('./Blockchain1.js');

let orCoin = new Blockchain();
//This going to be the new block
orCoin.addBlock(new Block(1, '2/11/2020', {amount: 4}));

orCoin.addBlock(new Block(2, '2/11/2020',{amount: 9}));

console.log("Blockchain is: "+orCoin.isValid());

console.log('changing the blockchain ...');
//Destroying the blockchain
//first test
orCoin.chain[1].data = {amount:100};
console.log("Blockchain is: "+orCoin.isValid());

//Second test
orCoin.chain[1].hash = orCoin.chain[1].calculateHash();
console.log("Blockchain is: "+orCoin.isValid());