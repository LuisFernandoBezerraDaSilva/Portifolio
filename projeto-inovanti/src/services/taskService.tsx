import { BaseService } from "./baseService";
import { Task } from "../interfaces/task";

export class TaskService extends BaseService<Task> {
  constructor() {
    super("tasks");
  }

  async getAllTasks(): Promise<Task[]> {
    return this.getAll();
  }

  async getTask(id: string): Promise<Task> {
    return this.get(id);
  }

  async createTask(task: Task): Promise<Task> {
    return this.create(task);
  }

  async updateTask(id: string, task: Task): Promise<Task> {
    return this.update(id, task);
  }

  async deleteTask(id: string): Promise<void> {
    return this.delete(id);
  }
}