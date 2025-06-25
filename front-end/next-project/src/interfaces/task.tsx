import { TaskStatus } from "@/enums/taskStatus";

export interface Task {
  id?: string;
  title: string;
  description: string;
  userId?: string;
  date: string;
  status: TaskStatus;
}