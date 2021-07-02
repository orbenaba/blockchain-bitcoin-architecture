const express = require("express");
const {
  displayAll,
  createNewChain,
  addTXtoChain,
  deleteIt,
} = require("../Controllers/Blockchain.controllers");

function routes(app) {
  const router = express.Router();
  /**
   * Displaying all the blockchain structure
   */
  router.get("/blockchain", displayAll);

  router.post("/blockchain", createNewChain);

  router.post("/blockchain/add-transaction", addTXtoChain);

  router.delete("/blockchain", deleteIt);

  app.use("/", router);
}

module.exports = routes;
