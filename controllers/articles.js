const Article = require('../models/index.js').Article;
const Comment = require('../models/index.js').Comment;
const { addCommentCount } = require('../utils')

const getAllArticles = (req, res, next) => {
    Article.find()
        .lean()
        .populate("created_by")
        .then(articles => addCommentCount(articles, Comment))
        .then(articles => {
            res.status(200).send({ articles })
        });
}

const getArticleById = (req, res, next) => {
    Article.findOne({ _id: req.params.article_id })
        .populate("created_by")
        .then(article => {
            if (article.body !== null) {
                res.status(200).send({ article });
            }
        })
        .catch(err => {
            if (err) {
                if (err.name === 'CastError') {
                    next({ status: 400, message: 'Error, page not found' });
                } else {
                    next({ status: 404, message: 'Error, no article with that ID exists' });
                }
            }
        });
}

const getArticleComments = (req, res, next) => {
    let commentArticle;
    Article.findOne({ _id: req.params.article_id })
        .then(article => {
            commentArticle = article;
        });
    Comment.find({ belongs_to: req.params.article_id })
        .populate("created_by")
        .populate("belongs_to")
        .then(comments => {
            if (commentArticle.body !== null) {
                res.status(200).send({ comments });
            }
        })
        .catch(err => {
            if (err) {
                if (err.name === 'CastError') {
                    next({ status: 400, message: 'Error, page not found' });
                } else {
                    // next({ status : 404, message: 'Error, no article with that ID exists'});
                    res.send({})
                }
            }
        });
}

const updateArticleLikes = (req, res, next) => {
    const articleID = req.params;
    const thumbs = req.query.vote;
    let voteInc = 0;

    if (thumbs === 'up') voteInc = 1;
    else if (thumbs === 'down') voteInc = -1;
    if (voteInc !== 0) {
        Article.findByIdAndUpdate(articleID.article_id, { $inc: { 'votes': voteInc } }, { new: true })
            .then(article => {
                res.status(201).send({ article })
            })
            .catch((err) => {
                s
                res.send({ status: 400, message: 'Error, invalid query' })
            });
    }
    else res.status(400).send('Error, invalid query');
}

const addCommentToArticle = (req, res, next) => {
    let newComment = req.body;
    let commentArticle = req.params.article_id;
    Comment.create({
        body: newComment.body,
        belongs_to: commentArticle,
        created_by: newComment.created_by
    })
        .populate("created_by")
        .then(comment => {
            res.status(201).send({ comment });
        })
        .catch(err => {
            next({ status: 400, message: 'The comment has missing fields, please check and complete.' });
        });
}

module.exports = { getAllArticles, getArticleById, getArticleComments, addCommentToArticle, updateArticleLikes };