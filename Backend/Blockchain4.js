const SHA256 = require('crypto-js/sha256');
const { curve } = require('elliptic');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


class Transaction{
    //Note that in Monero coin those data is not known
    constructor(fromAddress, toAddress,amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timeStamp = Date.now();
    }
    //Hashing the transaction
    calculateHash(){
        return SHA256(this.fromAddress+this.timeStamp+this.amount+this.toAddress).toString();
    }
    //sign the hash of the transaction with the private key
    signTransaction(signingKey){
        //Checking whether someone is trying to spoof to the another wallet
        //Denote that public key is the address of the wallet
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error("You can't sign transaction for other wallet");
        }
        const hashTx = this.calculateHash();
        //sign in base64
        const signed = signingKey.sign(hashTx,'base64');
        //toDer() means that 'hex' is the format of the signature
        this.signature = signed.toDER('hex');
    }

    //validate the transaction, namely we want to be sure that this transaction signed by the one who 
    //owned this public key
    isValid(){
        //If we are mining then the fromAddress is null
        if(this.fromAddress === null){
            return true;
        }
        if(!this.signature || this.signature === 0){
            throw new Error("There is no signature for this transaction");
        }
        const publicKey = ec.keyFromPublic(this.fromAddress,'hex');
        //We decrypt the signature with the publicKey and then compare it to the this.calculateHash()
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block{
    //Attributes:
    //index of the block
    //timestamp
    //data of the block
    //previous hash - default value for the first block
    //hash = current hash which is calculated by the relevant values
    constructor(timeStamp,transaction,prevHash=''){
        this.timeStamp = timeStamp;
        this.transaction = transaction;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
        //Using nonce for mining, by manipulating its value
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.prevHash+this.timeStamp+JSON.stringify(this.transaction)+this.nonce).toString();
    }
    //In real life, the difficulty is changed every two weeks
    mineBlock(difficulty){
        //Comparing the hash with a string that composed by "difficulty+1" zeros
        let padding = '0'.repeat(difficulty);
        while(this.hash.substr(0,difficulty)!==padding){
            this.nonce ++;
            this.hash = this.calculateHash();
        }
    }
    //Each block contains some transactions and we want to validate each of them seperately
    hasValidTransactions(){
        for(const tx of this.transaction){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }
}

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
module.exports.Block = Block;
module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;