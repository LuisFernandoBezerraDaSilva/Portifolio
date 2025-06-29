import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import { TaskService } from '../../services/task.service';
import * as TaskActions from './task.actions';

@Injectable()
export class TaskEffects {

  private actions$ = inject(Actions);
  private taskService = inject(TaskService);

  loadTasks$ = createEffect(() => 
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      switchMap(() =>
        this.taskService.getAllTasks().pipe(
          map((response: any) => {
            const tasksData = response.tasks ? response : { tasks: response, total: response.length, page: 1, totalPages: 1 };
            return TaskActions.loadTasksSuccess({ response: tasksData });
          }),
          catchError((error) => 
            of(TaskActions.loadTasksFailure({ error: error.message || 'Failed to load tasks' }))
          )
        )
      )
    )
  );

  createTask$ = createEffect(() => 
    this.actions$.pipe(
      ofType(TaskActions.createTask),
      switchMap(({ task }) =>
        this.taskService.createTask(task).pipe(
          map((createdTask) => TaskActions.createTaskSuccess({ task: createdTask })),
          catchError((error) => 
            of(TaskActions.createTaskFailure({ error: error.message || 'Failed to create task' }))
          )
        )
      )
    )
  );

  updateTask$ = createEffect(() => 
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      switchMap(({ id, task }) =>
        this.taskService.updateTask(id, task).pipe(
          map((updatedTask) => TaskActions.updateTaskSuccess({ task: updatedTask })),
          catchError((error) => 
            of(TaskActions.updateTaskFailure({ error: error.message || 'Failed to update task' }))
          )
        )
      )
    )
  );

  deleteTask$ = createEffect(() => 
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      switchMap(({ id }) =>
        this.taskService.deleteTask(id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id })),
          catchError((error) => 
            of(TaskActions.deleteTaskFailure({ error: error.message || 'Failed to delete task' }))
          )
        )
      )
    )
  );
}
