import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css',
})
export class ShoppingEditComponent {
  @ViewChild('nameInput', { static: true }) nameInput: ElementRef;
  @ViewChild('amountInput', { static: true }) amountInput: ElementRef;

  @Output() ingredientCreated = new EventEmitter<Ingredient>();

  newIngredientName = '';
  newIngredientAmount = 0;

  newIngredient = new Ingredient(
    this.newIngredientName,
    this.newIngredientAmount
  );

  onShoppingListAdd() {
    this.newIngredient.name = this.nameInput.nativeElement.value;
    this.newIngredient.amount = this.amountInput.nativeElement.value;

    this.ingredientCreated.emit(this.newIngredient);
  }
}
