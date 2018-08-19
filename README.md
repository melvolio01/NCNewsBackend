# Northcoder_News API project

A RESTful backend API for a news article site, in the style of Reddit. Built with Node.JS, Express for routing, and MongoDB/Mongoose for data and modelling. The site is hosted on Heroku, with data stored at mLabs. This API can be consumed via various endpoints (full list available at https://mighty-refuge-69006.herokuapp.com/api/). The API is fully searchable by topic, article, comments and users.

## Getting Started

This project is live (hosted on heroku at https://mighty-refuge-69006.herokuapp.com/api/) and can be accessed direct from that address. 

If you'd prefer to run the application locally, you'll need node.js and npm installed on your machine.
Information on node installation is available at https://nodejs.org/en/download/package-manager/ whilst for those who don't currently have npm, please see https://www.npmjs.com/ for more information on the node package manager, and instructions for installation.

For Mac users, who have node and npm installed, the project can be accessed via command line using the following commands: 

## Installing

git clone https://github.com/melvolio01/BE2-northcoders-news.git //clone a copy of the repo from github to your machine

npm install //to install all dependencies (a full list of these can be found in the package.json file), 

npm start // This will start your local server, and you should receive console messages stating that the 'app is listening on port 9090' and 'Connected to mongodb://localhost:27017/northcoders_news'

The development seed data can be re-run at any time using npm run seed:dev

## Testing 

npm test // this will run all current tests using the testData, available from the seed directory.

All tests take the form of mocha 'describe' and 'it' blocks with supertest 'request' testing. (example below)

        it('PUT should increment up article like total for ?vote=up query', () => {
            return(request.put(`/api/articles/${articleDocs[0]._id}?vote=up`))
            .expect(201)
            .then(res => {
                expect(res.body.article.votes).to.equal(1);
            });
         });
         
Seed data is re-run following each individual test, using Mocha's 'before each' method:

        describe('Northcoders_News API /api', () => {
            let articleDocs, commentDocs, topicDocs, userDocs, wrongID = mongoose.Types.ObjectId();
            beforeEach(() => {
                return seedDB(testData).then(docs => {
                [ userDocs, topicDocs, articleDocs, commentDocs] = docs;
            });
        });

Every endpoint has been tested, and a full list of endpoints can be found at https://mighty-refuge-69006.herokuapp.com/api/


## Built With

* Node (https://nodejs.org/en/download/package-manager/) - Server-side JavaScript
* Express (https://expressjs.com/en/api.html) - Node framework for routing
* MongoDB (https://docs.mongodb.com/) - NoSQL database
* Mongoose(https://mongoosejs.com/) - For data modelling
* Mocha (https://mochajs.org/), Chai (http://www.chaijs.com/), and Supertest        (https://www.npmjs.com/package/supertest) - For endpoint testing

* Heroku (https://dashboard.heroku.com/login) for hosting
* mLab (https://mlab.com/) for data-hosting

## Contributing

The Northcoders teaching team, and associated authors


## Authors

* **Andy Hunt** - *Git Hub* - [melvolio01](https://github.com/melvolio01)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thanks to all the Northcoders team for setting the project, and for their help and support along the way.