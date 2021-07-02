const { BlockchainModel } = require("../../../Schemas/Blockchain");

async function displayAll(req, res) {
  const data = await BlockchainModel.displayAll();
  if (data) {
    return res.send(data);
  }
  return res.send({ notCreated: "No blockchain created yet !" });
}

async function createNewChain(req, res) {
  try {
    const difficulty = req.body.difficulty;
    const TXPerBlock = req.body.TXPerBlock;
    const miningReward = req.body.miningReward;
    if (!difficulty || !TXPerBlock || !miningReward) {
      return res.status(400).send({
        error:
          "All fields are required - difficulty, TX per block, mining reward !",
      });
    }
    let chain = await BlockchainModel.blockchainCreator(
      difficulty,
      TXPerBlock,
      miningReward
    );
    return res.send(chain);
  } catch (err) {
    return res.status(500).send({ error: err });
  }
}

async function addTXtoChain(req, res) {
  try {
    const fromAddress = req.body.fromAddress;
    const toAddress = req.body.toAddress;
    const amount = req.body.amount;
    if (!fromAddress || !toAddress || !amount) {
      return res.status(400).send({
        error: "All fields are required - toAddress, fromAddress, amount !",
      });
    }
    //the chain has already been created
    let chain = await BlockchainModel.blockchainCreator();
    //Note that the data is saved by the addTransaction func !
    const result = await chain.addTransaction(fromAddress, toAddress, amount);
    if (!result) {
      return res.status(400).send({ error: "Not enough money" });
    } else {
      chain = await chain.refresh();
      console.log("[+] TX added to the chain !");
      return res.send(chain);
    }
  } catch (err) {
    return res.status(500).send({ error: err });
  }
}

async function deleteIt(req, res) {
  try {
    await BlockchainModel.deleteIt();
    console.log("[+] Blockchain deleted successfully !");
    res.send({ message: "Blockchain deleted successfully" });
  } catch (err) {
    console.error(err);
  }
}

module.exports = { displayAll, createNewChain, addTXtoChain, deleteIt };
