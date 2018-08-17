const commentRouter = require('express').Router();
const { getAllComments, removeCommentByCommentId } = require('../controllers/comments.js');

commentRouter.route('/')
    .get(getAllComments)

commentRouter.route('/:comment_id')
    .delete(removeCommentByCommentId)

module.exports = commentRouter;