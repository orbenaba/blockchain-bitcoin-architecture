const SHA256 = require('../Backend/node_modules/crypto-js/sha256');
const mongoose = require('../Backend/node_modules/mongoose');
const EC = require('../Backend/node_modules/elliptic').ec;
const ec = new EC('secp256k1');

/**
 * Each Transaction has the next attributes:
 * @fromAddress {*The user - public key who send the transaction}
 * @toAddress {*The user - public key who get the transaction}
 * @amount {*The amount of money to be transacted}
 * @timestamp {*The date of the committed transaction}
 */
const TransactionSchema = new mongoose.Schema({
    fromAddress:{
        type: String,
        required: true
    },
    toAddress:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    timestamp:{
        type: Date,
        required: true
    }
})


TransactionSchema.methods.calculateHash = async function(){
    return await SHA256(this.fromAddress+this.timeStamp+this.amount+this.toAddress).toString();
}

/**
 * Sign the hash of the transaction with the private key
 * @param {The user who wants to sign the transaction} signingKey
 * @returns {The signed Transaction hash string} this.signature
 */
TransactionSchema.methods.signTransaction = async function(signingKey){
    //Checking whether someone is trying to spoof to the another wallet
    //Denote that public key is the address of the user
    if(signingKey.getPublic('hex') !== this.fromAddress){
        throw new Error("You can't sign transaction for other wallet");
    }
    const hashTx = this.methods.calculateHash();
    //sign in base64
    const signed = signingKey.sign(hashTx,'base64');
    //toDer() means that 'hex' is the format of the signature
    this.signature = signed.toDER('hex');
    return this.signature;
}

/**
 * Check whether the transaction is valid or not
 */
TransactionSchema.methods.isValid = async function(){
    //If we are mining then the fromAddress is null
    if(this.fromAddress === null){
        return true;
    }
    if(!this.signature || this.signature === 0){
        throw new Error("[-] There is no signature for this transaction");
    }
    const publicKey = ec.keyFromPublic(this.fromAddress,'hex');
    //We decrypt the signature with the publicKey and then compare it to the this.calculateHash()
    return publicKey.verify(this.calculateHash(), this.signature);
}

const TransactionModel = mongoose.model('Transactions', TransactionSchema);



module.exports = {TransactionModel, TransactionSchema};