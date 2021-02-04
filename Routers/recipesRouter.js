const express = require('express');
const router = express.Router();

const { Recipes } = require('../models');

Recipes.create('Hot Cocoa', ['milk', 'vanilla', 'hot water', 'marshmallows']);
Recipes.create('Curry', ['goat milk', 'chili powder', 'cardamom', 'cloves']);
Recipes.create('pizza', ['dough', 'sauce', 'pepperoni', 'cheese', 'oil']);




//===========================================================================================//
//===========================================================================================//
//===========================================================================================//

router.get('/', (req, res) => {
    res.json(Recipes.get()); //using a custom method on the Recipes model
});
//---------------------------END of GET------------------------------


router.post('/', (req, res) => {
    const requiredFields = ["name", "ingredients"];
    for (let i = 0; i < requiredFields.length; i++) {
        if (!req.body[requiredFields[i]]) {
            const errorMsg = `missing field "${requiredFields[i]}" in recipe object`;
            console.error(errorMsg);
            res.status(400).send(errorMsg);
            res.end();
        }
    }
    const { name, ingredients } = req.body;

    if (ingredients.length < 1) {
        const errorMsg = "please add ingredients to your recipe object";
        console.error(errorMsg);
        res.status(400).send(errorMsg);
        res.end();
    }

    const item = Recipes.create(name, ingredients);
    const successMsg = `Successfully created ${name} recipe!`;
    res.status(201).json({ successMsg, item });
    // res.status(201).json(item);   <-----this is the simple response of just returning the item created
    res.end();
});
//---------------------------END of POST------------------------------

//vvv same as other post, just simplified req.body validator vvv
// router.post('/', (req, res) => {

//   if ((!req.body.name || !req.body.ingredients) || req.body.ingredients.length < 1) {
//     res.status(400).send("please check your recipe object");
//     res.end();
//   }

//   const { name, ingredients } = req.body;

//   Recipes.create(name, ingredients);

//   res.send(`Successfully created "${name}" recipe!`);
//   res.end();
// });

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    Recipes.delete(id);
    res.status(204);
    res.end();
});
//---------------------------END of DELETE------------------------------



router.put('/:id', (req, res) => {
    //validate url id first (this actually doesn;t work because if they don't have anuything in the url, then this endpoint never gets hit):
    if (!req.params.id) {
        res.status(400).send('Missing item recipe id in the url. (Make sure it matches the item id)');
        res.end();
    }

    const requiredFields = ['name', 'ingredients', 'id']; // check for the req.body object's fields.
    for (let i = 0; i < requiredFields.length; i++) {
        if (!req.body[requiredFields[i]]) {
            const errorMsg = `Missing ${requiredFields[i]} field in req.body`;
            res.status(400).send(errorMsg);
            res.end();
        }
    }

    const { name, ingredients, id } = req.body; //looks like all fields are there, lets destruct
    const urlId = req.params.id;
    //now checking if url id matches body id
    if (urlId !== id) {
        const errorMsg = 'Your body id and url id do not match';
        res.status(400).send(errorMsg);
        res.end();
    };

    Recipes.update({ name, ingredients, id });

    res.status(204);
    res.end();

});
//---------------------------END of PUT------------------------------


module.exports = router;