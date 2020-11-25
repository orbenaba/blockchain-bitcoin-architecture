const WalletSPV = require('./WalletSPV');
const BlockChain = require('./BlockChain');


class Miner extends WalletSPV{
    /**
     * Creating a miner user, updating the relevant schemas
     * @param {*Each miner as a pointer to the blockchain} blockchain
     * it is intended to be a shared resource !!!
     */

     constructor(blockchain){
        super();
        this.blockchain = blockchain;
    }
}