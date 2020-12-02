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
        required: true,
        default:Date.now()
    },
    transactions:[TXSchema],
    prevHash:{
        type: String,
        required: false
    },
    hash:{
        type: String,
        required: true,
        default:"No hash yet"
    },
    nonce:{
        type: Number,
        required: true,
        default:0
    }/*,
    merkleTree:{

    },
    bloomFilter:{

    }*/
});



/**
 * 
 * @param {The offset to be added to the nonce rather then updating each time the DB} index 
 */
BlockSchema.methods.calculateHash = async function(index = 0){
    return SHA256(this.prevHash + this.timestamp + JSON.stringify(this.transactions) + (this.nonce + index)).toString();
}

//Comparing the hash with a string that composed by "difficulty+1" zeros
BlockSchema.methods.mineBlock = async function(difficulty){
    let padding = '0'.repeat(difficulty);
    let index = 0;
    console.log('[+] Start mining ...');
    let tempHash = null;
    do{
        tempHash = await this.calculateHash(index++);
    }while(tempHash.toString().substr(0, difficulty) !== padding)

    this.nonce += index - 1;
    this.hash = tempHash;
    console.log("Mined block = ", this);
    console.log('[+] Block mined successfully !');
    await this.save();
}

/**
 * 
 */

 BlockSchema.methods.hasValidTransactions = async function(){
     for(const tx of this.transactions){
         if(!tx.isValid()){
             return false;
         }
     }
     return true;
 }


/**
 * @param {The TX to be added} transaction
 * @returns {True in case there is no need to mine a new block} flag 
 */
BlockSchema.methods.addTransaction = async function(fromAddress, toAddress, amount){
    const total = await this.transactions.length;
    let flag = (total != MAX_TX_PER_BLOCK - 2);
    try{
        if(this.transactions === null){
            this.transactions = await [{fromAddress,toAddress,amount,timestamp: Date.now()}];
        }
        else{
            await this.transactions.push({fromAddress,toAddress,amount,timestamp: Date.now()});
        }
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
        const temp = await BlockModel.findById(blk._id);
        return (temp.transactions === null? 0 : temp.transactions.length);
    }
    catch(err){
        console.error(err);
    }
}



const BlockModel = mongoose.model('Block', BlockSchema);


module.exports = {BlockModel,BlockSchema};