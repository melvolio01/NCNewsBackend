const commentRouter = require('express').Router();
const { getAllComments, removeCommentByCommentId, updateCommentLikes } = require('../controllers/comments.js');

commentRouter.route('/')
    .get(getAllComments)

commentRouter.route('/:comment_id')
    .delete(removeCommentByCommentId)
    .put(updateCommentLikes)

module.exports = commentRouter;