const { loadavg } = require('os');
const mongoose = require('../Backend/node_modules/mongoose');
/**
 * Each Transaction has the next attributes:
 * 
 */
const TransactionSchema = new mongoose.Schema({
    fromAddress:{
        type: String,
        required: true
    },
    toAddress:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    timestamp:{
        type: Date,
        required: true
    }
})

//Supposing the data came here is valid
//Adding transaction to the schema
/*TransactionSchema.statics.addTransaction = async (fromAddress, toAddress, amount)=>{
    let inserted = new Transactions({fromAddress, toAddress, amount});
    await inserted.save()
                .then(item=>{
                    console.log('TX added successfully')
                    return inserted;
                })
                .catch(item=>{
                    console.error('TX can\'t be added');
                });
}

//Retrieving all the rows from DB
TransactionSchema.statics.displayAll = async ()=>{
    try{
        const data = await Transactions.find({});
        return data;
    }
    catch(err){
        console.log('[-] Error displaying all the schema');
    }
}

//Removing all the schema
TransactionSchema.statics.removeAll = async()=>{
    try{
        await Transactions.deleteMany({})
        console.log('[+] All Transactions removed successfully');
    }

    catch(err){
        console.error('[-] Error in deleting all the rows in TX schema')
    }
}*/






const TransactionModel = mongoose.model('Transactions', TransactionSchema);

module.exports = {TransactionModel, TransactionSchema};