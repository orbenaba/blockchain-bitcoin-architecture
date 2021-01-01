const {UserModel, UserSchema} = require('../../../Schemas/Users');

async function displayAll(req, res){
    //Loading everything from the users Schema and send it as a response
    const data = await UserModel.displayAll();
    if(data === null){
        res.send({message:'No users'})
    }
    else{
        console.log('All users sent back ...');
        res.send(data);
    }
}


async function create(req, res){
    //Validating the request
    if(!req.body.name || !req.body.money){
        res.status(400).send({message: "You must give a name to the user !"});
    }
    else{
        /**
         * Saving a TX
         * Note that [publicKey, privateKey] is generated and saved automatically
         */
        const data = await UserModel.addUser(req.body.name, req.body.money);
        res.send(data)
    }
}

async function deleteAll(req, res){
    try{
        UserModel.removeAllUsers();
        console.log('[+] All data removed from Users schema !');
        res.send({message: 'Users\' rows deleted' })
    }
    catch(err){
        console.error('[-] Error occurred while deleting Users ...');
    }
}


module.exports = {displayAll, create, deleteAll};