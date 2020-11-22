const { SHA256 } = require('crypto-js');
const {MyNode} = require('./MyNode');
const {default: Queue} = require('queue');
const { PartitionedBloomFilter} = require('bloom-filters');
//This tree contains multiple transactions in a complete binary-hashed tree

class MerkleTree{
    //root is the node that holds the tree, Transaction is given in ctor
    //Bloom filter array is used to find quickly transactions but might invoke false positive alerts
    constructor(TX){
        this.root = new MyNode(TX);
        //512 -size of bit array
        //256 - number of elements to be inserted
        this.bloomFilter = new PartitionedBloomFilter(2048, 1024);
        this.bloomFilter.add(this.root.hashedTX);
    }
    addTransaction(addedTX)
    {
        //place: the node to which we need to add the new hash
        let place = this.findApproPlace(this.root);
        //Go to the most left leave
        if(place === null){
            while(place !== null && place.leftNode !== null){
                place = place.leftNode;
            }
        }
        //At this point, we have a targeted node we can insert to it the new hash
        let inserted = new MyNode(addedTX);
        this.bloomFilter.add(inserted.hashedTX);
        //if there are no nodes on the tree
        if(place === null){
            this.root = inserted;
        }
        else{
            //policy: when inserting a new node, move the current node to the left leave
            //        and the new node to be at the right, current node will be the union
            let unionHashes = SHA256(place.hashedTX.toString() + inserted.hashedTX.toString()).toString();
            place.leftNode = new MyNode(place.hashedTX, 1);
            place.rightNode = inserted;
            place.hashedTX = unionHashes;
        }
    }
    //Finds the most fit place to add the new node in order to keep the tree perfect and balanced 
    findApproPlace(someNode)
    {
        if(someNode === null){
            return null;
        }
        let q = new Queue();
        q.push(someNode)
        while(q.length > 0){
            let poped = q.pop();
            if(poped.leftNode === null && poped.rightNode === null){
                return poped;
            }
            if(poped.leftNode !== null){
                q.push(poped.leftNode);
            }
            if(poped.rightNode !== null){
                q.push(poped.rightNode);
            }
        }
    }
    //temp function
    printTree()
    {
        if(this.root !== null)
        {
            let q = new Queue();
            q.push(this.root);
            let counter = 1;
            while(q.length > 0)
            {
                let poped = q.pop();
                let left = poped.leftNode;
                let right = poped.rightNode;
                console.log(poped.hashedTX);
                //checking whether counter is power of two
                if((counter & (counter - 1)) == 0){
                    console.log("-".repeat(70));
                }
                counter ++;
                if(left !== null){
                    q.push(left);
                }
                if(right!=null){
                    q.push(right);
                }
            }
        }
    }

    /**
     * check if some TX exist in the Merkle tree by checking the bloom-filter array
     * Warning: False positive alerts might invoked !
     */
    hasTX(someTX){
        let temp = new MyNode(someTX);
        console.log(temp.hashedTX);
        return this.bloomFilter.has(temp.hashedTX);
    }
}

module.exports.MerkleTree = MerkleTree;