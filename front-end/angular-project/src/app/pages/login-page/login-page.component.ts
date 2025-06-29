import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BasePageComponent } from '../base-page/base-page.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { CommonModule } from '@angular/common';

import * as AuthActions from '../../store/auth/auth.actions';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import { AppState } from '../../store/app.state';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatSnackBarModule,
    SharedModule
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent extends BasePageComponent implements OnInit {
  username: string = '';
  password: string = '';

  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  isAuthenticated$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    super();
    this.isLoading$ = this.store.select(AuthSelectors.selectIsLoading);
    this.error$ = this.store.select(AuthSelectors.selectError);
    this.isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);
  }

  ngOnInit(): void {
    // Initialize auth state
    this.store.dispatch(AuthActions.initializeAuth());
    
    // Subscribe to login success specifically (not general auth state)
    const loginSuccessSubscription = this.store.select(state => state.auth).subscribe(authState => {
      // Only navigate if we just got authenticated (had loading before)
      if (authState.isAuthenticated && !authState.isLoading && !authState.error) {
        // Check if we came from a login attempt (not just page refresh)
        if (this.username || this.password) {
          this.router.navigate(['/tasks']);
          // Clear form after successful navigation
          this.username = '';
          this.password = '';
        }
      }
    });

    // Subscribe to errors
    const errorSubscription = this.error$.subscribe(error => {
      if (error) {
        this.snackBar.open(error, 'Close', { duration: 3000 });
      }
    });

    this.addSubscription(loginSuccessSubscription);
    this.addSubscription(errorSubscription);
  }

   login(form: any) {
    if (form.invalid) {
      this.snackBar.open('Please fill in all required fields!', 'Close', { duration: 3000 });
      form.controls.username?.markAsTouched();
      form.controls.password?.markAsTouched();
      return;
    }
    
    this.store.dispatch(AuthActions.login({ 
      credentials: { 
        username: this.username, 
        password: this.password 
      } 
    }));
  }

  createAccount(): void {
    console.log('Redirecting to account creation page');
    this.router.navigate(['/user']);
  }
}