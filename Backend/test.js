const WalletSPV = require('./WalletSPV');
const Miner = require('./Miner');
const { Blockchain } = require('./BlockChain');


let blockchain = new Blockchain();
let user1 = new WalletSPV(1000);
let user2 = new WalletSPV(1000);
let miner1 = new Miner();