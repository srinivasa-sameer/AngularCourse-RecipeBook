import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;

  private userSubscription: Subscription;

  constructor( private store: Store<fromApp.AppState>){}

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth')
    .pipe(
      map(authState => authState.user))
      .subscribe( user => {
      this.isAuthenticated = !user ? false : true;
    });
  }

  storeRecipes(){
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }

  fetchRecipes(){
    this.store.dispatch( new RecipeActions.FetchRecipes());
  }

  onLogout(){
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy(): void {
      this.userSubscription.unsubscribe();
  }
}
