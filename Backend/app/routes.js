const express = require('express');
const path = require('path');

const {MinerModel, MinerSchema} = require('../../Schemas/Miners');
const {UserModel, UserSchema} = require('../../Schemas/Users');


const {TransactionModel, TransactionSchema} = require('../../Schemas/Transactions');
const {BlockchainModel,BlockchainSchema} = require('../../Schemas/Blockchain');


function routes(app){
    const router = express.Router();

    //Routes
    /**
     * <------ GET REQUESTS ------->
     */
    /**
     * Main page
     */
    app.get('/', (req, res)=>{
        console.log("[+] Main page loaded");
       // res.json({message: "Welcome to j00k3r c0in!"});
       res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
    /**
     * Displaying the main page of the website, 
     * something like: "j00k3r c0in w3bs1T3"
     */
    router.get('/',(req, res)=>{
        //This is where we send the main page
        res.send({message:'j00k3r c0in'});
    });
    /**
     * Displaying all the users in the DB
     */
    router.get('/users',async (req,res)=>{
        //Loading everything from the users Schema and send it as a response
        const data = await UserModel.displayAll();
        if(data === null){
            res.send({message:'No users'})
        }
        else{
            console.log('All users sent back ...');
            res.send(data);
        }
    });
    /**
     * Displaying all the users in the DB
     */
    router.get('/transactions',async (req,res)=>{
        //Loading everything from the transactions Schema and send it as a response
        const data = await TransactionModel.displayAll();
        if(data === null){
            res.send({message:'No transactions'})
        }
        else{
            console.log('All transactions sent back ...');
            res.send(data);
        }
    });
    /**
     * Singleton pattern, we use only one miner
     * Displaying the miner in the DB
     */
    router.get('/miner',async (req,res)=>{
        //Loading everything from the transactions Schema and send it as a response
        const data = await MinerModel.displayAll();
        if(data == null){
            res.send({message:'No Miners'})
        }
        else{
            console.log('Miner sent back ...');
            res.send(data);
        }
    });
    /**
     * Displaying all the blockchain structure
     */
    router.get('/blockchain', async(req,res)=>{
        const data  = await BlockchainModel.displayAll();
        if(data === null){
            res.send({message:'No blockchain created yet !'})
        }
        else{
            res.send(data);
        }
    })










    /**
     * <----------- POST REQUESTS ----------->
     */
    //Adding new transaction
    router.post('/transactions', (req,res)=>{
        //Validating the request
        if(!req.body.fromAddress || !req.body.toAddress || !req.body.amount){
            res.status(400).send({message: "Content of TX cannot be empty"});
        }
        else{
            //Saving the TX
            TransactionModel.addTransaction(req.body.fromAddress,req.body.toAddress,req.body.amount)
            res.send({message:'TX added successfully !!!'})
        }
    })

    //Adding new user
    router.post('/users', async(req,res)=>{
       //Validating the request
       console.log(req.body);
        if(!req.body.name || !req.body.money){
            res.status(400).send({message: "You must give a name to the user !"});
        }
        else{
            /**
             * Saving a TX
             * Note that [publicKey, privateKey] is generated and saved automatically
             */
            const data = await UserModel.addUser(req.body.name, req.body.money);
            res.send(data)
        }
    })

    //Adding new miner
    router.post('/miner',async (req,res)=>{
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
    })
    /**
     * In the request we are getting a transaction
     * And then adding it to the DB\ creating a new blockchain
     * The difficulty is 5 leading zeros 
     */
    router.post('/blockchain',async(req,res)=>{
        const fromAddress = req.body.fromAddress;
        const toAddress = req.body.toAddress;
        const amount = req.body.amount;
        if(fromAddress === null || toAddress === null || amount === null){
            res.status(400).send({message:"All fields are required - toAddress, fromAddress, amount !"})
            return;
        }
        /*if(fromAddress === toAddress){
            res.status(400).send({message:"You can't transfer money to yourself"});
            return;
        }
        if(amount < 0){
            res.status(400).send({message: "HA".repeat(10)+ " Try harder !"});
            return;
        }*/
        //Adding here validation
        /**
 *          const data = await MinerModel.addMiner(req.body.name, req.body.money)
            res.send(data)
         */
        let chain = await BlockchainModel.blockchainCreator(2);
        //Note that the data is saved by the addTransaction func !
        await chain.addTransaction(fromAddress, toAddress, amount);
        chain = await chain.refresh();
        res.send(chain)
        console.log('[+] TX added to the chain !');
    })


    router.post('/mineblocks',async(req,res)=>{
        let chain = await BlockchainModel.blockchainCreator(2);
        const miner = req.body.publicKey;
        await chain.miningPendingTransactions(miner);
        res.send({message:"Block mined successfully"});
    })











    /**
     * <----------- DELETE REQUESTS ----------->
     */
    //Deleting all the info in the schema
    router.delete('/transactions',(req,res)=>{
        try{
            TransactionModel.removeAll();
            console.log('[+] All data removed from Transactions schema !');
            res.send({message: 'Transactions\' rows deleted' })
        }
        catch(err){
            console.error('[-] Error occurred while deleting Transactions ...');
        }
    })

    router.delete('/users',(req,res)=>{
        try{
            UserModel.removeAllUsers();
            console.log('[+] All data removed from Users schema !');
            res.send({message: 'Users\' rows deleted' })
        }
        catch(err){
            console.error('[-] Error occurred while deleting Users ...');
        }
    })

    router.delete('/miner',(req,res)=>{
        try{
            MinerModel.removeAll();
            console.log('[+] All data removed from Miners schema !');
            res.send({message: 'Miners\' rows deleted' })
        }
        catch(err){
            console.error('[-] Error occurred while deleting Miners ...');
        }
    })
    
    
    router.delete('/blockchain',async (req, res)=>{
        try{
            await BlockchainModel.deleteIt()
            console.log('[+] Blockchain deleted successfully !');
            res.send({message: 'Blockchain deleted successfully'})
        }
        catch(err){
            console.error(err);
        }
    })

    /**
     * 
     * 
     * 
     * 
     * 
     */
    //Externalizing the created API to the app
    app.use('/',router);
};


 

module.exports = routes;