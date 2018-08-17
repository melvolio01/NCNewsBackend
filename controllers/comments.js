const Comment = require('../models/index.js').Comment;

const getAllComments = (req, res, next) => {
    Comment.find()
    .then(comments => {
        res.status(200).send({ comments })
    });
}

const removeCommentByCommentId = (req, res, next) => {
    let commentID = req.params.comment_id;
    Comment.findByIdAndRemove({_id: commentID})
    .then(comment => {
        res.status(201).send({comment, message: `comment deleted`})
    })
    .catch(err => {
        next({status:404, message: 'No comment found with that comment ID'});
    });
}

const updateCommentLikes = (req, res, next) => {
    const commentID = req.params;
    const thumbs = req.query.vote;
    let voteInc = 0;
    if (thumbs === 'up') voteInc = 1;
    else if (thumbs === 'down') voteInc = -1;
    if (voteInc !== 0) {
        Comment.findByIdAndUpdate(commentID.comment_id, {$inc :{ 'votes' : voteInc }}, {new : true })
        .then(comment => {
            res.status(201).send({comment})  
        }) 
        .catch((err) => {
            if(err) {
                res.send({status: 400, message: 'Error, invalid query'})
            }
        });
    }
    else res.status(400).send('Error, invalid query');
}

module.exports = { getAllComments, removeCommentByCommentId, updateCommentLikes };