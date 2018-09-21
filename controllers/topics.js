const Topic = require('../models/index.js').Topic;
const Article = require('../models/index.js').Article;
const Comment = require('../models/index.js').Comment;
const { addCommentCount } = require('../utils')

const getAllTopics = (req, res, next) => {
    Topic.find()
        .then(topics => {
            res.status(200).send({ topics })
        });
}

const getArticlesByTopic = (req, res, next) => {
    let topic_slug = req.params;
    Article.find({ 'belongs_to': `${topic_slug.topic_slug}` })
        .populate("created_by")
        .then(articles => addCommentCount(articles, Comment))
        .then(articles => {
            if (articles.length > 0) res.status(200).send({ articles })
            else res.status(404).send({ message: 'No articles for that topic' });
        })
        .catch(next);
}

const addArticleByTopic = (req, res, next) => {
    let newArticle = req.body;

    let articleSlug = req.params.topic_slug;
    Article.create({
        belongs_to: articleSlug,
        title: newArticle.title,
        body: newArticle.body,
        created_by: newArticle.username
    })
        .then(article => {
            res.status(201).send({ article });
        })
        .catch(err => {
            next({ status: 400, message: 'The article is incomplete, please check all required fields have been completed.' });
        });
}


module.exports = { getAllTopics, getArticlesByTopic, addArticleByTopic };