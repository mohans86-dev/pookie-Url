const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI); // getting the url form the config.env
  console.log(`MongoDB connected: ${conn.connection.host}`); // connecting with mongoDB
};

module.exports = connectDB;
