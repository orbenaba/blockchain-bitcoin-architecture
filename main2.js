//Adding miners
const {Block,Blockchain} = require('./Blockchain2.js');

let orCoin = new Blockchain();
//This going to be the new block
console.log('[+] Mining block1 ...');
orCoin.addBlock(new Block(1, '2/11/2020', {amount: 4}));
console.log('[+] Mining block2 ...');
orCoin.addBlock(new Block(2, '2/11/2020',{amount: 9}));

console.log(JSON.stringify(orCoin,null,4));