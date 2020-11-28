const WalletSPV = require('./WalletSPV').WalletSPV;
const WalletCreator = require('./WalletSPV').WalletCreator;

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
    
    static async MinerCreator(blockchain){
        let miner = await new Miner(blockchain);
        miner.WalletSPV = await WalletSPV.WalletCreator();
        return miner;
    }
}

module.exports.Miner = Miner;
module.exports.MinerCreator = Miner.MinerCreator;