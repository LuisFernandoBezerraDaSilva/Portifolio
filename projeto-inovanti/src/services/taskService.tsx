import { BaseService } from "./baseService";
import { Task } from "../interfaces/task";
import { TaskListResponse } from "../interfaces/taskListResponse";

export class TaskService extends BaseService<Task> {
  constructor() {
    super("tasks");
  }

  async getAllTasks(
    filter: string = "",
    status: string = "",
    page: number = 1,
    limit: number = 5
  ): Promise<TaskListResponse> {
    let query: string[] = [];
    if (filter && filter.trim() !== "") query.push(`filter=${encodeURIComponent(filter)}`);
    if (status && status.trim() !== "") query.push(`status=${encodeURIComponent(status)}`);
    if (page) query.push(`page=${page}`);
    if (limit) query.push(`limit=${limit}`);
    const queryString = query.length ? query.join("&") : "";
    return this.getAll(queryString);
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