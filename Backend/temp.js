const {MerkleTree }  = require('./MerkleTree');
const { Transaction } = require('./Transaction');

let tree = new MerkleTree(new Transaction("1.1.1.1","2.2.2.2",100));
tree.addTransaction(new Transaction("1.2.1.1","2.2.2.2",100));
tree.addTransaction(new Transaction("131.1.1","2.2.2.2",100));
tree.addTransaction(new Transaction("1.31.21.11","23.2.2.2",100));
tree.addTransaction(new Transaction("1.1.1.1","2.2.2w.2",100));
tree.addTransaction(new Transaction("1w.1.1.1","2.2.2s.2",100));
tree.addTransaction(new Transaction("1w.1.1.1","2.e2.2.2",100));
tree.addTransaction(new Transaction("1.1e.1.1","2e.2.2.2",100));

tree.printTree(tree.root);