const UserRoutes = require('./Users.routes');
const MinerRoutes = require('./Miner.routes');
const TransactionRoutes = require('./Transactions.routes');
const BlockchainRoutes = require('./Blockchain.routes');

module.exports =  function routes(app){
    UserRoutes(app);
    MinerRoutes(app);
    TransactionRoutes(app);
    BlockchainRoutes(app);
}