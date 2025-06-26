export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'A_FAZER' | 'EM_ANDAMENTO' | 'CONCLUIDO';
  userId: string;
}

export interface TaskCreateRequest {
  title: string;
  description: string;
  date?: string;
}

export interface TaskUpdateRequest {
  title: string;
  description: string;
  date?: string;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  totalPages: number;
}
