const WebSocket = require('../node_modules/ws');


const {CurrentActiveModel, CurrentActiveSchema} = require('./CurrentActive');
const portscanner = require('portscanner');

class P2pserver{
    constructor(blockchain, P2P_PORT){
        console.log("p2p server was called !");
        this.blockchain = blockchain;
        this.sockets = [];
        this.P2P_PORT = P2P_PORT;
        this.peers = null;
    }

    //after making connection to a socket
    async connectionSocket(socket){
        //push the socket to the socket array
        await this.sockets.push(socket);
        console.log('Socket connected');

        //register a message event listener to the socket
        await this.messageHandler(socket);

        //on new connection send the blockchain chain to the peer
        await this.sendChain(socket);
    }

    //create a new p2p server and connections
    async listen(){
        //create the p2p server with port as argument
        const server = await new WebSocket.Server({port: this.P2P_PORT});
        this.peers = await this.peersGenerator();
        server.on('connection',(socket) =>{
            this.connectionSocket(socket)
        })
        


        if(this.peers !== null){
            await this.connectionToPeers();
        }
        await CurrentActiveModel.addPort(this.P2P_PORT);

        console.log(`Listening for peer to peer connection on port: ${this.P2P_PORT}`);
    }

    /**
     * Trying to connect to the whole Distributed network, who answers is welcome
     */
    async peersGenerator(){
        const data = await CurrentActiveModel.getActives();
        if(data !== null){
            let peers = [];
            for(let i=0;i<data.length;i++){
                peers.push(`ws://localhost:${data[i]}`);
            }
            return peers;
        }
        return null;
    }



    async connectionToPeers(){
        //connect to each peer
        this.peers.forEach(async (peer)=>{
            //create a socket for each peer
            const socket = await new WebSocket(peer);

            //open event listener is emitted when a connection is established
            //saving the socket in the array
            const p = await Number(peer.slice(15,20));
            if(p !== this.P2P_PORT){
                try{
                    const status = await portscanner.checkPortStatus(p, '127.0.0.1');
                    console.log("status =",status);
                    if(status === 'open'){
                        console.log("Port is opened !", p);
                        await socket.on('open', async()=>{await this.connectionSocket(socket)});
                        await socket.on('disconnect',async ()=> {
                            console.log("!!!!!  OUT    !!!!!")
                            let index = await this.peers.indexOf(Number(peer.slice(15,20)));
                            if(index !== -1){
                                this.peers.splice(index,1)
                                await CurrentActiveModel.removePort(Number(peer.slice(15,20)))
                            }
                        })
                    }
                    else{
                        console.log("Port is closed !", p);
                    }
                }
                catch(err){
                    console.error(err);
                }        
            }
        })
    }

    async messageHandler(socket){
        //On receiving message execute a callback function
        await socket.on('message', message=>{
            const data = JSON.parse(message);
            this.blockchain.replaceChain(data);
        })
    }

    async sendChain(socket){
        await socket.send(JSON.stringify(this.blockchain.chain))
    }
    async syncChain(){
        await this.sockets.forEach(socket=>{
            this.sendChain(socket);
        })
    }
}


module.exports = P2pserver;