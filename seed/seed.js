const mongoose = require('mongoose');
const { User, Article, Comment, Topic } = require('../models/index.js');
const { formatUserData, formatTopicData, formatArticleData, formatCommentData } = require('../utils/index');
const seedDB = ( {userData, topicData, articleData, commentData} ) => {

    return mongoose.connection.dropDatabase()
    .then(() => {
        return Promise.all([
            User.insertMany(formatUserData(userData)),
            Topic.insertMany(formatTopicData(topicData)),
        ])
    })
    .then(([userDocs, topicDocs]) => {
       
        let formattedArticles = formatArticleData(articleData, userDocs, topicDocs);
        return Promise.all([
            userDocs, topicDocs, Article.insertMany(formattedArticles)
        ]);    
    })
    .then(([userDocs, topicDocs, articleDocs]) => {
        let formattedComments = formatCommentData(commentData, articleDocs);
        return Promise.all([
            userDocs, topicDocs, articleDocs, Comment.insertMany(formattedComments)
        ]);  
    })
}

module.exports = seedDB;