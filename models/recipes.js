const { date, string } = require('joi');
const Joi = require('joi');
const mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({

    url:String
})

const ingredientSchema = new mongoose.Schema({

    ingredientList: String,
    nutrition: String,


})
const methodSchema = new mongoose.Schema({
    stepOne: String,
    stepTwo: String,
    stepThree: String
})

const recipeSchema = new mongoose.Schema({
    recipeName: String,
    serves: String,
   image:imageSchema,
    ingredients: ingredientSchema,
    method: methodSchema,
    cookTime: String,
    prepTime:String,
    mealType: String,
    createdBy: { type:mongoose.Schema.Types.ObjectId,
    ref: 'User'
}

})



function ValidateRecipe(recipe) {

    const imageSchema = Joi.object({
        url:Joi.string(),
    })
    const ingredientJoiSchema = Joi.object({
        ingredientList: Joi.string()
            .min(4)
            .max(240)
            .required(),
        nutrition: Joi.string()
    })

    const methodSchema = Joi.object({
        stepOne:Joi.string()
        .min(20)
        .required(),

        stepTwo:Joi.string(),
        stepThree:Joi.string()
    })
    const recipeJoiSchema = Joi.object({
   
         recipeName: Joi.string()
            .min(3)
            .max(40)
            .required(),
        serves: Joi.string(),
        
            ingredients: ingredientJoiSchema,
        method: methodSchema,
        prepTime: Joi.string(),
        cookTime: Joi.string(),
        mealType: Joi.string()
            .valid('dinner', 'Dinner', 'lunch', 'Lunch', 'Breakfast', 'breakfast')
            .required(),
            image:imageSchema,
    })
    return recipeJoiSchema.validate(recipe);
}
const Recipe = mongoose.model('recipe', recipeSchema);

module.exports = { Recipe, ValidateRecipe }