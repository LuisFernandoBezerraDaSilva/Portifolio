import { Component } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-user-form-page',
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
  providers: [ 
      UserService,
      StorageService
  ],
  templateUrl: './user-form-page.component.html',
  styleUrls: ['./user-form-page.component.scss']
})
export class UserFormPageComponent extends BasePageComponent {
  username: string = '';
  password: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    super();
  }

   createUser(form: any): void {
    if (form.invalid) {
      this.snackBar.open('Please fill in all required fields!', 'Close', { duration: 3000 });
      form.controls.username?.control.markAsTouched();
      form.controls.password?.control.markAsTouched();
      return;
    }
    this.userService.createUser({ username: this.username, password: this.password }).subscribe({
      next: (response: any) => {
        this.snackBar.open('Account successfully created!', 'Close', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.snackBar.open(err.error.error, 'Close', { duration: 3000 });
      }
    });
  }
}