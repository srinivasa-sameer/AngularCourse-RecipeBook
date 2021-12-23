import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService{

  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //       new Recipe(
  //         'Paneer Fried Rice',
  //         'A very good Fried Rice with the flavour of Paneer',
  //         'https://hips.hearstapps.com/del.h-cdn.co/assets/17/31/2048x1024/landscape-1501791674-delish-chicken-curry-horizontal.jpg?resize=768:*',
  //         [
  //           new Ingredient('Paneer', 1),
  //           new Ingredient('Rice', 1),
  //           new Ingredient('Butter', 2),
  //           new Ingredient('Salt', 1)
  //         ]),
  //       new Recipe(
  //         'Pav Bhaji',
  //         'A very tasty snack',
  //         'https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Instant-Pot-Mumbai-Pav-Bhaji-Recipe.jpg',
  //         [
  //           new Ingredient('Pav', 4),
  //           new Ingredient('Lemon', 2),
  //           new Ingredient('Butter', 2)
  //         ])
  //     ];

  private recipes: Recipe[] = [];

      constructor(//private slService: ShoppingListService,
         private store:  Store<fromApp.AppState>){

      }

      setRecipes(recipes: Recipe[]){
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
      }

      getRecipes(){
        return this.recipes.slice();
      }

      getRecipe(index:number){
        return this.recipes[index];
      }

      addIngredientsToShoppingList(ingredients: Ingredient[]){
        //this.slService.addIngredients(ingredients);
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
      }

      addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
      }

      updateRecipe(index: number, newRecipe: Recipe){
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
      }

      deleteRecipe(index: number){
        this.recipes.splice(index,1);
        this.recipesChanged.next(this.recipes.slice());
      }
}
