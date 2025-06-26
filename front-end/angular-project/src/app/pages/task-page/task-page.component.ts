import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from '../../shared.module';
import { Router } from '@angular/router';
import { LoadingComponent } from '../../components/loading/loading.component';
import { DateBrPipe } from '../../pipes/date-pipe';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BasePageComponent } from '../base-page/base-page.component';

import * as TaskActions from '../../store/task/task.actions';
import * as TaskSelectors from '../../store/task/task.selectors';
import { AppState } from '../../store/app.state';
import { Task } from '../../models/task.model';

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
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.scss']
})
export class TaskPageComponent extends BasePageComponent implements OnInit {
  dataSource = new MatTableDataSource<Task>([]);
  displayedColumns: string[] = ['date', 'title', 'description', 'actions'];

  tasks$: Observable<Task[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private store: Store<AppState>,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
    this.tasks$ = this.store.select(TaskSelectors.selectTasks);
    this.isLoading$ = this.store.select(TaskSelectors.selectTasksLoading);
    this.error$ = this.store.select(TaskSelectors.selectTasksError);
  }

  ngOnInit(): void {
    this.store.dispatch(TaskActions.loadTasks());
    
    // Subscribe to tasks
    const tasksSubscription = this.tasks$.subscribe(tasks => {
      this.dataSource.data = tasks;
    });

    // Subscribe to errors
    const errorSubscription = this.error$.subscribe(error => {
      if (error) {
        this.snackBar.open(`Error: ${error}`, 'Close', { duration: 3000 });
      }
    });

    this.addSubscription(tasksSubscription);
    this.addSubscription(errorSubscription);
  }

  deleteTask(taskId: string): void {
    this.store.dispatch(TaskActions.deleteTask({ id: taskId }));
  }

  createNewTask(): void {
    this.router.navigate(['/task']); 
  }

  editTask(task: Task): void {
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