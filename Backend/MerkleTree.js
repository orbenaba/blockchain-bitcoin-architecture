const { SHA256 } = require('crypto-js');
const {Transaction} = require('./Transaction');
const {MyNode} = require('./MyNode');
const {queue, default: Queue} = require('queue');
const { count } = require('console');

class MerkleTree{
    
    //root is the node that holds the tree
    constructor(hashedTransaction){
        this.root = new MyNode(hashedTransaction, null, null);
    }
    addTransaction(addedHash)
    {
        //place is the node to which we need to add the new hash
        let place = this.upperNode(this.root);
        //Go to the most left leave
        if(place === null){
            while(place !== null && place.leftNode !== null){
                place = place.leftNode;
            }
        }
        //At this point, we have a targeted node we can insert to it the new hash
        let inserted = new MyNode(addedHash, null, null);
        //if there are no nodes on the tree
        if(place === null){
            this.root = inserted;
        }
        else{
            //policy: when inserting a new node, move the current node to the left leave
            //        and the new node to be at the right, current node will be the union
            let unionHashes = SHA256(place.content.toString() + inserted.content.toString()).toString();
            place.leftNode = new MyNode(place.content, null, null);
            place.rightNode = inserted;
            place.content = unionHashes;
        }
    }
    // null is returned in a case that the binary tree is perfect
    upperNode(someNode)
    {
        if(someNode === null){
            return null;
        }
        if(someNode.rightNode === null && someNode.leftNode === null){
            return someNode;
        }
        if(someNode.rightNode === null && someNode.leftNode !== null || someNode.rightNode !== null && someNode.leftNode === null){
            return someNode;
        }
        // someNode.rightNode !=null && someNode.leftNode != null
        let node = this.upperNode(someNode.leftNode)
        if(node !== null){
            return node;
        }
        return this.upperNode(someNode.rightNode);
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
                console.log(poped.content);
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