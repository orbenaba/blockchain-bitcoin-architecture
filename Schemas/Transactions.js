const { sign } = require('crypto');
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
    //used for the fromAddress - User/Miner
    externalModelType1:{
        type:String
    },
    //used for the toAddress - User/Miner
    externalModelType2:{
        type:String
    },

    fromAddress:{
        type: String,
        refPath:'externalModelType1',
        required: true
    },
    toAddress:{
        type: String,
        ref:'externalModelType2',
        required: true
    },

    amount:{
        type: Number,
        required: true
    },
    timestamp:{
        type: Date,
        required: true,
        default: Date.now()
    },
    signature:{
        type: String,
        required: false
    }
});
/**
 * Adding hook in order to add the signature right before the TX is saved in the DB
 */
TransactionSchema.pre("save",async function(next){
    this.signTransaction(this.fromAddress);
    console.log("[+] TX signed !");
})



TransactionSchema.methods.calculateHash = async function(){
    return await SHA256(this.fromAddress+this.timeStamp+this.amount+this.toAddress).toString();
}

/**
 * Sign the hash of the transaction with the private key
 * @param {The user - private key - who wants to sign the transaction} signingKey
 * @returns {The signed Transaction hash string} this.signature
 */
TransactionSchema.methods.signTransaction = async function(signingKey){
    //Checking whether someone is trying to spoof to the another wallet
    //Denote that public key is the address of the user
    if(signingKey !== this.fromAddress){
        console.error("[-] You can't sign transaction for other wallet");
        return;
    }
    const hashTx = await this.calculateHash();
    //sign in base64
    const signed = await ec.sign(hashTx,signingKey)
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
    const publicKey = await ec.keyFromPublic(this.fromAddress,'hex');
    //We decrypt the signature with the publicKey and then compare it to the this.calculateHash()
    return await publicKey.verify(this.calculateHash(), this.signature);
}

const TransactionModel = mongoose.model('Transactions', TransactionSchema);



module.exports = {TransactionModel, TransactionSchema};