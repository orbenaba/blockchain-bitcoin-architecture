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
const {HTTPNumberizerModel, P2PNumberizerModel} = require('./app/Numberizer')

async function main(){

    //declare the peer to peer server port
    const P2P_PORT = await P2PNumberizerModel.getIndex();
    console.log("P2P_PORT = ",P2P_PORT);
    //get the blockchain from the DB
    const blockchain = await BlockchainModel.blockchainCreator();
    const p2pserver = new P2pserver(blockchain, P2P_PORT);

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
    const HTTP_PORT = await HTTPNumberizerModel.getIndex();
    app.listen(HTTP_PORT, console.log(`Server started on port ${HTTP_PORT}`));


    p2pserver.listen();

}



main();