/*const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const { PartitionedBloomFilter} = require('bloom-filters');

// mine
const {MerkleTree } = require('./MerkleTree');
const {Transaction} = require('./Transaction');*/

class Block{
  /*  constructor(timeStamp, transaction,prevHash=''){
        let hashedTX = null;
        if(transaction instanceof Transaction){
            hashedTX = transaction.calculateHash();
        }
        else{
            throw new Error("A transaction must be first passed for block ...")
        }
        this.timeStamp = timeStamp;
        this.prevHash = prevHash;
        this.hash = this.calculateHash(transaction);
        this.nonce = 0;
        this.merkleTree = new MerkleTree(hashedTX, 1);
        //2048 -size of bit array
        //1024 - number of elements to be inserted
        this.bloomFilter = new PartitionedBloomFilter(2048, 1024);
        this.bloomFilter.add(hashedTX);
    }
*/
}


module.exports = Block;