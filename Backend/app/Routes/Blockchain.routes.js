const express = require('express');
const {displayAll, createOne, deleteIt} = require('../Controllers/Blockchain.controllers');

function routes(app){
    const router = express.Router();
    /**
     * Displaying all the blockchain structure
     */
    router.get('/blockchain', displayAll);

    /**
     * In the request we are getting a transaction
     * And then adding it to the DB\ creating a new blockchain
     * The difficulty is 2 leading zeros 
     */
    router.post('/blockchain', createOne);

        
    router.delete('/blockchain', deleteIt);

    app.use('/',router);
}


module.exports = routes;