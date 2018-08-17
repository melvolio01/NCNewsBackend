const Comment = require('../models/index.js').Comment;

const getAllComments = (req, res, next) => {
    Comment.find()
    .then(comments => {
        res.status(200).send({ comments })
    });
}

const removeCommentByCommentId = (req, res, next) => {
    let commentID = req.params.comment_id;
    Comment.findByIdAndRemove({_id: req.params.comment_id})
    .then(comment => {
        res.status(201).send({comment, message: `comment deleted`})
    })
    .catch(err => {
        next({status:404, message: 'No comment found with that comment ID'});
    });
}

module.exports = { getAllComments, removeCommentByCommentId };