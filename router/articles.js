const articleRouter = require('express').Router();
const { getAllArticles, getArticleById } = require('../controllers/articles.js');

articleRouter.route('/')
    .get(getAllArticles);
articleRouter.route('/:article_id')
    .get(getArticleById);

module.exports = articleRouter;