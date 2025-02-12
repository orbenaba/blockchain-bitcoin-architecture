const mongoose = require("../Backend/node_modules/mongoose");
const Block = require("./Block");
const { BlockModel, BlockSchema } = require("./Block");
const { TransactionModel, TransactionSchema } = require("./Transactions");
const { UserModel, UserSchema } = require("./Users");
const { MinerModel, MinerSchema } = require("./Miners");

const REWARD = 100;

const BlockchainSchema = new mongoose.Schema({
  /**
   * @var {*Building our chain as an array} chain
   * @var {*The length of zeros which the miner needs to get to} difficulty
   * @var {*The pending transactions which wait for someone to mine a block for them} pendingTransactions
   * @var {*The price the miner gets when succeeds} miningReward
   * @var {*The latest block in the chain which will be `rep`laced when filled with 4 transactions at the most} currentBlock
   */
  chain: [BlockSchema],
  difficulty: {
    type: Number,
    required: true,
    default: 2,
  },
  pendingTransactions: [TransactionSchema],
  miningReward: {
    type: Number,
    required: true,
    default: REWARD,
  },
  currentBlock: {
    type: BlockSchema,
    default: null,
  },
  TXPerBlock: {
    type: Number,
    required: true,
    default: 2,
  },
});

/**
 * Used as a wrapper in order to establish singleton design - THERE IS ONLY ONE BLOCKCHAIN !-!-!
 */
BlockchainSchema.statics.blockchainCreator = async function (
  difficulty,
  TXPerBlock,
  miningReward
) {
  const existed = await BlockchainModel.getExisting();
  if (existed === null) {
    return await new BlockchainModel({ difficulty, TXPerBlock, miningReward });
  } else {
    return existed;
  }
};

/**
 * Hook function to fill the first genesis block when the blockchain is created
 * Used only and only for genesis block !!! other blocks will be ignored
 */
BlockchainSchema.pre("save", async function (next) {
  try {
    if (this.chain.length == 0) {
      if (this.currentBlock === null) {
        this.currentBlock = new BlockModel({
          timestamp: Date.now(),
          transactions: {
            fromAddress: "Genesis block",
            toAddress: "Genesis block",
            amount: 0,
            timestamp: Date.now(),
          },
          prevHash: "",
        });
      }
      this.currentBlock.hash = await this.currentBlock.calculateHash();
      await this.chain.push(this.currentBlock);
      this.currentBlock = new BlockModel({
        timestamp: Date.now(),
        transactions: [],
        prevHash: this.chain[0].hash,
      });
      console.log("[+] Genesis ...");
    }
    next();
  } catch (err) {
    console.error(err);
  }
});

/**
 * Very useful action, worth the func
 */
BlockchainSchema.methods.getLatestBlock = async function () {
  return this.chain[this.chain.length - 1];
};

/**
 * Simply push the transaction to the pendingArray
 * Note that caller must call refresh func after calling this func
 * @param {fromAddress user type - (U = Users or M = Miners)} op1
 * @param {toAddress user type - (U = Users or M = Miners)} op2
 */
BlockchainSchema.methods.addTransaction = async function (
  fromAddress,
  toAddress,
  amount,
  op1 = "U",
  op2 = "U"
) {
  try {
    //First, we need to check if the TX is valid
    const user1 = await UserModel.getMoneyByPublic(fromAddress);
    if (user1 === null) {
      return null;
    }
    const user2 = await UserModel.getMoneyByPublic(toAddress);
    if (user2 === null) {
      return null;
    }
    //then TX is invalid
    if (user1.money < amount) {
      return null;
    }
    /**
     * The TX is valid, just update the wallets ....
     * Explanation:
     * In this way, we defend from a critical problem - Double spending,
     * Yes, this is the solution !
     */
    let amon1 = parseInt(user1.money) - amount;
    let amon2 = parseInt(user2.money) + parseInt(amount);
    user1.money = amon1;
    user2.money = amon2;
    await user1.save();
    await user2.save();

    await this.pendingTransactions.push({
      fromAddress,
      toAddress,
      amount,
      externalModelType1: op1 === "U" ? "Users" : "Miners",
      externalModelType2: op2 === "U" ? "Users" : "Miners",
    });
    await this.save();
    return "blabla";
  } catch (err) {
    console.error(err);
  }
};
/**
 * Simply adding the transaction to the current Block and if addTransaction of BlockSchema
 * return true, then we'll add new block
 * @param {The public key of the miner} minerAddress
 * @returns {
 * String - "No pending TXs" -> means that no one need a miner
 * Boolean - True -> means
 * }
 */
BlockchainSchema.methods.miningPendingTransactions = async function (minerr) {
  const minerAddress = minerr.publicKey;
  //The miner collect at the most 3 transactions together and mining em
  while (true) {
    //Getting the most first TX in the array and
    const pendedTX = await this.popFirstPendingTX();
    if (pendedTX === false) {
      console.log("[!] There are no pending TXs !");
      return null;
    }
    //
    if (this.currentBlock === null) {
      this.currentBlock = new BlockModel({
        transactions: [],
        prevHash: this.getLatestBlock().hash,
      });
    }
    const res = await this.currentBlock.addTransaction(
      pendedTX.fromAddress,
      pendedTX.toAddress,
      pendedTX.amount,
      "U",
      "U"
    );
    if (res === false) {
      //We need to mine the current block and progress
      //The TX which rewards the miner
      await this.currentBlock.addTransaction(
        minerAddress,
        minerAddress,
        REWARD,
        "M",
        "M"
      );
      //Updating the DB appropriately
      let miner = await MinerModel.getMoneyByPublic(minerAddress);

      if (miner === null) {
        console.error("[-] Invalid miner address");
        return;
      }
      miner.money += REWARD;
      await miner.save();
      //We got 4 transactions !
      await this.currentBlock.mineBlock(this.difficulty);
      await this.chain.push(this.currentBlock);
      //The block probably mined
      const newBlock = await new BlockModel({
        timestamp: Date.now(),
        prevHash: this.currentBlock.hash,
      });
      this.currentBlock = newBlock;
      await this.save();
      return;
    }
  }
};

/**
 * @returns {The first pending TX and remove it, if there are no pending TXs, then returns false}
 */
BlockchainSchema.methods.popFirstPendingTX = async function () {
  try {
    //Referring the array like a queue
    if (this.pendingTransactions.length == 0) {
      return false;
    }
    const returned = await this.pendingTransactions.shift();
    await this.save();
    return returned;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Scanning all the blockchain to find the balance of a specific address
 */
BlockchainSchema.methods.getBalanceOfAddress = async function (address) {
  let balance = 0;
  for (const block of this.chain) {
    for (const tran of block.transactions) {
      //The miner spends out money
      if (tran.fromAddress === address) {
        balance -= tran.amount;
      }
      //The miner profits money
      if (tran.toAddress === address) {
        balance += tran.amount;
      }
    }
  }
  return balance;
};

/**
 * Validate the chain
 * To deny attempts for harsh
 */
BlockchainSchema.methods.isChainValid = async function () {
  let len = this.chain.length;
  for (let i = 1; i < len; i++) {
    const curBlock = this.chain[i];
    const prevBlock = this.chain[i - 1];
    if (!curBlock.hasValidTransactions()) {
      return false;
    }
    //Validate that no one change the values
    if (curBlock.hash !== curBlock.calculateHash()) {
      return false;
    }
    if (curBlock.prevHash !== prevBlock.hash) {
      return false;
    }
  }
  return true;
};
/**
 * When we receive a new chain which is valid and longer than ours,
 * we must use that chain and discard our chain,
 *  more formally we must replace our chain with the new longer chain
 */
BlockchainSchema.methods.replaceChain = async function (otherChain) {
  if (otherChain.length <= this.chain.length) {
    console.log("[-] Received chain is not longer than the current chain");
    return;
  } else if (!(await otherChain.isChainValid())) {
    console.log("[-] Received chain is invalid");
    return;
  }
  console.log("[+] Replacing the current chain with the new one");
  this.chain = otherChain;
  await this.save();
};

/**
 * Re-retrieve the data from the DB
 */
BlockchainSchema.methods.refresh = async function () {
  try {
    const returned = await BlockchainModel.findById(this._id);
    return returned;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Returns all the rows in the DB
 */
BlockchainSchema.statics.displayAll = async () => {
  try {
    const data = await BlockchainModel.find({});
    return data.length === 0 ? null : data[0];
  } catch (err) {
    console.error("Can't retrieve the blockchain ...");
  }
};

/**
 * Deleting all the blockchain
 */
BlockchainSchema.statics.deleteIt = async () => {
  //{} means ALL
  try {
    await BlockchainModel.deleteMany({});
  } catch (err) {
    return console.error(err);
  }
};
/**
 * Getting the blockchain from the database, keeping on singleton pattern
 */

BlockchainSchema.statics.getExisting = async () => {
  try {
    const data = await BlockchainModel.find({});
    if (data.length === 0) {
      return null;
    }
    return data[0];
  } catch (err) {
    console.error(err);
  }
};

const BlockchainModel = mongoose.model("Blockchain", BlockchainSchema);

module.exports = { BlockchainModel, BlockchainSchema };
