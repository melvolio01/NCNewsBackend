const topicRouter = require('express').Router();
const { getAllTopics, getArticlesByTopic, addArticleByTopic } = require('../controllers/topics.js');

topicRouter.route('/')
    .get(getAllTopics)
topicRouter.route('/:topic_slug/articles')
    .get(getArticlesByTopic)
    // .post(addArticleByTopic)

module.exports = topicRouter;