const HTTP_PORT = process.env.HTTP_PORT || 3001;
//Routing
const express = require('express');
const routes =  require('./app/routes');
const {json, urlencoded} = require('body-parser');
const cors = require('cors');


/**
 * DataBase connecting
 */
const mongoose = require('mongoose');
const db = require('../Schemas/keysToRemote').MongoURI;
mongoose.connect(db, {useNewUrlParser: true})
.then(console.log('[+] MongoDB connected ...'))
.catch(err=> console.error(err));

/**
 * P2P server
 */
const P2pserver = require('./app/p2p-server');
const { BlockchainModel } = require('../Schemas/Blockchain');


async function main(){

    //get the blockchain from the DB
    const blockchain = await BlockchainModel.blockchainCreator();
    const p2pserver = new P2pserver(blockchain);

    /**
     * HTTP server
     */

    //express config
    var corsOptions = { 
        origin: "http://localhost:8081"
    };
    const app = express();
    app.use(cors(corsOptions));
    //parse requests of content type - application/json
    app.use(json());
    //parse
    app.use(urlencoded({ extended: true}));

    //Setting routes to the express server
    routes(app);


    //connecting the server
    app.listen(HTTP_PORT, console.log(`Server started on port ${HTTP_PORT}`));

    p2pserver.listen();

}



main();