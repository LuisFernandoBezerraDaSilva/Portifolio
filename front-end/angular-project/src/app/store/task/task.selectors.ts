import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TaskState } from './task.state';

export const selectTaskState = createFeatureSelector<TaskState>('task');

export const selectTasks = createSelector(
  selectTaskState,
  (state: TaskState) => state.tasks
);

export const selectSelectedTask = createSelector(
  selectTaskState,
  (state: TaskState) => state.selectedTask
);

export const selectTasksTotal = createSelector(
  selectTaskState,
  (state: TaskState) => state.total
);

export const selectTasksPage = createSelector(
  selectTaskState,
  (state: TaskState) => state.page
);

export const selectTasksTotalPages = createSelector(
  selectTaskState,
  (state: TaskState) => state.totalPages
);

export const selectTasksLoading = createSelector(
  selectTaskState,
  (state: TaskState) => state.isLoading
);

export const selectTasksError = createSelector(
  selectTaskState,
  (state: TaskState) => state.error
);

export const selectTaskById = (id: string) => createSelector(
  selectTasks,
  (tasks) => tasks.find(task => task.id === id)
);
