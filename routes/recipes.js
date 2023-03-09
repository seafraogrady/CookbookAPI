const express = require('express');

const {validateAuth0AccessToken} = require ('../middleware/auth0.middleware')
const { Recipe, ValidateRecipe } = require('../models/recipes');
const router = express.Router();
let recipes = [];

router.post('/', async (req, res) => {
    let result = ValidateRecipe(req.body)

    if (result.error) {
        res.status(400).json(result.error);
        return;
    }

    let recipe = new Recipe(req.body);
   
    try {
        recipe = await recipe.save();

        res
            .location(`${recipe._id }`)
            .status(201)
            .json(recipe)
    }
    catch (error) {
        res.status(500).send("database error" + error)
    }
});


router.get('/', async (req,res) => {
    const { recipeName} = req.query;

    let filter = {};
  
    if (recipeName) {
      filter.recipeName = { $regex: `${recipeName}`, $options: 'i'};
    }
    try {

        const recipes = await Recipe
        .find(filter)
        res.json(recipes);
    
    }  catch (error) {
        res.status(500).json('db error ' + error)
    
    }
  })
router.get('/:id', async (req,res) =>  {

    try {
        const recipe = await Recipe.findById(req.params.id);
        if (recipe) {
            res.json(recipe);
        }
        else {
            res.status(404).json('Not found');
        }
    }
    catch (error) {
        res.status(404).json('Not found ' + error);
    }
})



router.delete('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (recipe)
            res.status(204).send();
        else
            res.status(404).json(`Recipe with that ID ${req.params.id} was not found`)
    }
    catch (error) {
        res.status(404).json(`This id ${req.params.id} was not found` + error);
    }

})

router.put('/:id', async (req, res) => {
    let result = ValidateRecipe(req.body)

    if (result.error) {
      res.status(400).json(result.error);
      return;
    }
    
    
    try {
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body,{new:true});
        if (recipe) {
            res.json(recipe);
        }
        else {
          res.status(404).json("not found")
        }
            
    }
    catch (error) {
        res.status(404).json('Recipe with that ID was not found' + error);
    }

})



module.exports = router;