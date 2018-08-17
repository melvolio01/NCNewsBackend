const seedDB = require('./seed');
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL || require('../config/db-config.js').dbConfig[process.env.NODE_ENV].DB_URL;
const data  = require('./devData/index.js')

console.log('Seed page running');
mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${DB_URL}...`)
    return seedDB(data)
  })
  .then(() => mongoose.disconnect());
