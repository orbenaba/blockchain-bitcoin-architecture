const express = require('express');


const {displayAll, createOne, deleteIt, mine} = require('../Controllers/Miner.controllers');

function routes(app){
    const router = express.Router();
    /**
     * Singleton pattern, we use only one miner
     * Displaying the miner in the DB
     */
    router.get('/miner',displayAll);

    //Adding new miner
    router.post('/miner', createOne)

    router.delete('/miner', deleteIt)

    router.post('/mineblocks', mine);

    app.use('/',router);
}



module.exports = routes;