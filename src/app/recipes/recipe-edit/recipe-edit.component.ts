import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {RecipeService} from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  recipeForm: FormGroup;
  editMode = false;
  id: number;

  constructor(private recipeService: RecipeService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        this.id = +params.id;
        this.editMode = params.id != null;
        this.initForm();
      });
  }

  private initForm() {
    let recipeName = '';
    let recipeImage = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);
    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImage = recipe.imagePath;
      recipeDescription = recipe.description;
      if (recipe.ingredients) {
        recipe.ingredients.forEach(ig => recipeIngredients.push(
          new FormGroup({
            'name': new FormControl(ig.name),
            'amount': new FormControl(ig.amount)
          })
        ))
      }
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName),
      'imagePath': new FormControl(recipeImage),
      'description': new FormControl(recipeDescription),
      'ingredients': recipeIngredients
    });
  }

  onSubmit() {
    console.log(this.recipeForm);
  }

  get controls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  onAddIngredient() {
    this.controls.push(new FormGroup({
      'name': new FormControl(),
      'amount': new FormControl()
    }))
  }
}
