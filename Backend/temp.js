const {MerkleTree }  = require('./MerkleTree');
const {MyNode} = require('./MyNode');

let tree = new MerkleTree(123);
tree.addTransaction(111);
tree.addTransaction(222);
tree.addTransaction(333);
tree.addTransaction(444);
tree.addTransaction(555);
tree.addTransaction(666);
tree.addTransaction(777);
tree.addTransaction(888);
tree.addTransaction(999);
tree.addTransaction(888);

tree.printTree(tree.root);