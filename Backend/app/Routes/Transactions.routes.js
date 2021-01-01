const express = require('express');

const {deleteAll, displayAll, create} = require('../Controllers/Transactions.controller');


function routes(app){
    const router = express.Router();

    /**
     * Displaying all the users in the DB
     */
    router.get('/transactions', displayAll);

    //Adding new transaction
    router.post('/transactions', create);
    

    //Deleting all the info in the schema
    router.delete('/transactions', deleteAll);

    app.use('/',router);
}



module.exports = routes;