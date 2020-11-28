const Wallet = require('./Schemas/Wallet');

class WalletSPV{
    /**
     * Simplify Payment Verification users who are not miners.
     * But can transfer money among them,
     * Note that Miner is the derived class who has more attributes
     * @param {*By default each wallet is initialized with 0, but might initialized manually} amountOfMoney
     * @var {*The address which used no navigate to the user} publicKey
     * @var {*At first all wallets are initialize to 0} amountOfMoney
     */
    constructor(amountOfMoney){
        const pair = Wallet.addNewKeys();
        console.log("pair = ",pair);
        this.publicKey = pair.publicKey;
        this.privateKey = pair.privateKey;
        this.amountOfMoney = amountOfMoney;
    }
    static async WalletCreator(amountOfMoney = 0){
        const wlt = await new WalletSPV(amountOfMoney);
        return wlt;
    }
}

module.exports.WalletSPV = WalletSPV;
module.exports.WalletCreator = WalletSPV.WalletCreator;