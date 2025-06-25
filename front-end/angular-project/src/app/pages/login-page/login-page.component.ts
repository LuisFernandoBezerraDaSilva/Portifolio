import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { BasePageComponent } from '../base-page/base-page.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatSnackBarModule,
    SharedModule
  ],
  providers: [ 
    AuthService,
    StorageService
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent extends BasePageComponent {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    super();
  }

   login(form: any) {
    if (form.invalid) {
      this.snackBar.open('Please fill in all required fields!', 'Close', { duration: 3000 });
      form.controls.username?.control.markAsTouched();
      form.controls.password?.control.markAsTouched();
      return;
    }
    const loginSubscription = this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        this.storageService.setToken(response.token); 
        this.storageService.setUserId(response.userId); 
        this.router.navigate(['/tasks']); 
      },
      error: (err) => {
        console.error('Login failed', err);
        if (err.status === 401) {
          this.snackBar.open('Incorrect password!', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Error logging in!', 'Close', { duration: 3000 });
        }
      }
    });

    this.addSubscription(loginSubscription);
  }

  createAccount(): void {
    console.log('Redirecting to account creation page');
    this.router.navigate(['/user']);
  }
}