const {Transaction} = require('./Transaction');
const { SHA256 } = require("crypto-js");

class MyNode
{
    // choice is used to differentiate between the two ctors
    constructor(TX , choice = 0, leftNode = null, rightNode = null)
    {
        if(choice !== 0){
            this.hashedTX = TX;
        }
        else{
            if(!(TX instanceof Transaction)){
                throw new Error("Failed in creating a node for new Transaction!")
            }
            else{
                this.hashedTX = TX.calculateHash()
            }
        }
        this.leftNode= leftNode;
        this.rightNode = rightNode;
    }
}

module.exports.MyNode = MyNode;