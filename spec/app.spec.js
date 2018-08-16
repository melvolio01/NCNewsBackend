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
        it('An Invalid "topic" string GET returns a status of 404 and an error message', () => {
            return request.get('/api/topics/blahblahblah/articles')
            .expect(404)
            .then(res => {
                expect(res.body.msg).to.equal('No articles for that topic');
                expect(res.body.articles).to.equal(undefined);
            });
        });
    });
});


