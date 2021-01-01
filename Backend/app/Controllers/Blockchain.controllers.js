const {BlockchainModel} = require('../../../Schemas/Blockchain');

async function displayAll(req, res){
    const data  = await BlockchainModel.displayAll();
    if(data === null){
        res.send({message:'No blockchain created yet !'})
    }
    else{
        res.send(data);
    }
}


async function createOne(req, res){
    const fromAddress = req.body.fromAddress;
    const toAddress = req.body.toAddress;
    const amount = req.body.amount;
    if(fromAddress === null || toAddress === null || amount === null){
        res.status(400).send({message:"All fields are required - toAddress, fromAddress, amount !"})
        return;
    }

    let chain = await BlockchainModel.blockchainCreator(2);
    //Note that the data is saved by the addTransaction func !
    const result = await chain.addTransaction(fromAddress, toAddress, amount);
    if(result === null){
        res.send({error: 'Not enough money'});
    }
    else{
        chain = await chain.refresh();
        res.send(chain)
        console.log('[+] TX added to the chain !');    
    }
}


async function deleteIt(req, res){
    try{
        await BlockchainModel.deleteIt();
        console.log('[+] Blockchain deleted successfully !');
        res.send({message: 'Blockchain deleted successfully'})
    }
    catch(err){
        console.error(err);
    }
}


module.exports = {displayAll, createOne, deleteIt};