const WalletSPV = require('./WalletSPV').WalletSPV;
const Blockchain = require('./Blockchain');


class Miner extends WalletSPV{
    /**
     * Creating a miner user, updating the relevant schemas
     * @param {*Each miner as a pointer to the blockchain} blockchain
     * it is intended to be a shared resource !!!
     */
     constructor(blockchain){
        super();
        if(blockchain instanceof Blockchain){
            this.blockchain = blockchain;
        }
        else{
            throw new Error("Miner should receive a pointer to the blockchain")
        }
    }
}

module.exports = {Miner};