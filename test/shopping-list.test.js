//import testing libraries
const chai = require('chai');
const chaiHttp = require('chai-http');

//import the app to test, the runServer, and closeServer functions
const { app, runServer, closeServer } = require('../server');

const expect = chai.expect;//desctruct "expect" assertion for ease.

//This let's us make HTTP requests to our server during testing.
chai.use(chaiHttp);



//Let the testing suite begin...
//describe function and before and after hooks are all "mocha" syntax 
//*******************NOTE: DO NOT USE ARROW FUNCTIONS!!!!!!!!!!!!!!!!**************************
describe("Shopping List", function () {
    //Note about before and after mocha hooks. They don't seem to actually clean up the
    //volitile data in between individual tests. I'm not sure why.


    //ensures server is up and running `before` individual unit tests
    before(function () {
        return runServer();
    });

    //after each unit test, close the server so the next unit test doesn't have to work with mutated data.
    after(function () {
        console.log("AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
        return closeServer();
    });


    it('should list all items on GET', function () {
        return chai.request(app) //
            .get('/shopping-list')//make `GET` request
            .then(function (res) { //then when request is complete, we run this anon function and pass in the response we got back to pass various tests on it.
                //begin test assertions
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.be.at.least(1);

                //similar to the validation we have in the router.post handler when you wanna post except this time we are testing if simply retreiving the data gives us complete correct data. (testing the http layer remember)
                const expectedKeys = ['id', 'name', 'budget'];
                res.body.forEach(function (item) {
                    expect(item).to.be.an('object');
                    expect(item).to.include.keys(expectedKeys);
                });//end of forEach

            }) //end of .then
    });
    //------End of GET------------


    it('should add item on POST', function () {
        const newItem = { name: 'coffee', budget: 2 };//setup item to post
        const expectedKeys = ["name", "budget", "id"];//setup ek to rest response (not testing the req.body, the api already does that when we set it up)

        return chai.request(app)
            .post('/shopping-list')
            .send(newItem)
            .then(function (res) { //now we will assert against the returned response from the promise
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.include.keys(expectedKeys);
                expect(res.body.id).to.not.equal(null);
                //make a calculated clone with an id. newItem + res.body.id should deeply equal the response.body item that we got back.
                const itemCloneWithId = Object.assign(newItem, { id: res.body.id });
                expect(res.body).to.deep.equal(itemCloneWithId);
            });//end of .then

    });
    //------End of POST------------


    /* ********************NOTE*******************************
    For PUT and DELETE methods, attaching an EXISTING id is required in the url (query.params).
    HOWEVER, since we are using volatile memory, we have to do a get request first so that the server auto-creates some arbitrary items and then we can use those
    items and their randomly assigned "id" to execute a PUT or DELETE request. WE WILL CHANGE THIS WHEN WE USE REAL DATABASES
    */

    it('should update item on PUT', function () {
        const updateData = { name: 'black beans', budget: '100' };
        return chai.request(app)
            .get('/shopping-list') //first make GET request
            .then(function (res) {
                updateData.id = res.body[0].id; //from the response.body, take the first object's "id" to your updateData
                return chai.request(app) //now return a PUT request with the updateDate
                    .put(`/shopping-list/${updateData.id}`)
                    .send(updateData);
            })
            .then(function (res) { //now it's time to test the returned updated object to see if our changes persisted.
                expect(res).to.have.status(200)
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.deep.equal(updateData);
            });//end of .then for the PUT response `assertion`

    });
    //------End of PUT-------------

    it('should delete item on DELETE', function () {
        let lengthBeforeDelete;
        return chai.request(app)
            .get('/shopping-list')
            .then(function (res) {
                lengthBeforeDelete = res.body.length;
                console.log(lengthBeforeDelete);
                console.log(res.body);
                return chai.request(app)
                    .delete(`/shopping-list/${res.body[0].id}`);
            })
            .then(function (res) {
                expect(res).to.have.status(204);

                return chai.request(app)
                    .get('/shopping-list')
            })
            .then(function (res) { //check the get request returns a shorter array after deleting
                console.log(res.body.length);
                console.log(res.body);
                expect(res.body).length.to.be.lessThan(lengthBeforeDelete);
            });
    })



});
//------------------------End of describe SHOPPING-LIST





//Answer these questions:

//What do you need to import for testing?

//How do you extend the internals of chai and why would we need to do that in testing?

//Why do we use promises in testing?

/*
Q:Why do we need asynchonicity in testing?
A: http calls are indeterminate in their timing since they depend on factors such as
connection speed, client's machine, server machine efficieny, database, etc. We need a way
of executing code around their completion. That's where promises come in. We also need a way
of ensuring the tests only start after the server has run since we will be closing and opening
a connection in this module. This is unlike the normal server module where we want it to remain
open indefinitley and so there's a synchronous order to things in that module.
*/

//Do we have to import mocha?

//What are some things we want to assert for?