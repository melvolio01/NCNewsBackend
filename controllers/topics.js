const Topic = require('../models/index.js').Topic;
const Article = require('../models/index.js').Article;

const getAllTopics = (req, res, next) => {
    Topic.find()
    .then(topics => {
        res.status(200).send({ topics })
    });
}

const getArticlesByTopic = (req, res, next) => {
    let topic_slug = req.params;
    Article.find({ 'belongs_to' : `${topic_slug.topic_slug}` })
    .then(articles => {
        res.status(200).send({ articles })
    });
}

module.exports = { getAllTopics, getArticlesByTopic };