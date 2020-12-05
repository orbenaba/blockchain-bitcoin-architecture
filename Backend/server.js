//Routing
const express = require('express');
const routes =  require('./app/routes');
const {json, urlencoded} = require('body-parser');
const cors = require('cors');
const portscanner = require('portscanner');


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
    //get the blockchain from the DB
    const blockchain = await BlockchainModel.blockchainCreator();
    //declare the peer to peer server port
    let P2P_PORT = await P2PNumberizerModel.getIndex();
    let HTTP_PORT = await HTTPNumberizerModel.getIndex();
    await portscanner.findAPortNotInUse([P2P_PORT,P2P_PORT+1000],'127.0.0.1')
                    .then((port)=>{
                        const p2pserver = new P2pserver(blockchain, port);

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
                        portscanner.findAPortNotInUse([HTTP_PORT,HTTP_PORT+1000])
                                        .then(port2=>{
                                            app.listen(port2, console.log(`Server started on port ${port2}`));
                                            p2pserver.listen();                    
                                        })
                    })
}



main();