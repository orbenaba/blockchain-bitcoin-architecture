const SHA256 = require('crypto-js/sha256');
const { curve } = require('elliptic');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{
      //Note that in Monero coin those data is not known
      constructor(fromAddress, toAddress,amount){
          this.fromAddress = fromAddress;
          this.toAddress = toAddress;
          this.amount = amount;
          this.timeStamp = Date.now();
      }
      //Hashing the transaction
      calculateHash(){
          return SHA256(this.fromAddress+this.timeStamp+this.amount+this.toAddress).toString();
      }
      //sign the hash of the transaction with the private key
      signTransaction(signingKey){
          //Checking whether someone is trying to spoof to the another wallet
          //Denote that public key is the address of the wallet
          if(signingKey.getPublic('hex') !== this.fromAddress){
              throw new Error("You can't sign transaction for other wallet");
          }
          const hashTx = this.calculateHash();
          //sign in base64
          const signed = signingKey.sign(hashTx,'base64');
          //toDer() means that 'hex' is the format of the signature
          this.signature = signed.toDER('hex');
      }
      //validate the transaction, namely we want to be sure that this transaction signed by the one who 
      //owned this public key
      isValid(){
          //If we are mining then the fromAddress is null
          if(this.fromAddress === null){
              return true;
          }
          if(!this.signature || this.signature === 0){
              throw new Error("There is no signature for this transaction");
          }
          const publicKey = ec.keyFromPublic(this.fromAddress,'hex');
          //We decrypt the signature with the publicKey and then compare it to the this.calculateHash()
          return publicKey.verify(this.calculateHash(), this.signature);
      }
}
module.exports.Transaction = Transaction;