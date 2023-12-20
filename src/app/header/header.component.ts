import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Output() recipeIsShown = new EventEmitter<boolean>();

  collapsed = true;

  onShowRecipe(recipeShown: boolean) {
    this.recipeIsShown.emit(recipeShown);
  }

  onShowShoppingList(recipeShown: boolean) {
    this.recipeIsShown.emit(recipeShown);
  }
}
