export interface User {
  id: string;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  fcmToken?: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  userId: string;
  status: TaskStatus;
}

export enum TaskStatus {
  CONCLUIDO = 'CONCLUIDO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  A_FAZER = 'A_FAZER'
}

export interface TaskCreateRequest {
  title: string;
  description: string;
  date?: string;
}

export interface TaskUpdateRequest extends TaskCreateRequest {
  id: string;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  totalPages: number;
}
