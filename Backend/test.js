const {Transaction} = require("./Transaction");
const {Block} = require('./Block');

let t1 = new Transaction("2.2.2.2", "3.3.3.3",100);
let t2 = new Transaction("2.2.2.2", "6.6.6.6",100);
let t3 = new Transaction("9.9.9.9", "3.3.3.3",100);
let t4 = new Transaction("8.8.8.8", "3.3.3.3",100);
let t5 = new Transaction("7.7.7.7", "3.3.3.3",100);
let t6 = new Transaction("7.7.7.7", "3.3.3.3",100);

let block = new Block(Date.now(), t1);
block.addTransaction(t2);
block.addTransaction(t3);
block.addTransaction(t4);
block.addTransaction(t5);
block.addTransaction(t6);

block.merkleTree.printTree()