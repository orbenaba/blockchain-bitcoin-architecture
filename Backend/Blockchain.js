const SHA256 = require('crypto-js/sha256');
const { curve } = require('elliptic');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const {Block} = require('./Block');
const {Transaction} = require('./Transaction');



class Blockchain{
    constructor(){
        //build our block as an array
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 1;
        //The pending transaction which wait for someone to mine a block for them
        this.pendingTransactions = [];
        //Mining reward
        this.miningReward = 90;
    }

    //The first block of the blockchain
    createGenesisBlock(){
        return new Block("01/01/2020","Genesis block","o");
    }
    //get the last block in the blockchain
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    // Each block is composed by transaction
    miningPendingTransactions(miningRewardAddress){
        // Transaction which committed by the miner to the miner: null->miningRewardAddress
        const rewardTX = new Transaction(null,miningRewardAddress,this.miningReward);
        this.pendingTransactions.push(rewardTX);
        
        // We are lying cause we need to choose a specific transaction and not the all pendingTransactions
        let block = new Block(Date.now(),this.pendingTransactions,this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);
        console.log('Block successfully mined !');
        // Adding the new mined block to the chain
        this.chain.push(block);
        // Composing a lot of transactions in one block - not in real scenario
        this.pendingTransactions = [];
    }
    //Add transaction
    addTransaction(transaction){
        //first Verify
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error("[-] Transaction must include fromAddress and toAddress fields!");
        }
        if(!transaction.isValid()){
            throw new Error("[-] Can't add invalid transaction to the chain");
        }
        this.pendingTransactions.push(transaction);
    }

    // In the real Bitcoin there is no "Balance" attribute for each block
    // It is calculated by counting and summing the transactions in the blockchain
    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const tran of block.transaction){
                //The miner spends out money
                if(tran.fromAddress === address){
                    balance -= tran.amount;
                }
                //The miner profits money
                if(tran.toAddress === address){
                    balance += tran.amount;
                }
            }
        }
        return balance;
    }

    //Validate the chain
    //To deny attempts for harsh
    isChainValid(){
        let len = this.chain.length;
        for(let i=1;i < len;i++){
            const curBlock  = this.chain[i];
            const prevBlock = this.chain[i-1];
            if(!curBlock.hasValidTransactions()){
                return false;
            }
            //Validate that no one change the values
            if(curBlock.hash !== curBlock.calculateHash()){
                console.log(`1) Check blocks ${i}, ${i-1}`);
                return false;
            }
            if(curBlock.prevHash !== prevBlock.hash){
                console.log(`2) Check blocks ${i}, ${i-1}`);
                return false;
            }
        }
        return true;
    }
}

//Exporting the modules in this file to make them available to the rest of the world
module.exports.Blockchain = Blockchain;