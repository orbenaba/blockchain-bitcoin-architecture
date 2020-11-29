//Routing
const express = require('express');
const app = express();
const router = express.Router();

//DataBase
const mongoose = require('mongoose');
const db = require('../Schemas/keysToRemote').MongoURI;
mongoose.connect(db, {useNewUrlParser: true})
.then(console.log('[+] MongoDB connected ...'))
.catch(err=> console.error(err));



//Routes
//Main page
router.get('/',(req,res)=>res.send('index.html'));

/**
 * Add user path
 * When clicking the button, this routing is called 
 */
router.get('/addUser',(req,res)=>{
    
})

//Add miner path
//This function is more complicated cause we will need to create a server to each miner seperately 
/*
router.get('/addMiner',(req,res)=>{

})
*/


//connecting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));