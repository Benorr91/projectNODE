const mongoose = require('mongoose');
const { config } = require('../config/secret');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDB}@cluster0.pabje.mongodb.net/test`);
  console.log("mongo connect");
}