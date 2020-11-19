const SHA256 = require('crypto-js/sha256');


class Block{
    //Attributes:
    //index of the block
    //timestamp
    //data of the block
    //previous hash - default value for the first block
    //hash = current hash which is calculated by the relevant values
    constructor(index, timeStamp,data,prevHash=''){
        this.index = index;
        this.timeStamp = timeStamp;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index+this.prevHash+this.timeStamp+JSON.stringify(this.data)).toString();
    }
}

class Blockchain{
    constructor(){
        //build our block as an array
        this.chain = [this.createGenesisBlock()];
    }

    //The first block of the blockchain
    createGenesisBlock(){
        return new Block(0,"01/01/2020","Genesis block","o");
    }
    //get the last block in the blockchain
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    //Add a new block to the end of the block
    addBlock(newBlock){
        // in order to add the block to the chain, we must use the hash of the latest block
        newBlock.prevHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        // concatenating the newBlock
        this.chain.push(newBlock);
    }
    //Validate the chain
    //To deny attempts for harsh
    isValid(){
        let len = this.chain.length;
        for(let i=1;i < len;i++){
            const curBlock  = this.chain[i];
            const prevBlock = this.chain[i-1];
            //Validate that no one change the values
            if(curBlock.hash !== curBlock.calculateHash()){
                console.log(`1) Check blocks ${i}, ${i-1}`);
                return false;
            }
            if(curBlock.prevHash !== prevBlock.hash){
                console.log(`2) Check blocks ${i}, ${i-1}`);
                return false;
            }
        }
        return true;
    }
}

//Exporting the modules in this file to make them available to the rest of the world
module.exports.Block = Block;
module.exports.Blockchain = Blockchain;