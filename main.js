const {Block,Blockchain} = require('./Blockchain.js');

let orCoin = new Blockchain();
//This going to be the new block
orCoin.addBlock(new Block(1, '2/11/2020', {amount: 4}));

orCoin.addBlock(new Block(2, '2/11/2020',{amount: 9}));

console.log(JSON.stringify(orCoin,null,4));