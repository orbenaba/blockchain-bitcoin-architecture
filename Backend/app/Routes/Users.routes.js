const express = require('express');

const {displayAll, create, deleteAll} = require('../Controllers/Users.controller');


function routes(app){
    const router = express.Router();

    
    // Displaying all the users in the DB
    router.get('/users', displayAll);

    //Adding new user
    router.post('/users', create);

    router.delete('/users', deleteAll);

    app.use('/',router);
}


module.exports = routes;