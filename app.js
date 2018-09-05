const express = require('express')
const app = express();
let DB_URL;
const bodyParser = require('body-parser');
const apiRouter = require('./router/api');
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors())

if (process.env.MONGO_URI) {
    DB_URL = process.env.MONGO_URI;
} else  DB_URL = require('./config/db-config.js').dbConfig[process.env.NODE_ENV].DB_URL;

mongoose.connect(DB_URL,{ useNewUrlParser: true })
.then(() => {
    console.log(`Connected to ${DB_URL}`)
})
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use('/api',express.static('public'));

app.use('/api', apiRouter);
app.use('/*', (req, res, next) => {
    res.status(404).send('Page not found');
});

app.use((err,req,res,next) => {
    res.status(err.status).send(err.message);
})

module.exports = app;