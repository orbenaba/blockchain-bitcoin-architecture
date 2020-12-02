/*const {Block} = require('./Block');
const {Transaction} = require('./Transaction');
const {MerkleTree} = require('./MerkleTree');
const {Miner} = require('./Miner');
*/
//Might be changed with some reasons
var REWARD = 100;
/*
class Blockchain{*/
    /**
     * @var {*Building our chain as an array} chain
     * @var {*The length of zeros which the miner needs to get to} difficulty
     * @var {*The pending transactions which wait for someone to mine a block for them} pendingTransactions
     * @var {*The price the miner gets when succeeds} miningReward
     * @var {*The latest block in the chain which will be replaced when filled with 4 transactions at the most} currentBlock
     *//*
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 1;
        this.pendingTransactions = [];
        this.miningReward = REWARD;
        this.currentBlock = null;
    }*/
    /**
     * The first block of the blockchain
     * It has only one transaction ! ! !
     *//*
    createGenesisBlock(){
        return new Block("01/01/2020",new Transaction("Genesis block","Genesis block",0),"o");
    }

    //get the last block in the blockchain
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
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
*/    /**
     * @param {*The publi
     c key of the miner} minerAddress 
     * Whenever money is added/removed to some user, the transaction is written in the block
     * so when the miner signed a transaction he get a reward which also written to the block
     */
  /*  miningPendingTransactions(minerAddress){
        if(minerAddress instanceof Miner){
            minerAddress = minerAddress.publicKey;
        }
        
        // Transaction which committed by the miner to the miner: null->miningRewardAddress
        const rewardTX = new Transaction(null, minerAddress, this.miningReward);
        const inserted = this.pendingTransactions[0];
        //moving it from the pending 
        this.pendingTransactions = this.pendingTransactions.slice(1);
+/
        if(this.currentBlock === null){
            //Mining with the first Transaction
            this.currentBlock = new Block(Date.now(), inserted ,this.getLatestBlock().hash);
            //Mining ...
            this.currentBlock.mineBlock(this.difficulty);
            /* Two transactions need to be added:
             * one for the miner
             * one which was the purpose of mining 
             */
  /*          if(this.currentBlock.addTransaction(inserted) === true){
                this.chain.push(...this.currentBlock);//dereferencing to the values
                this.currentBlock = null;
                //add now new block for the next if statement
                this.currentBlock = new Block(Date.now(), rewardTX, this.getLatestBlock().hash);
            }
            else if(this.currentBlock.addTransaction(rewardTX) === true){
                this.chain.push(...this.currentBlock);//dereferencing to the values
                this.currentBlock = null;
            }
        }
        else{
            if(this.currentBlock.addTransaction(inserted) === true){
                this.currentBlock.mineBlock(this.difficulty);
                this.chain.push(...this.currentBlock);
                this.currentBlock = null;
                this.currentBlock = new Block(Date.now(), rewardTX, this.getLatestBlock().hash);
            }
            else if(this.currentBlock.addTransaction(rewardTX) === true){
                this.chain.push(...this.currentBlock);
                this.currentBlock = null;
            }
        }    
    }*/
    /**
     * In the real Bitcoin there is no "Balance" attribute for each block
     * It's calculated by scanning all the blockchain
     * @param {Queried Address} address 
     *//*
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
                return false;
            }
            if(curBlock.prevHash !== prevBlock.hash){
                return false;
            }
        }
        return true;
    }
}

module.exports = Blockchain;*/