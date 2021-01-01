const {MinerModel, MinerSchema} = require('../../../Schemas/Miners');
const {BlockchainModel, BlockchainSchema} = require('../../../Schemas/Blockchain');


async function displayAll(req, res){
    //Loading everything from the transactions Schema and send it as a response
    const data = await MinerModel.displayAll();
    if(data == null){
        res.send({noMiners:'No Miners'})
    }
    else{
        console.log('Miner sent back ...');
        res.send(data);
    }
}

async function createOne(req, res){
    //Validating the request
    if(!req.body.name || !req.body.money){
        res.status(400).send({message: "You must give a name & money to the miner !"});
    }
    else{
        /**
         * Saving a TX
         * Note that [publicKey, privateKey] is generated and saved automatically
         */
        const data = await MinerModel.addMiner(req.body.name, req.body.money)
        res.send(data)
    }
}

async function deleteIt(req, res){
    try{
        MinerModel.removeAll();
        console.log('[+] All data removed from Miners schema !');
        res.send({message: 'Miners\' rows deleted' })
    }
    catch(err){
        console.error('[-] Error occurred while deleting Miners ...');
    }
}

async function mine(req, res){
    //creating a new Blockchain with difficulty of 2, if the blockchain already existed then use it
    let chain = await BlockchainModel.blockchainCreator(2);
    const miner = req.body;
    await chain.miningPendingTransactions(miner);
    chain = await chain.refresh();
    res.send(chain);
}

module.exports = {displayAll, createOne, deleteIt, mine};