const express = require('express');
const Users = require('../../Schemas/Users');
const Transactions = require('../../Schemas/Transactions');
const { Router } = require('express');


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
        res.json({message: "Welcome to j00k3r c0in!"});
    })
    /**
     * Displaying the main page of the website, 
     * something like: "j00k3r c0in w3bs1T3"
     */
    router.get('/',(req, res)=>{
        //This is where we send the main page
        res.send('j00k3r c0in');
    });
    /**
     * Displaying all the users in the DB
     */
    router.get('/users',async (req,res)=>{
        //Loading everything from the users Schema and send it as a response
        const data = await Users.displayAll();
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
        const data = await Transactions.displayAll();
        console.log(data);
        if(data === null || data === '{}'){
            res.send({message:'No transactions'})
        }
        else{
            console.log('All transactions sent back ...');
            res.send(data);
        }
    });
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
            Transactions.addTransaction(req.body.fromAddress,req.body.toAddress,req.body.amount)
            res.send({message:'TX added successfully !!!'})
        }
    })


    //Adding new user
    router.post('/users', (req,res)=>{
       //Validating the request
       console.log(req.body);
        if(!req.body.name){
            res.status(400).send({message: "You must give a name to the user !"});
        }
        else{
            /**
             * Saving a TX
             * Note that [publicKey, privateKey] is generated and saved automatically
             */
            Users.addUser(req.body.name)
            res.send({message:'User added successfully !!!'})
        }
    })


    /**
     * <----------- DELETE REQUESTS ----------->
     */
    //Deleting all the info in the schema
    router.delete('/transactions',(req,res)=>{
        try{
            Transactions.removeAll();
            console.log('[+] All data removed from Transactions schema !');
            res.send({message: 'Transactions\' rows deleted' })
        }
        catch(err){
            console.error('[-] Error occurred while deleting Transactions ...');
        }
    })

    router.delete('/users',(req,res)=>{
        try{
            Users.removeAllUsers();
            console.log('[+] All data removed from Users schema !');
            res.send({message: 'Users\' rows deleted' })
        }
        catch(err){
            console.error('[-] Error occurred while deleting Users ...');
        }
    })

    //Externalizing the created API to the app
    app.use('/',router);
};

module.exports = routes;