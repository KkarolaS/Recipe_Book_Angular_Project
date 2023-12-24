import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'Schnitzel Mniam',
      'Put some food on a pan',
      'https://media.gettyimages.com/id/1081422898/photo/pan-fried-duck.jpg?s=612x612&w=0&k=20&c=kzlrX7KJivvufQx9mLd-gMiMHR6lC2cgX009k9XO6VA=',
      [new Ingredient('Meat', 1), new Ingredient('French Fries', 35)]
    ),
    new Recipe(
      'A dummy Burger',
      'Put whisky to the chocolate cream',
      'https://media.gettyimages.com/id/1081422898/photo/pan-fried-duck.jpg?s=612x612&w=0&k=20&c=kzlrX7KJivvufQx9mLd-gMiMHR6lC2cgX009k9XO6VA=',
      [new Ingredient('Beef Meat', 1), new Ingredient('Rools', 2)]
    ),
  ];

  constructor(private sLService: ShoppingListService) {}

  getRecipe() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.sLService.addIngredients(ingredients);
  }
}