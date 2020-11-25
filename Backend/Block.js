const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const { PartitionedBloomFilter} = require('bloom-filters');

// mine
const {MerkleTree } = require('./MerkleTree');

class Block{
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
    constructor(timeStamp,transaction,prevHash=''){
        this.timeStamp = timeStamp;
        this.prevHash = prevHash;
        this.hash = this.calculateHash(transaction);
        this.nonce = 0;
        const hashedTX = transaction.calculateHash();
        this.merkleTree = new MerkleTree(hashedTX, 1);
        //2048 -size of bit array
        //1024 - number of elements to be inserted
        this.bloomFilter = new PartitionedBloomFilter(2048, 1024);
        this.bloomFilter.add(hashedTX);
    }

    calculateHash(transaction){
        return SHA256(this.prevHash+this.timeStamp+JSON.stringify(transaction)+this.nonce).toString();
    }
    //In real life, the difficulty is changed every two weeks
    mineBlock(difficulty){
        //Comparing the hash with a string that composed by "difficulty+1" zeros
        let padding = '0'.repeat(difficulty);
        while(this.hash.substr(0,difficulty)!==padding){
            this.nonce ++;
            this.hash = this.calculateHash();
        }
    }
    //Each block contains some transactions and we want to validate each of them seperately
    hasValidTransactions(){
        for(const tx of this.transaction){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }
    /**
     * Adding a new Transaction to the merkle tree
     * @returns { true : need to mine a new block
     *            false: no need}
     */
    addTransaction(transaction){
        //Each block hash at the most 4 transactions according to the instructions
        const amount = MerkleTree.getAmountOfTX(this.merkleTree.root);
        if(amount < 3){
            this.merkleTree.addTransaction(transaction);
            return false;
        }
        else if(amount ==3){
            //Signing the block and need to create a new one
            this.merkleTree.addTransaction(transaction);
            return true;
        }
        else{
            return console.error("Cannot add more than 4 transactions per block ...");
        }
    }
}


module.exports.Block = Block;