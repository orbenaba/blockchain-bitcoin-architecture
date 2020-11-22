const {MerkleTree }  = require('./MerkleTree');
const { Transaction } = require('./Transaction');

let tree = new MerkleTree(new Transaction("1.1.1.1","2.2.2.2",100));

tree.addTransaction(new Transaction("111111","222d22222",10000))
tree.addTransaction(new Transaction("33333","2222dd2222",10000))
tree.addTransaction(new Transaction("33333","4dddddddd3",10000))
tree.addTransaction(new Transaction("34343","2222cc2222",10000))
tree.addTransaction(new Transaction("1143431","22222222",10000))
tree.addTransaction(new Transaction("1113434d111","4343",10000))
tree.addTransaction(new Transaction("1111411","22222222",10000))


console.log(tree.hasTX(new Transaction("111111","222d22222",10000)))
console.log(tree.hasTX(new Transaction("33333","2222dd2222",10000)))
console.log(tree.hasTX(new Transaction("33333","4dddddddd3",10000)))
console.log(tree.hasTX(new Transaction("34343","2222cc2222",10000)))
console.log(tree.hasTX(new Transaction("1143431","22222222",10000)))
console.log(tree.hasTX(new Transaction("1113434d111","4343",10000)))
console.log(tree.hasTX(new Transaction("1111411","22222222",10000)))