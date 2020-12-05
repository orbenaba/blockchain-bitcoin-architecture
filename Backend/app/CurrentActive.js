/**
 * Schmea for the current users
 */
const mongoose = require('mongoose');

const CurrentActiveSchema = new mongoose.Schema({
    users:{
        //port numbers
        type:[Number],
        required:false,
        expires:60//1 minutes
    }
},{timestamps: true})

CurrentActiveSchema.index({createdAt: 1},{expireAfterSeconds: 60})


CurrentActiveSchema.statics.getActives = async function(){
    try{
        const data = await CurrentActiveModel.findOne({});
        return data === null?null:data.users;
    }catch(err){    
        console.error(err);
    }
}

CurrentActiveSchema.statics.addPort = async function(port){
    try{
        let data = await CurrentActiveModel.findOne({});
        if(data === null){
            const added = await new CurrentActiveModel({users:[port]});
            await added.save();
            return true;
        }
        else{
            await data.users.push(port);
            await data.save();
            return true;
        }
    }catch(err){
        console.error(err);
    }
}




const CurrentActiveModel = mongoose.model('CurrentActives',CurrentActiveSchema);

module.exports = {CurrentActiveModel, CurrentActiveSchema};