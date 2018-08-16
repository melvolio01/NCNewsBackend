const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./router/api');
const DB_URL = require('./config/db-config.js').dbConfig[process.env.NODE_ENV].DB_URL;
const mongoose = require('mongoose');

mongoose.connect(DB_URL)
.then(() => {
    console.log(`Connected to ${DB_URL}`)
})
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use('/api', apiRouter);
app.use('/*', (req, res, next) => {
    res.status(404).send('Page not found');
});

app.use((err,req,res,next) => {
    res.status(err.status).send(err.message);
})

module.exports = app;