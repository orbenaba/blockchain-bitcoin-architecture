/**
 * Schmea for the current users
 */
const mongoose = require("mongoose");

const CurrentActiveSchema = new mongoose.Schema(
  {
    users: {
      //port numbers
      type: [Number],
      required: false,
      expires: 30, //1 minutes
    },
  },
  { timestamps: true }
);

CurrentActiveSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

CurrentActiveSchema.statics.getActives = async function () {
  try {
    const data = await CurrentActiveModel.findOne({});
    return data ? data.users : data;
  } catch (err) {
    console.error(err);
  }
};

CurrentActiveSchema.statics.addPort = async function (port) {
  try {
    let data = await CurrentActiveModel.findOne({});
    if (data === null) {
      const added = new CurrentActiveModel({ users: [port] });
      await added.save();
      return true;
    } else {
      await data.users.push(port);
      await data.save();
      return true;
    }
  } catch (err) {
    console.error(err);
  }
};

CurrentActiveSchema.statics.removePort = async function (port) {
  try {
    let data = await CurrentActiveModel.findOne({});
    if (data) {
      const index = data.users.indexOf(port);
      if (index !== -1) {
        await data.users.splice(index);
        await data.save();
        return true;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const CurrentActiveModel = mongoose.model(
  "CurrentActives",
  CurrentActiveSchema
);

module.exports = { CurrentActiveModel, CurrentActiveSchema };
