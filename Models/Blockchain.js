/*
class Blockchain{

        miningPendingTransactions(minerAddress){
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
}
*/