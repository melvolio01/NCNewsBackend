const apiRouter = require('express').Router();
const express = require('express');
const app = express();
const articleRouter = require('./articles');
const commentRouter = require('./comments');
const topicRouter = require('./topics');
const userRouter = require('./users');
const getHomePage = require('../controllers/api');


app.use('/', express.static('public'));
apiRouter.use('/articles', articleRouter);
// apiRouter.use('/comments', commentRouter);
apiRouter.use('/topics', topicRouter);
// apiRouter.use('/users', userRouter);

module.exports = apiRouter;