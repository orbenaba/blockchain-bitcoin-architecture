const WebSocket = require('../node_modules/ws');
const {P2PNumberizerModel,HTTPNumberizerModel} = require('./Numberizer');



//list of address to connect to
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];


class P2pserver{
    constructor(blockchain, P2P_PORT){
        this.blockchain = blockchain;
        this.sockets = [];
        this.P2P_PORT = P2P_PORT;
    }

    //create a new p2p server and connections
    listen(){
        //create the p2p server with port as argument
        const server = new WebSocket.Server({port: this.P2P_PORT});

        //event listener and a callback function for any new connection
        //on any new connection the current instance will send the current chain
        //to the newly connected peer
        server.on('connection', socket => this.connectionSocket(socket));

        //to connect to the peers that we have specified
        this.connectionToPeers();

        console.log(`Listening for peer to peer connection on port: ${this.P2P_PORT}`);
    }


    //after making connection to a socket
    connectionSocket(socket){
        //push the socket to the socket array
        this.sockets.push(socket);
        console.log('Socket connected');

        //register a message event listener to the socket
        this.messageHandler(socket);

        //on new connection send the blockchain chain to the peer
        this.sendChain(socket);
    }

    connectionToPeers(){
        //connect to each peer
        peers.forEach(peer=>{
            //create a socket for each peer
            const socket = new WebSocket(peer);

            //open event listener is emitted when a connection is established
            //saving the socket in the array
            socket.on('open', ()=>this.connectionSocket(socket));
        })
    }

    messageHandler(socket){
        //On receiving message execute a callback function
        socket.on('message', message=>{
            const data = JSON.parse(message);
            this.blockchain.replaceChain(data);
        })
    }

    sendChain(socket){
        socket.send(JSON.stringify(this.blockchain.chain))
    }
    syncChain(){
        this.sockets.forEach(socket=>{
            this.sendChain(socket);
        })
    }
}


module.exports = P2pserver;