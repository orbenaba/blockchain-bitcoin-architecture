const mongoose = require('../Backend/node_modules/mongoose');
const TXSchema = require('./Transactions').TransactionSchema;
const TXModel = require('./Transactions').Transactions;


const MAX_TX_PER_BLOCK = 4;

const BlockSchema = new mongoose.Schema({
    /**
     *  Attributes:
     * @param {*} timeStamp 
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
        required: true
    },
    hash:{
        type: String,
        required: true
    },
    nonce:{
        type: Number,
        required: true
    },
    merkleTree:{

    },
    bloomFilter:{

    }
});


//Basic functions to Block Schema
/**
 * @returns {*false in case we need to mine new block otherwise true}
 */
/*BlockSchema.statics.addTransactionToBlock = async (fromAddress, toAddress, amount)=>{
    //Each block contains at the most MAX_TX_PER_BLOCK Transactions
    let indicate = false
    if(BlockSchema.Transactions.length > MAX_TX_PER_BLOCK){
        throw new Error(`Block error ! Block cannot contain more then ${MAX_TX_PER_BLOCK} transactions !`)
    }
    if(BlockSchema.Transactions.length < MAX_TX_PER_BLOCK){
        indicate = true;
    }
    //else indicate stays false
    let inserted = await new TXModel({fromAddress, toAddress, amount});
    await BlockSchema.Transactions.push(inserted);
    try{
        await BlockModel.save();
        console.log('[+] Transaction added to block successfully !');
    }
    catch(err){
        console.error('[-] Couldn\'t save Transaction in block');
    }
}
*/






const BlockModel = mongoose.model('Block', BlockSchema);




module.exports = {BlockModel,BlockSchema};