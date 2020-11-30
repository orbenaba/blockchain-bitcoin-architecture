const { SHA256 } = require('crypto-js');
const {MyNode} = require('./MyNode');
const {default: Queue} = require('queue');
const {Transaction } = require('./Transaction');
//This tree contains multiple transactions in a complete binary-hashed tree

class MerkleTree{
    /**
     *  Transaction is given in ctor
     * @param {*when 1 -> hash of TX had already calculated
     *               0-> hash of TX had not calculated yet.} choice
     * @param {*Transaction} TX
     * @var {*the node that holds the tree} root 
     */
    constructor(TX, choice = 0){
        this.root = new MyNode(TX, choice);
    }
    addTransaction(added)
    {
        let addedTX = null;
        if(added instanceof Transaction){
            addedTX = added.calculateHash();
        }
        else{
            //else, the transaction already been hashed
            addedTX = added;
        }
        
        //place: the node to which we need to add the new hash
        let place = this.findApproPlace(this.root);
        //Go to the most left leave
        if(place === null){
            while(place !== null && place.leftNode !== null){
                place = place.leftNode;
            }
        }
        //At this point, we have a targeted node we can insert to it the new hash
        let inserted = new MyNode(addedTX, 1);
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
     * Returning the amount of transactions in the tree
     */
    static getAmountOfTX(root){
        if(root === null){
            return 0;
        }
        if(root.leftNode === null && root.rightNode === null){
            return 1;
        }
        return this.getAmountOfTX(root.leftNode) + this.getAmountOfTX(root.rightNode);
    }

    treeToArray(){
        let q = new Queue();
        let arr = [];
        q.push(this.root);
        while(q.length > 0){
            let poped = q.pop();
            arr.push(poped);
            if(poped.leftNode !== null){
                q.push(poped.leftNode);
            }
            if(poped.rightNode !== null){
                q.push(poped.rightNode);
            }
        }
        return arr;
    }

}

module.exports.MerkleTree = MerkleTree;