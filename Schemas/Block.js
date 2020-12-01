const mongoose = require('../Backend/node_modules/mongoose');
const TXSchema = require('./Transactions').TransactionSchema;
const TXModel = require('./Transactions').Transactions;
const SHA256 = require('../Backend/node_modules/crypto-js/sha256');
const { PassThrough } = require('stream');
const Block = require('../Models/Block');

const MAX_TX_PER_BLOCK = 4;

const BlockSchema = new mongoose.Schema({
    /**
     *  Attributes:
     * @param {*} timestamp 
     * @param {*data of the block} transaction 
     * @param {*previous hash - default value for the first block} prevHash 
     * @var {*current hash which is calculated by the relevant values} hash
     * @var {*for mining, by manipulating its value} nonce
     * @var {*used for quick searching in the block} merkleTree
     * @var {*used for disqualify the fact that a transaction is not in the merkle tree
     * , might invoke false positive alerts} bloomFilter
     */
    timestamp:{
        type: Date,
        required: true
    },
    transactions:[TXSchema],
    prevHash:{
        type: String,
        required: false
    },
    hash:{
        type: String,
        required: true
    },
    nonce:{
        type: Number,
        required: true
    }/*,
    merkleTree:{

    },
    bloomFilter:{

    }*/
});




BlockSchema.methods.calculateHash = async function(transaction){
    return SHA256(this.prevHash + this.timestamp + JSON.stringify(transaction) + this.nonce).toString();
}

//Comparing the hash with a string that composed by "difficulty+1" zeros
BlockSchema.methods.mineBlock = async function(difficulty){
    let padding = '0'.repeat(difficulty);
    while(this.hash.substr(0, difficulty) !== padding){
        this.nonce ++;
        this.hash = this.methods.calculateHash();
    }
}

/**
 * @param {The TX to be added} transaction
 * @returns {True in case there is no need to mine a new block} flag 
 */
BlockSchema.methods.addTransaction = async function(fromAddress, toAddress, amount){
    const total = await this.methods.amountOfTX();
    let flag = (total != 4);
    this.transactions.push({fromAddress, toAddress, amount});
    return flag;
}

//Using aggregate to find the amount of TX in the block
BlockSchema.methods.amountOfTX = function(){
    return (BlockModel.aggregate([{$match: {hash: this.hash}}, {$project:{transactions: {$size: '$transactions'}}}]));
}






const BlockModel = mongoose.model('Block', BlockSchema);


module.exports = {BlockModel,BlockSchema};