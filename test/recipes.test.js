const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

chai.use(chaiHttp);


describe('Recipes', function () {
    before(function () {
        return runServer();
    });

    after(function () {
        return closeServer();
    });


    it('should list all recipe items on GET', function () {
        return chai.request(app)
            .get('/recipes')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.be.at.least(1);

                const expectedKeys = ["name", "ingredients", "id"];
                res.body.forEach(function (item) {
                    expect(item).to.be.an('object');
                    expect(item).to.include.keys(expectedKeys);
                });
            })
    });
    //--------End of Get-----------------


    it('should add item on POST', function () {
        const newItem = { name: "waffles", ingredients: ["batter", "water", "maple syrup"] };
        const expectedKeys = ["name", "ingredients", "id"];

        return chai.request(app)
            .post('/recipes')
            .send(newItem)
            .then(function (res) {
                expect(res).have.a.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.include.keys(expectedKeys);

                const itemClonedWithId = Object.assign(newItem, { id: res.body.id });
                expect(res.body).to.deep.equal(itemClonedWithId);
            });
    });
    //--------End of POST-------------------



    it('should update item on PUT', function () {

        const updateData = { name: "SUPER hot cocoa", ingredients: ["magic", "steam", "cocoa"] };
        return chai.request(app)
            .get('/recipes')
            .then(function (res) {
                updateData.id = res.body[0].id;
                return chai.request(app)
                    .put(`/recipes/${updateData.id}`)
                    .send(updateData);
            })
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.deep.equal(updateData);
            });

    });
    //------------End of PUT-----------------


    it('should delete item on DELETE', function () {


        let lengthBeforeDelete;
        return chai.request(app)
            .get('/recipes')
            .then(function (res) {
                lengthBeforeDelete = res.body.length;
                return chai.request(app)
                    .delete(`/recipes/${res.body[0].id}`);
            })
            .then(function (res) {
                expect(res).to.have.status(204);

                return chai.request(app)
                    .get('/shopping-list');
            })
            .then(function (res) {
                expect(res.body).length.to.be.lessThan(lengthBeforeDelete);
            });
    });
    //-------------End of DELETE ------------------------



});
//------------------------End of describe /RECIPES