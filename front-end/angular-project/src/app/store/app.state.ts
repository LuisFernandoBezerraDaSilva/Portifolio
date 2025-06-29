import { AuthState } from './auth/auth.state';
import { TaskState } from './task/task.state';

export interface AppState {
  auth: AuthState;
  task: TaskState;
}
