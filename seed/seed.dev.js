const seedDB = require('./seed');
const mongoose = require('mongoose');
// let DB_URL = 'mongodb://localhost:27017/northcoders_news';
const DB_URL = process.env.DB_URL || require('../config/db-config.js').dbConfig[process.env.NODE_ENV].DB_URL;
const data  = require('./devData/index.js')

// if (process.env === 'production') DB_URL = 'mongodb://andy:confpass1@ds123852.mlab.com:23852/northcoders_news_ah';

console.log('Seed dev page running');
mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${DB_URL}...`)
    return seedDB(data)
  })
  .then(() => mongoose.disconnect());
