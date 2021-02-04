const express = require('express');
const router = express.Router();

const { ShoppingList } = require('../models');

// we're going to add some items to ShoppingList
// so there's some data to look at. Note that 
// normally you wouldn't do this. Usually your
// server will simply expose the state of the
// underlying database.
ShoppingList.create('beans', 2);
ShoppingList.create('tomatoes', 3);
ShoppingList.create('peppers', 4);


// when the root of this route is called with GET, return
// all current ShoppingList items by calling `ShoppingList.get()`
router.get('/', (req, res) => {
    res.json(ShoppingList.get());
});
//----------------------------------------------------------------END of GET---------------------------------------//



router.post('/', (req, res) => {

    const requiredFields = ["name", "budget"];
    for (let i = 0; i < requiredFields.length; i++) {
        if (!req.body[requiredFields[i]]) {
            const errorMsg = `missing field "${requiredFields[i]}" in shopping item object`;
            console.error(errorMsg);
            res.status(400).send(errorMsg);
            res.end();
        }
    }

    const { name, budget } = req.body;


    ShoppingList.create(name, budget);
    res.status(201).send(`Successfully created ${name} shopping list item`);
    res.end();
});
//----------------------------------------------------------------END of POST---------------------------------------//


router.put('/:id', (req, res) => {
    const requiredFields = ['name', 'budget', 'id'];
    for (let i = 0; i < requiredFields.length; i++) {
        if (!req.body[requiredFields[i]]) {
            const errorMsg = `Missing "${requiredFields[i]}" field in req.body`;
            res.status(400).send(errorMsg);
            res.end();
        };
    };

    const { name, budget, id } = req.body;
    const urlId = req.params.id;
    if (id !== urlId) {
        const errorMsg = `req.body.id does not match url id`;
        res.status(400).send(errorMsg);
        res.end();
    }

    ShoppingList.update({ name, budget, id });
    res.status(204).end();
});
//----------------------------------------------------------------END of PUT---------------------------------------//


router.delete('/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    ShoppingList.delete(id);
    res.status(204);
    res.end();
})
//----------------------------------------------------------------END of DELETE---------------------------------------//

module.exports = router;