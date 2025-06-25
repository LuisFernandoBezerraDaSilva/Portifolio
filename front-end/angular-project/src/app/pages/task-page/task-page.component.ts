import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from '../../shared.module';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { LoadingComponent } from '../../components/loading/loading.component';
import { DateBrPipe } from '../../pipes/date-pipe';

@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [
    CommonModule,
    DateBrPipe,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatSnackBarModule,
    MatTableModule,
    SharedModule,
    LoadingComponent
  ],
  providers: [TaskService],
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.scss']
})
export class TaskPageComponent implements OnInit {
  tasks: any[] = []; 
  displayedColumns: string[] = ['date', 'title', 'description', 'actions'];
  isLoading = true;

  constructor(
    private taskService: TaskService, 
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.isLoading = true; 
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.isLoading = false; 
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
        this.isLoading = false; 
      }
    });
  }

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.snackBar.open('Task deleted successfully!', 'Close', { duration: 3000 });
        this.fetchTasks();
      },
      error: (err) => {
        console.error('Error deleting task:', err);
        this.snackBar.open('Error deleting task!', 'Close', { duration: 3000 });
      }
    });
  }

  createNewTask(): void {
    this.router.navigate(['/task']); 
  }

  editTask(task: any): void {
    this.router.navigate(['/task'], {
      queryParams: {
        taskId: task.id,
        title: task.title,
        description: task.description,
        date: task.date
      }
    }); 
  }
}