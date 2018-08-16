const Article = require('../models/index.js').Article;
const Comment = require('../models/index.js').Comment;

const getAllArticles = (req, res, next) => {
    Article.find()
    .then(articles => {
        res.status(200).send({ articles })
    });
}

const getArticleById = (req, res, next) => {
    Article.findOne({_id: req.params.article_id})
    .then(article => {
        if (article.body !== null) {
            res.status(200).send({ article });
        }       
    })
    .catch(err => {
        if (err) {
            if (err.name === 'CastError') {
                next({status : 400, message : 'Error, page not found'});
            } else {
                next({ status : 404, message: 'Error, no article with that ID exists'});
            }
        }       
    });
}

const getArticleComments = (req, res, next) => { 
    Comment.find({belongs_to: req.params.article_id})
    .then(comments => {
        res.status(200).send({ comments });
    })
}

module.exports = { getAllArticles, getArticleById, getArticleComments };