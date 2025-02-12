const mongoose = require("../Backend/node_modules/mongoose");
const SHA256 = require("../Backend/node_modules/crypto-js/sha256");
const { TransactionModel, TransactionSchema } = require("./Transactions");
const { MerkleTreeModel, MerkleTreeSchema } = require("./MerkleTree");
const { UserModel } = require("./Users");
const { MinerModel, MinerSchema } = require("./Miners");
const { BloomFilterModel, BloomFilterSchema } = require("./BloomFilter");

const MAX_TX_PER_BLOCK = 4;

const BlockSchema = new mongoose.Schema({
  /**
   *  Attributes:
   * @param {*} timestamp
   * @param {*data of the block} transaction
   * @param {*previous hash - default value for the first block} prevHash
   * @var {*current hash which is calculated by the relevant values} hash
   * @var {*for mining, by manipulating its value} nonce
   * @var {*used for quick searching in the block} merkleTree
   * @var {*used for disqualify the fact that a transaction is not in the merkle tree
   * , might invoke false positive alerts} bloomFilter
   */
  timestamp: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  transactions: [TransactionSchema],
  prevHash: {
    type: String,
    required: false,
  },
  hash: {
    type: String,
    required: true,
    default: "No hash yet",
  },
  nonce: {
    type: Number,
    required: true,
    default: 0,
  },
  merkleTree: {
    type: MerkleTreeSchema,
  } /*,
    bloomFilter:{
        type:BloomFilterSchema,
        default: new BloomFilterModel(),
    }*/,
});

/**
 * @param {The offset to be added to the nonce rather then updating each time the DB} index
 * @returns {The hash of the whole block}
 */
BlockSchema.methods.calculateHash = async function (index = 0) {
  return SHA256(
    this.prevHash +
      this.timestamp +
      JSON.stringify(this.transactions) +
      (this.nonce + index)
  ).toString();
};

/**
 * @param {The amount of zeros to be achieved by the miner} difficulty
 */
BlockSchema.methods.mineBlock = async function (difficulty) {
  let padding = "0".repeat(difficulty);
  let index = 0;
  console.log("[+] Start mining ...");
  let tempHash = null;
  do {
    tempHash = await this.calculateHash(index++);
  } while (tempHash.toString().substr(0, difficulty) !== padding);

  this.nonce += index - 1;
  this.hash = tempHash;
  console.log("[+] Block mined successfully !");
  await this.save();
};

/**
 * Checking whether the transactions has changed by someone
 */
BlockSchema.methods.hasValidTransactions = async function () {
  for (const tx of this.transactions) {
    if (!tx.isValid()) {
      return false;
    }
  }
  return true;
};

/**
 * @param {The TX to be added} transaction
 * @returns {True in case there is no need to mine a new block} flag
 */
BlockSchema.methods.addTransaction = async function (
  fromAddress,
  toAddress,
  amount,
  op1 = "U",
  op2 = "U"
) {
  //Validating the TX, is the fromAddress has enough money?
  let u1 = null;
  let u2 = null;
  if (op1 === "M") {
    u1 = await MinerModel.getMoneyByPublic(fromAddress);
  } else {
    u1 = await UserModel.getMoneyByPublic(fromAddress);
  }
  if (op2 === "M") {
    u2 = await MinerModel.getMoneyByPublic(toAddress);
  } else {
    u2 = await UserModel.getMoneyByPublic(toAddress);
  }
  if (u1 === null || u2 === null) {
    console.log("[-] Transaction not valid, users are not exist !");
    return;
  }
  if (u1.money < amount) {
    console.log(
      `[-] From Address has no enough money, he has: ${u1.money} and tried to transfer: ${amount}`
    );
    return;
  }
  if (u1 === "U" && u2 === "U") {
    u1.money -= amount;
    u2.money += amount;
    await u1.save();
    await u2.save();
  }

  const total = await this.transactions.length;
  let flag = total != MAX_TX_PER_BLOCK - 2;
  try {
    const inserted = { fromAddress, toAddress, amount, timestamp: Date.now() };
    if (this.transactions.length === 0) {
      this.transactions = await [inserted];
      this.merkleTree = await new MerkleTreeModel(inserted);
      //await this.bloomFilter.add(fromAddress+toAddress+amount.toString()+timestamp.toString());
      await this.save();
    } else {
      await this.merkleTree.addTransaction(inserted);
      //await this.bloomFilter.add(fromAddress+toAddress+amount.toString()+timestamp.toString());
      await this.transactions.push(inserted);
    }
    return flag;
  } catch (err) {
    console.error(err);
  }
  return flag;
};

//Refresh the state of the Object
BlockSchema.methods.refresh = async function () {
  try {
    const returned = await BlockModel.findById(this._id);
    return returned;
  } catch (err) {
    console.error(err);
  }
};

/**
 * @param {Specific block to be let its length calculated} blk
 */
BlockSchema.statics.amountOfTX = async function (blk) {
  try {
    const temp = await BlockModel.findById(blk._id);
    return temp.transactions === null ? 0 : temp.transactions.length;
  } catch (err) {
    console.error(err);
  }
};

const BlockModel = mongoose.model("Block", BlockSchema);

module.exports = { BlockModel, BlockSchema };
