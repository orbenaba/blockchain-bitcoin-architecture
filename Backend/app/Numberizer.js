/**
 * Special schmea which destinated to be a shared variable to all the PEERS
 * Unique port is given to each user
 */
const mongoose = require('mongoose');
const {P2P_BASIS, HTTP_BASIS} = require('../../CONSTANTS');

/**
 * Time expires each 30 minutes
 */
const P2PNumberizerSchmea =  new mongoose.Schema({
    index:{
        type:Number,
        required:false//,
       // expires: 30*60
    }
});


P2PNumberizerSchmea.statics.getIndex = async function(){
    try{
        const i = await P2PNumberizerModel.findOne({});
        if(i === null){
            //generating new one
            const index = await new P2PNumberizerModel({index:P2P_BASIS});
            await index.save();
            return index.index;
        }
        else{
            i.index++;
            await i.save();
            return i.index;
        }

    }catch(err){
        console.error(err);
    }
}

/**
 * Time expires each 30 minutes
 */
const HTTPNumberizerSchmea =  new mongoose.Schema({
    index:{
        type:Number,
        required:false//,
       // expires: 30*60
    }
});

HTTPNumberizerSchmea.statics.getIndex = async function(){
    try{
        const i = await HTTPNumberizerModel.findOne({});
        if(i === null){
            //generating new one
            const index = await new HTTPNumberizerModel({index:HTTP_BASIS});
            await index.save();
            return index.index;
        }
        else{
            i.index++;
            await i.save();
            return i.index;
        }

    }catch(err){
        console.error(err);
    }
}

const HTTPNumberizerModel = mongoose.model('HTTPNumberizer', HTTPNumberizerSchmea);
const P2PNumberizerModel = mongoose.model('P2PNumberizer',P2PNumberizerSchmea)

module.exports = {P2PNumberizerSchmea, P2PNumberizerModel, HTTPNumberizerModel, HTTPNumberizerSchmea};