const articleRouter = require('express').Router();
const { getAllArticles, getArticleById, getArticleComments } = require('../controllers/articles.js');

articleRouter.route('/')
    .get(getAllArticles);
articleRouter.route('/:article_id')
    .get(getArticleById)
articleRouter.route('/:article_id/comments')
    .get(getArticleComments)

module.exports = articleRouter;