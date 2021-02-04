
const express = require('express');

const morgan = require('morgan');  // we'll use morgan to log the HTTP layer


// we import the ShoppingList and Recipes model, which we'll
// interact with in our GET endpoint
const { ShoppingList, Recipes } = require('./models');

const app = express();

// log the http layer 
app.use(morgan('common'));
app.use(express.json());

// we're going to add some items to ShoppingList
// so there's some data to look at. Note that 
// normally you wouldn't do this. Usually your
// server will simply expose the state of the
// underlying database.
ShoppingList.create('beans', 2);
ShoppingList.create('tomatoes', 3);
ShoppingList.create('peppers', 4);

Recipes.create('Hot Cocoa', ['milk', 'vanilla', 'hot water', 'marshmallows']);
Recipes.create('Curry', ['goat milk', 'chili powder', 'cardamom', 'cloves']);
Recipes.create('pizza', ['dough', 'sauce', 'pepperoni', 'cheese', 'oil']);

// when the root of this route is called with GET, return
// all current ShoppingList items by calling `ShoppingList.get()`
app.get('/shopping-list', (req, res) => {
  res.json(ShoppingList.get());
});

app.post('/shopping-list', (req, res) => {

  if (!req.body.name || !req.body.budget) {
    res.status(400).send("please check your shopping item object");
    res.end();
  }

  const { name, budget } = req.body;


  ShoppingList.create(name, budget);
  res.status(201).send(`Successfully created ${name} shopping list item`);
  res.end();
})

//===========================================================================================//
//===========================================================================================//
//===========================================================================================//

app.post('/recipes', (req, res) => {

  if ((!req.body.name || !req.body.ingredients) || req.body.ingredients.length < 1) {
    res.status(400).send("please check your recipe object");
    res.end();
  }

  const { name, ingredients } = req.body;

  Recipes.create(name, ingredients);

  res.send(`Successfully created "${name}" recipe!`);
  res.end();
})


app.get('/recipes', (req, res) => {
  res.json(Recipes.get()); //using a custom method on the Recipes model
})


app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
