
const { json } = require('body-parser');
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
//----------------------------------------------------------------END of GET---------------------------------------//



app.post('/shopping-list', (req, res) => {

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


app.put('/shopping-list/:id', (req, res) => {
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


app.delete('/shopping-list/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);
  ShoppingList.delete(id);
  res.status(204);
  res.end();
})
//----------------------------------------------------------------END of DELETE---------------------------------------//




//===========================================================================================//
//===========================================================================================//
//===========================================================================================//

app.get('/recipes', (req, res) => {
  res.json(Recipes.get()); //using a custom method on the Recipes model
});
//---------------------------END of GET------------------------------


app.post('/recipes', (req, res) => {
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
// app.post('/recipes', (req, res) => {

//   if ((!req.body.name || !req.body.ingredients) || req.body.ingredients.length < 1) {
//     res.status(400).send("please check your recipe object");
//     res.end();
//   }

//   const { name, ingredients } = req.body;

//   Recipes.create(name, ingredients);

//   res.send(`Successfully created "${name}" recipe!`);
//   res.end();
// });

app.delete('/recipes/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);
  Recipes.delete(id);
  res.status(204);
  res.end();
});
//---------------------------END of DELETE------------------------------



app.put('/recipes/:id', (req, res) => {
  //validate url id first:
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



app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
