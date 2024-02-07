import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  collapsed = true;
  isAuthanticated: boolean;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      this.isAuthanticated = user ? true : false;
    });
  }

  onSaveData() {
    this.dataStorageService.storeRecipe();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }
}
