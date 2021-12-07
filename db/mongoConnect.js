const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://benor:Bh0546445437@cluster0.pabje.mongodb.net/test');
  console.log("mongo connect");
}