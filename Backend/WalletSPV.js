const Wallet = require('./Schemas/Wallet');

class WalletSPV{
    /**
     * Simplify Payment Verification users who are not miners.
     * But can transfer money among them,
     * Note that Miner is the derived class who has more attributes
     * @var {*The address which used no navigate to the user} publicKey
     * @var {*At first all wallets are initialize to 0} amountOfMoney
     */
    constructor(){
        const {pubKey, priKey} = Wallet.addNewKeys();
        this.publicKey = pubKey;
        this.privateKey = priKey;
        this.amountOfMoney = 0;
    }
}