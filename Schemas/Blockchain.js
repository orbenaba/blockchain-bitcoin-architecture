const mongoose = require('../Backend/node_modules/mongoose');
const Blockchain = require('../Models/Blockchain');
const {BlockModel, BlockSchema} = require('./Block');
const {TransactionModel, TransactionSchema} = require('./Transactions');

const REWARD = 100;

const BlockchainSchema = new mongoose.Schema({
    /**
     * @var {*Building our chain as an array} chain
     * @var {*The length of zeros which the miner needs to get to} difficulty
     * @var {*The pending transactions which wait for someone to mine a block for them} pendingTransactions
     * @var {*The price the miner gets when succeeds} miningReward
     * @var {*The latest block in the chain which will be replaced when filled with 4 transactions at the most} currentBlock
     */
    chain: [BlockSchema],
    difficulty:{
        type: Number,
        required: true,
        default:3
    },
    pendingTransactions:[BlockSchema],
    miningReward:{
        type: Number,
        required: true,
        default: REWARD
    },
    currentBlock: BlockSchema
})
/**
 * Hook function to fill the first genesis block when the blockchain is created
 */
BlockchainSchema.pre("save",function(next){
    try{
        if(this.chain.length == 0){
            const pushed = new BlockModel({timestamp: Date.now(),
                transactions:{fromAddress:"Genesis block",toAddress:"Genesis block",amount:0,timestamp:Date.now()}
                 ,prevHash:"",hash:"",nonce:0});
            console.log("2".repeat(100));
            this.chain.push(pushed)
            console.log("Genesis ...");
        }
        next();    
    }catch(err){
        console.error(err);
    }
})

/**
 * 
 */
BlockchainSchema.methods.getLatestBlock = async function(){
    return this.currentBlock;
}

/**
 * 
 */
BlockchainSchema.methods.addTransaction = async function(fromAddress, toAddress, amount){
    /**
     * Simply push the transaction to the pendingArray
     * Note that caller must call refresh func after calling this func
     */
    try{
        await this.pendingTransactions.push({fromAddress, toAddress, amount});
        await this.save();
        console.log('[***] Transaction added to pending transactions ...');
    }
    catch(err){
        console.error(err);
    }
}
/**
 * Simply adding the transaction to the current Block and if addTransaction of BlockSchema
 * return true, then we'll add new block
 * @param {The public key of the miner} minerAddress
 * @returns {
 * String - "No pending TXs" -> means that no one need a miner
 * Boolean - True -> means 
 * }
 */
BlockchainSchema.methods.miningPendingTransactions = async function(minerAddress){
    //The miner collect at the most 3 transactions together and mining em
    let blocksToMine = [];
    while(true)
    {
        //Getting the most first TX in the array and
        const pendedTX = await this.popFirstPendingTX();
        if(pendedTX === null){
            console.log('[!] There are no pending TXs !');
            return;
        } 
        blocksToMine.push(pendedTX);
        const res = await this.currentBlock.addTransaction({fromAddress: pendedTX.fromAddress,toAddress: pendedTX.toAddress,amount: pendedTX.amount});
        this.currentBlock = await this.currentBlock.refresh();
        if(res === false)//We need to mine the current block and advance
        {
            //The TX which rewards the miner
            const rewardTX = new TransactionModel(null, minerAddress, minerAddress)
            this.currentBlock.push(rewardTX);

        }
        else//We need to continue
        {

        }
    }
}
/**
 * Helper method:
 * @param {The array to be hashed}
 * @returns {The hash of the current block}
 */




/**
 * 
 * @returns {The first pending TX and remove it, if there are no pending TXs, then returns false} 
 */
BlockchainSchema.methods.popFirstPendingTX = async function(){
    try{
        //Referring the array like a queue
        const returned = await this.pendingTransactions.shift();
        await this.save();
        return returned;
    }catch(err){
        console.error(err);
    }
}

/**
 * 
 */
BlockchainSchema.methods.getBalanceOfAddress = async function(address){

}


/**
 * 
 */

BlockchainSchema.methods.isChainValid = async function(){
     
 }

/**
 * 
 */
BlockchainSchema.methods.refresh = async function(){
     try{
        const returned = await BlockchainModel.findById(this._id);
        return returned;
    }
    catch(err){
        console.error(err);
    }
 }


const BlockchainModel = mongoose.model('Blockchain', BlockchainSchema);


module.exports = {BlockchainModel,BlockchainSchema}