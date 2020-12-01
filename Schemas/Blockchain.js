
const mongoose = require('../Backend/node_modules/mongoose');
const {BlockModel, BlockSchema} = require('./Block');
const {TransactionModel, TransactionSchema} = require('./Transactions');


const BlockchainSchema = new mongoose.Schema({
    /**
     * @var {*Building our chain as an array} chain
     * @var {*The length of zeros which the miner needs to get to} difficulty
     * @var {*The pending transactions which wait for someone to mine a block for them} pendingTransactions
     * @var {*The price the miner gets when succeeds} miningReward
     * @var {*The latest block in the chain which will be replaced when filled with 4 transactions at the most} currentBlock
     */
    chain:[BlockSchema],
    difficulty:{
        type: Number,
        required: true
    },
    pendingTransactions:[BlockSchema],
    miningReward:{
        type: Number,
        required: true
    },
    currentBlock: BlockSchema
})

//Methods
BlockchainModel.methods.addTransaction = async(fromAddress, toAddress, amount)=>{
    
}


const BlockchainModel = mongoose.model('Blockchain', BlockSchema);