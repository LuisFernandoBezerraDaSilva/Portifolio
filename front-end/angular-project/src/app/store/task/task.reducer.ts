import { createReducer, on } from '@ngrx/store';
import { TaskState } from './task.state';
import * as TaskActions from './task.actions';

export const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  total: 0,
  page: 1,
  totalPages: 1,
  isLoading: false,
  error: null
};

export const taskReducer = createReducer(
  initialState,

  // Load Tasks
  on(TaskActions.loadTasks, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(TaskActions.loadTasksSuccess, (state, { response }) => ({
    ...state,
    tasks: response.tasks,
    total: response.total,
    page: response.page,
    totalPages: response.totalPages,
    isLoading: false,
    error: null
  })),

  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Create Task
  on(TaskActions.createTask, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(TaskActions.createTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [task, ...state.tasks],
    total: state.total + 1,
    isLoading: false,
    error: null
  })),

  on(TaskActions.createTaskFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Update Task
  on(TaskActions.updateTask, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(TaskActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t),
    isLoading: false,
    error: null
  })),

  on(TaskActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Delete Task
  on(TaskActions.deleteTask, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== id),
    total: state.total - 1,
    isLoading: false,
    error: null
  })),

  on(TaskActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // UI Actions
  on(TaskActions.setLoading, (state, { loading }) => ({
    ...state,
    isLoading: loading
  })),

  on(TaskActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);
