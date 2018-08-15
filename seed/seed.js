const mongoose = require('mongoose');
const { User, Article, Comment, Topic } = require('../models/index.js');
const { formatUserData, formatTopicData, formatArticleData, formatCommentData } = require('../utils/index');
let formattedArticles = [];
const seedDB = ( {userData, topicData, articleData, commentData} ) => {
    // userData, topicData, 
    return mongoose.connection.dropDatabase()
    .then(() => {
        return Promise.all([
            User.insertMany(formatUserData(userData)),
            Topic.insertMany(formatTopicData(topicData)),
        ])
    })
    .then(([userDocs, topicDocs]) => {
        let formattedArticles = formatArticleData(articleData, userDocs, topicDocs);
        return Article.insertMany(formattedArticles);
    })
    .then((articleDocs) => {
        // console.log(articleDocs);
        let formattedComments = formatCommentData(commentData, articleDocs);
        console.log(formattedComments);
    })
}

module.exports = seedDB;