const mongoose = require("mongoose");

// Mongoose Connection
async function connectMongoDb(url) {
  return mongoose
    .connect(url)
    .then(() => console.log("Mongo db connected"))
    .catch((err) => console.log("Mongo Error ", err));
}

module.exports = { connectMongoDb };
