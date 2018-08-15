const seedDB = require('./seed');
const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/northcoder_news';
const data  = require('./testData/index.js')

console.log('Seed dev page running');
mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${DB_URL}...`)
    return seedDB(data)
  })
  .then(() => mongoose.disconnect());
