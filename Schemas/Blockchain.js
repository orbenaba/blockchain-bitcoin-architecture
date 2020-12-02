const mongoose = require('../Backend/node_modules/mongoose');
const Blockchain = require('../Models/Blockchain');
const Block = require('./Block');
const {BlockModel, BlockSchema} = require('./Block');
const {TransactionModel, TransactionSchema} = require('./Transactions');

const REWARD = 100;

const BlockchainSchema = new mongoose.Schema({
    /**
     * @var {*Building our chain as an array} chain
     * @var {*The length of zeros which the miner needs to get to} difficulty
     * @var {*The pending transactions which wait for someone to mine a block for them} pendingTransactions
     * @var {*The price the miner gets when succeeds} miningReward
     * @var {*The latest block in the chain which will be `rep`laced when filled with 4 transactions at the most} currentBlock
     */
    chain: [BlockSchema],
    difficulty:{
        type: Number,
        required: true,
        default:3
    },
    pendingTransactions:[TransactionSchema],
    miningReward:{
        type: Number,
        required: true,
        default: REWARD
    },
    currentBlock: {
        type: BlockSchema,
        default: null
    }
})
/**
 * Hook function to fill the first genesis block when the blockchain is created
 * Used only and only for genesis block
 */
BlockchainSchema.pre("save",async function(next){
    try{
        if(this.chain.length == 0){
            if(this.currentBlock === null){
                this.currentBlock = new BlockModel({timestamp: Date.now(),
                    transactions:{fromAddress:"Genesis block",toAddress:"Genesis block",amount:0,timestamp:Date.now()}
                     ,prevHash:""});
            }
            this.currentBlock.hash = await this.currentBlock.calculateHash();
            await this.chain.push(this.currentBlock)
            this.currentBlock = new BlockModel({timestamp:Date.now(),transactions:[], prevHash:this.chain[0].hash});
            console.log("[+] Genesis ...");
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
    return this.chain[this.chain.length-1];
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
    while(true)
    {
        //Getting the most first TX in the array and
        const pendedTX = await this.popFirstPendingTX();
        if(pendedTX === false){
            console.log('[!] There are no pending TXs !');
            return;
        } 
        /*********************************************************************** */
        if(this.currentBlock === null){
            this.currentBlock = new BlockModel({transactions:[], prevHash:this.getLatestBlock().hash})
        }
        const res = await this.currentBlock.addTransaction(pendedTX.fromAddress, pendedTX.toAddress, pendedTX.amount);
        if(res === false)//We need to mine the current block and progress
        {
            //The TX which rewards the miner
            await this.currentBlock.addTransaction(minerAddress, minerAddress,0);
            //We got 4 transactions !
            await this.currentBlock.mineBlock(this.difficulty);
            await this.chain.push(this.currentBlock);
            //The block probably mined
            const newBlock = await new BlockModel({timestamp:Date.now(),prevHash:this.currentBlock.hash});
            this.currentBlock = newBlock;
            await this.save();
            return;
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
        if(this.pendingTransactions.length == 0){
            return false;
        }
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
 * Validate the chain
 * To deny attempts for harsh
 */
BlockchainSchema.methods.isChainValid = async function(){
    let len = this.chain.length;
    for(let i=1;i < len;i++){
        const curBlock  = this.chain[i];
        const prevBlock = this.chain[i-1];
        if(!curBlock.hasValidTransactions()){
            return false;
        }
        //Validate that no one change the values
        if(curBlock.hash !== curBlock.calculateHash()){
            return false;
        }
        if(curBlock.prevHash !== prevBlock.hash){
            return false;
        }
    }
    return true;
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