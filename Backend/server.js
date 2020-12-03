//Routing
const express = require('express');
const routes =  require('./app/routes');
const {json, urlencoded} = require('body-parser');
const cors = require('cors');


//DataBase connecting
const mongoose = require('mongoose');
const db = require('../Schemas/keysToRemote').MongoURI;
mongoose.connect(db, {useNewUrlParser: true})
.then(console.log('[+] MongoDB connected ...'))
.catch(err=> console.error(err));

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
/*
 // P2P network which has 3 nodes:
 // one is miner(The one who owns the mempool DB)
 // the other are simple
const topology = require('fully-connected-topology');
const {Blockchain} = require('./Blockchain');
const {Transaction} = require('./Transaction')

//Building the network

const {stdin, exit, argv} = process
const {log} = console
const {me, peers} = extractPeersAndMyPort()
const sockets = {}

//Changing the console colors to green cause I am bored

console.log("\x1b[32m")
log('---------------------')
log('Welcome to j00k3r coin!')
log('The most secured distributed coin!!1')
log('me - ', me)
log('peers - ', peers)
log('connecting to peers...')

const myIp = toLocalIp(me)
const peerIps = getPeerIps(peers)



//connect to peers
topology(myIp, peerIps).on('connection', (socket, peerIp) => {
    const peerPort = extractPortFromIp(peerIp)
    log('connected to peer - ', peerPort)

    sockets[peerPort] = socket
    stdin.on('data', data => { //on user input
        const message = data.toString().trim()
        if (message === 'exit') { //on exit
            log('Bye bye')
            exit(0)
        }

        const receiverPeer = extractReceiverPeer(message)
        if (sockets[receiverPeer]) { //message to specific peer
            if (peerPort === receiverPeer) { //write only once
                sockets[receiverPeer].write(formatMessage(extractMessageToSpecificPeer(message)))
            }
        } else { //broadcast message to everyone
            socket.write(formatMessage(message))
        }
    })

    //print data when received
    socket.on('data', data => log(data.toString('utf8')))
})


//extract ports from process arguments, {me: first_port, peers: rest... }
function extractPeersAndMyPort() {
    return {
        me: argv[2],
        peers: argv.slice(3, argv.length)
    }
}

//'4000' -> '127.0.0.1:4000'
function toLocalIp(port) {
    return `127.0.0.1:${port}`
}

//['4000', '4001'] -> ['127.0.0.1:4000', '127.0.0.1:4001']
function getPeerIps(peers) {
    return peers.map(peer => toLocalIp(peer))
}

//'hello' -> 'myPort:hello'
function formatMessage(message) {
    return `${me}>${message}`
}

//'127.0.0.1:4000' -> '4000'
function extractPortFromIp(peer) {
    return peer.toString().slice(peer.length - 4, peer.length);
}

//'4000>hello' -> '4000'
function extractReceiverPeer(message) {
    return message.slice(0, 4);
}

//'4000>hello' -> 'hello'
function extractMessageToSpecificPeer(message) {
    return message.slice(5, message.length);
}
 */