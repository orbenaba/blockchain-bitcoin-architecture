const {
  TransactionModel,
  TransactionSchema,
} = require("../../../Schemas/Transactions");

async function displayAll(req, res) {
  //Loading everything from the transactions Schema and send it as a response
  const data = await TransactionModel.displayAll();
  if (!data) {
    res.send({ message: "No transactions" });
  } else {
    console.log("All transactions sent back ...");
    res.send(data);
  }
}

async function create(req, res) {
  //Validating the request
  if (!req.body.fromAddress || !req.body.toAddress || !req.body.amount) {
    res.status(400).send({ message: "Content of TX cannot be empty" });
  } else {
    //Saving the TX
    await TransactionModel.addTransaction(
      req.body.fromAddress,
      req.body.toAddress,
      req.body.amount
    );
    res.send({ message: "TX added successfully !!!" });
  }
}

async function deleteAll(req, res) {
  try {
    TransactionModel.removeAll();
    console.log("[+] All data removed from Transactions schema !");
    res.send({ message: "Transactions' rows deleted" });
  } catch (err) {
    console.error("[-] Error occurred while deleting Transactions ...");
  }
}

module.exports = { deleteAll, displayAll, create };
