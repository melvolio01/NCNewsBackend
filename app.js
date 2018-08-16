const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./router/api');
const DB_URL = require('./config/db-config.js').dbConfig[process.env.NODE_ENV].DB_URL;
const mongoose = require('mongoose');

// console.log(DB_URL);
// console.log(process.env.NODE_ENV);
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
app.use((err, req, res, next) => {
    if (err.status) res.status(err.status).send({message: err.message});
    else next(err);
});

module.exports = app;