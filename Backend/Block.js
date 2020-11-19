const SHA256 = require('crypto-js/sha256');
const { curve } = require('elliptic');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const {Transaction} = require('./Transaction');

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


module.exports.Block = Block;