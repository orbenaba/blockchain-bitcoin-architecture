const {Transaction} = require("./Transaction");
const { SHA256 } = require("crypto-js");

class MyNode
{
    // choise is used to differentiate between the two ctors
    constructor(TX , choise = 0, leftNode = null, rightNode = null)
    {
        if(choise !== 0){
            this.hashedTX = TX;
        }
        else{
            this.hashedTX = TX.calculateHash();
        }
        this.leftNode= leftNode;
        this.rightNode = rightNode;
    }
}

module.exports.MyNode = MyNode;