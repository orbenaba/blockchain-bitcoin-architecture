const ObjectID  = require('../Backend/node_modules/mongodb').ObjectID;


const mongoose = require('../Backend/node_modules/mongoose');
const TXSchema = require('./Transactions').TransactionSchema;
const TXModel = require('./Transactions').Transactions;
const SHA256 = require('../Backend/node_modules/crypto-js/sha256');
const Block = require('../Models/Block');
const { timeStamp } = require('console');
const { TransactionModel } = require('./Transactions');



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
    const total = await BlockModel.amountOfTX(this);
    let flag = (total != 4);
    try{
        //await BlockSchema.findOneAndUpdate({_id:ObjectID(this._id)}, {$push: {transactions : {fromAddress,toAddress,amount,timestamp: Date.now()}}})
        await BlockModel.findOne({_id: this._id})
                    .then(async function(record){
                        await record.transactions.push({fromAddress,toAddress,amount,timestamp: Date.now()})
                        await record.save()
                    })
        //await BlockModel.updateOne({_id:ObjectID(this._id)}, {$addToSet: {transactions : [{fromAddress,toAddress,amount,timestamp: Date.now()}]}})
        /*console.log("2)this._id = ", this._id);
        let inserted = {fromAddress, toAddress, amount};
        BlockModel.findByIdAndUpdate(this._id,
                    {$push: {transactions: inserted}})*/
    }catch(err){
        console.error(err);
    }
    return flag;
}

//Refresh the state of the Object
BlockSchema.methods.refresh = async function(){
    try{
        const returned = await BlockModel.findById(this._id);
        return returned;
    }
    catch(err){
        console.error(err);
    }
}




//Using aggregate to find the amount of TX in the block
BlockSchema.statics.amountOfTX = async function(blk){
    try{
        const temp = await BlockModel.findOne(blk);
        return (temp.transactions === null? 0 : temp.transactions.length);
    }
    catch(err){
        console.error(err);
    }
    //More complicated solution:
    //return (BlockModel.aggregate([{$match: {hash: this.hash}}, {$project:{transactions: {$size: '$transactions'}}}]));
}



const BlockModel = mongoose.model('Block', BlockSchema);


module.exports = {BlockModel,BlockSchema};