import { Task } from '../../models/task.model';

export interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}
