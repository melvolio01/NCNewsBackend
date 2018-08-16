process.env.NODE_ENV = 'test';
const app = require('../app.js');
const request = require('supertest')(app);
const {expect} = require('chai');
const mongoose = require('mongoose');
const testData = require('../seed/testData/index.js');
const seedDB = require('../seed/seed.js');

describe('Northcoders_News API /api', () => {
    let articleDocs, commentDocs, topicDocs, userDocs, wrongID = mongoose.Types.ObjectId();
    beforeEach(() => {
        return seedDB(testData).then(docs => {
            [ userDocs, topicDocs, articleDocs, commentDocs] = docs;
        });
    });

    after(() => mongoose.disconnect());

    describe('/topics', () => {
        it('GET returns an appropriate list of topic objects', () => {
            return request.get(`/api/topics`)
            .expect(200)
            .then(res => {
                expect(res.body.topics.length).to.equal(2);
                expect(res.body.topics[0]).to.have.all.keys(
                    '_id',
                    'title',
                    'slug',
                    '__v'
                );
            });
        });
    });
    describe('/api/topics/:topic_slug/articles', () => {
        it('GET returns a list of articles corresponding to a given topic', () => {
            return request.get(`/api/topics/${topicDocs[0].slug}/articles`)
            .expect(200)
            .then(res => {
                expect(res.body.articles.length).to.equal(2);
                expect(res.body.articles[0]).to.have.all.keys(
                    '_id',
                    'title',
                    'belongs_to',
                    'votes',
                    'created_by',
                    'body',
                    'created_at',
                    '__v'
                )
                expect(res.body.articles[0].title).to.equal('Living in the shadow of a great man');
            });
        });
        // Have only done 404 tests here as even an 'incorrect' topic is still a string, so meets model requirements
        it('An Invalid "topic" string GET returns a status of 404 and an error message', () => {
            return request.get('/api/topics/blahblahblah/articles')
            .expect(404)
            .then(res => {
                expect(res.body.message).to.equal('No articles for that topic');
                expect(res.body.articles).to.equal(undefined);
            });
        });
        // it('POSTS a new article to topic route', () => {

        // });
    });

    describe('/api/articles', () => {
        it('GET returns a list of all articles', () => {
            return request.get('/api/articles')
            .expect(200)
            .then(res => {
                expect(res.body.articles.length).to.equal(4);
                expect(res.body.articles[0].body).to.equal('I find this existence challenging');
                expect(res.body.articles[1]).to.have.all.keys(
                    '_id',
                    'title',
                    'body',
                    'votes',
                    'created_at',
                    'belongs_to',
                    'created_by',
                    '__v'
                )
            });
        });  
    });
    describe('/api/articles/:article_id', () => {
        it('GET retrieves a specific article by article ID', () => {
            return request.get(`/api/articles/${articleDocs[0]._id}`)
            .expect(200)
            .then(res => {
                expect(res.body.article.belongs_to).to.equal('mitch');
                expect(res.body.article).to.have.all.keys(
                    '_id',
                    'title',
                    'votes',
                    'created_by',
                    'body',
                    'created_at',
                    'belongs_to',
                    '__v'
                );
            });
        });
        it('GET returns a 400 error and appropriate message for a bad request', () => {
            return request.get(`/api/articles/somethingaboutfootball`)
            .expect(400)
            .then(res => {
                expect(res.text).to.equal('Error, page not found');
            });
        });
        it('Returns a 404 error and appropriate message for a GET request with incorrect ID', () => {
            return request.get(`/api/articles/${wrongID}`)
            .expect(404)
            .then(res => {
                expect(res.text).to.equal('Error, no article with that ID exists');
            });
        })
    });
    describe.only('/api/articles/:article_id/comments', () => {
        it('GET retrieves comments for a specific article by article ID', () => {
            return request.get(`/api/articles/${articleDocs[0]._id}/comments`)
            .expect(200)
            .then(res => {
                expect(res.body.comments.length).to.equal(2);
                expect(res.body.comments[0]).to.have.all.keys(
                    '_id',
                    'body',
                    'belongs_to',
                    'created_by',
                    'created_at',
                    '__v',
                    'votes'
                );
                expect(res.body.comments[0].votes).to.equal(7);
            })
        });
        it('GET returns a 400 error and appropriate message for a bad GET comment request', () => {
            return request.get(`/api/articles/somethingaboutfootball/comments`)
            .expect(400)
            .then(res => {
                expect(res.text).to.equal('Error, page not found');
            });
        });
        it('Returns a 404 error and appropriate message for a comment GET request with incorrect ID', () => {
            return request.get(`/api/articles/${wrongID}/comments`)
            .expect(404)
            .then(res => {
                expect(res.text).to.equal('Error, no article with that ID exists');
            });
        })
    });
});

