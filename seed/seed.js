const mongoose = require('mongoose');
const { User, Article, Comment, Topic } = require('../models/index.js');
const { formatUserData, formatTopicData } = require('../utils/index');

const seedDB = ( {userData, topicData} ) => {
    return mongoose.connection.dropDatabase()
    .then(() => {
        return Promise.all([
            User.insertMany(formatUserData(userData)),
            Topic.insertMany(formatTopicData(topicData))
        ])

    })
    .then((userDocs, topicDocs) => {
        console.log(userDocs);
        console.log(topicDocs);
    })
}

module.exports = seedDB;