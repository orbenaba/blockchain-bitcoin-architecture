const { SHA256 } = require('crypto-js');
const {MyNode} = require('./MyNode');
const {default: Queue} = require('queue');

//This tree contains multiple transactions in a complete binary-hashed tree
class MerkleTree{
    //root is the node that holds the tree, Transaction is given in ctor
    constructor(TX){
        this.root = new MyNode(TX);
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
}

module.exports.MerkleTree = MerkleTree;