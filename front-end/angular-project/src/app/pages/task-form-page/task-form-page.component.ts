import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskService } from '../../services/task.service';
import { BasePageComponent } from '../base-page/base-page.component';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-task-form-page',
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
  providers: [TaskService],
  templateUrl: './task-form-page.component.html',
  styleUrls: ['./task-form-page.component.scss']
})
export class TaskFormPageComponent extends BasePageComponent implements OnInit {
  title: string = '';
  description: string = '';
  date: string = '';
  taskId: string | null = null;

  constructor(
    private taskService: TaskService,
    private storageService: StorageService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.taskId = params['taskId'] || null;
      this.title = params['title'] || '';
      this.description = params['description'] || '';
      this.date = params['date'] || '';
    });
  }

  saveTask(form?: any): void {
    if (form && form.invalid) {
      this.snackBar.open('Please fill in all required fields!', 'Close', { duration: 3000 });
      form.controls.title?.control.markAsTouched();
      form.controls.description?.control.markAsTouched();
      form.controls.date?.control.markAsTouched();
      return;
    }
    const userId = this.storageService.getUserId();
    if (!userId) {
      this.snackBar.open('Error: User not authenticated!', 'Close', { duration: 3000 });
      return;
    }

    const taskPayload = {
      title: this.title,
      description: this.description,
      userId: userId,
      date: this.date
    };

    if (this.taskId) {
      this.taskService.updateTask(this.taskId, taskPayload).subscribe({
        next: (response: any) => {
          this.snackBar.open('Task updated successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/tasks']);
        },
        error: (err: any) => {
          this.snackBar.open('Error updating task!', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.taskService.createTask(taskPayload).subscribe({
        next: (response: any) => {
          this.snackBar.open('Task created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/tasks']);
        },
        error: (err: any) => {
          this.snackBar.open('Error creating task!', 'Close', { duration: 3000 });
        }
      });
    }
  }
}