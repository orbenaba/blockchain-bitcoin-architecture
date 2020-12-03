const mongoose = require('../Backend/node_modules/mongoose');
const TXSchema = require('./Transactions').TransactionSchema;
const TXModel = require('./Transactions').Transactions;
const SHA256 = require('../Backend/node_modules/crypto-js/sha256');
const { TransactionModel } = require('./Transactions');
const {MerkleTreeModel,MerkleTreeSchema} = require('./MerkleTree');

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
    },
    merkleTree:{
        type: MerkleTreeSchema
    }/*,
    bloomFilter:{
        type:PartitionedBloomFilter,
        default: new PartitionedBloomFilter(2048, 1024)
    }*/
});



/**
 * @param {The offset to be added to the nonce rather then updating each time the DB} index 
 * @returns {The hash of the whole block}
 */
BlockSchema.methods.calculateHash = async function(index = 0){
    return SHA256(this.prevHash + this.timestamp + JSON.stringify(this.transactions) + (this.nonce + index)).toString();
}

/**
 * @param {The amount of zeros to be achieved by the miner} difficulty 
 */
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
    console.log('[+] Block mined successfully !');
    await this.save();
}

/**
 * Checking whether the transactions has changed by someone
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
        const inserted = {fromAddress,toAddress,amount,timestamp: Date.now()};
        console.log("this.transactions = ",this.transactions);
        if(this.transactions.length === 0){
            this.transactions = await [inserted];
            this.merkleTree = await new MerkleTreeModel(inserted);
            await this.save();
            console.log("this.merkleTree = ",this.merkleTree);
        }
        else{
            await this.merkleTree.addTransaction(inserted);
            await this.transactions.push(inserted);
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

/**
 * @param {Specific block to be let its length calculated} blk 
 */
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