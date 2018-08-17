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
        it('POSTS a new article to topic route', () => {
          const newArt = {
                "title": "We need to talk about Kevin",
                "body": "De Bruyne is bloody well injured again!",
                "username": "happyamy2016"
          }  
          return request.post('/api/topics/football/articles')
          .send(newArt)
          .expect(201)
          .then( res => {
              expect(res.body.article.title).to.equal('We need to talk about Kevin')
              expect(res.body.article).to.have.all.keys(
                "votes",
                "_id",
                "belongs_to",
                "title",
                "body",
                "created_by",
                "created_at",
                "__v"
              )
              expect(res.body.article.belongs_to).to.equal('football')
          });
        });
        it('POST returns a status 400 and error message when a required field is missing', () => {
            const weakArt = {
                "body": "Much ado about nothing at all",
                "username": "cooljmessy"
          } 
          return request.post('/api/topics/coding/articles')
          .send(weakArt)
          .expect(400)
          .then( res => {
              expect(res.text).to.equal('The article is incomplete, please check all required fields have been completed.')
          })
        })
    });


    //The article is incomplete, please check all required fields have been completed.'
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
    describe('/api/articles/:article_id/comments', () => {
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
        });

        it('Adds a new comment to an article following post request', () => {
            const newComment = {
                "body": "De Bruyne is bloody well injured again!",
                "created_by": `${userDocs[1]._id}`
            }
            return request.post(`/api/articles/${articleDocs[2]._id}/comments`)
            .send(newComment)
            .expect(201)
            .then( res => {
              expect(res.body.comment.body).to.equal('De Bruyne is bloody well injured again!')
              expect(res.body.comment).to.have.all.keys(
                "body",
                "votes",
                "belongs_to",
                "_id",
                "created_by",
                "created_at",
                "__v"
              )
          }); 
        });
        it.only('POST returns a status 400 and error message when a required field is missing', () => {
            const emptyComment = {
                "created_by": `${userDocs[1]._id}`
          } 
          return request.post(`/api/articles/${articleDocs[0]._id}/comments`)
          .send(emptyComment)
          .expect(400)
          .then( res => {
              expect(res.text).to.equal('The comment has missing fields, please check and complete.')
          })
        })
    });

    describe('/api/users/:username', () => {
        it('Returns a "user" object following a valid GET request', () => {
            return request.get(`api/users/${userDocs[0].username}`)
            return request.get('/api/users/dedekind561')
            .expect(200)
            .then(res => {
                expect(res.body.user.name).to.equal('mitch');
                expect(res.body.user).to.have.all.keys(
                    '_id',
                    'username',
                    'name',
                   'avatar_url',
                    '__v'
                );
            });
        });
        it('An Invalid "username" string GET returns a status of 404 and an error message', () => {
            return request.get('/api/users/cooljmessy')
            .expect(404)
            .then(res => {
                expect(res.text).to.equal('No user goes by that username');
            });
        });
    });
});

