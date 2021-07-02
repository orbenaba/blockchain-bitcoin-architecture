const mongoose = require("../Backend/node_modules/mongoose");

const { SHA256 } = require("../Backend/node_modules/crypto-js");
const { default: Queue } = require("../Backend/node_modules/queue");
const { TransactionModel } = require("./Transactions");

const MyNodeSchema = new mongoose.Schema({
  hashTX: {
    type: String,
  },
  leftNode: {
    type: this,
    default: null,
  },
  rightNode: {
    type: this,
    default: null,
  },
});

const MyNodeModel = mongoose.model("MyNodes", MyNodeSchema);

//This tree contains multiple transactions in a complete binary-hashed tree
const MerkleTreeSchema = new mongoose.Schema({
  root: {
    type: MyNodeSchema,
    default: null,
  },
});

MerkleTreeSchema.methods.addTransaction = async function (added) {
  let addedTX = null;
  if (added instanceof TransactionModel) {
    addedTX = await added.calculateHash();
  } else {
    //else, the transaction has already been hashed
    addedTX = added;
  }

  //place: the node to which we need to add the new hash
  let place = await this.findApproPlace(this.root);
  //Go to the most left leave
  if (place === null) {
    while (place !== null && place.leftNode !== null) {
      place = place.leftNode;
    }
  }
  //At this point, we have a targeted node we can insert to it the new hash
  let inserted = await new MyNodeModel(addedTX, 1);
  //if there are no nodes on the tree
  if (place === null) {
    this.root = inserted;
  } else {
    //policy: when inserting a new node, move the current node to the left leave
    //        and the new node to be at the right, current node will be the union
    let unionHashes = await SHA256(place.hashTX + inserted.hashTX).toString();
    place.leftNode = await new MyNodeModel(place.hashedTX, 1);
    place.rightNode = inserted;
    place.hashedTX = unionHashes;
  }
};
//Finds the most fit place to add the new node in order to keep the tree perfect and balanced
MerkleTreeSchema.methods.findApproPlace = async function (someNode) {
  if (someNode === null) {
    return null;
  }
  let q = new Queue();
  q.push(someNode);
  while (q.length > 0) {
    let poped = q.pop();
    if (poped.leftNode === null && poped.rightNode === null) {
      return poped;
    }
    if (poped.leftNode !== null) {
      q.push(poped.leftNode);
    }
    if (poped.rightNode !== null) {
      q.push(poped.rightNode);
    }
  }
};
//temp function
MerkleTreeSchema.methods.printTree = async function () {
  if (this.root !== null) {
    let q = new Queue();
    q.push(this.root);
    let counter = 1;
    while (q.length > 0) {
      let poped = q.pop();
      let left = poped.leftNode;
      let right = poped.rightNode;
      console.log(poped.hashedTX);
      //checking whether counter is power of two
      if ((counter & (counter - 1)) == 0) {
        console.log("-".repeat(70));
      }
      counter++;
      if (left !== null) {
        q.push(left);
      }
      if (right != null) {
        q.push(right);
      }
    }
  }
};

const MerkleTreeModel = mongoose.model("MerkleTrees", MerkleTreeSchema);

module.exports = { MerkleTreeSchema, MerkleTreeModel };
