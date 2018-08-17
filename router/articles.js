const articleRouter = require('express').Router();
const { getAllArticles, getArticleById, getArticleComments, addCommentToArticle } = require('../controllers/articles.js');

articleRouter.route('/')
    .get(getAllArticles);
articleRouter.route('/:article_id')
    .get(getArticleById)
articleRouter.route('/:article_id/comments')
    .get(getArticleComments)
    .post(addCommentToArticle)

module.exports = articleRouter;