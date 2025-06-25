import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http);
  }

  getAllTasks() {
    return this.getAll('tasks'); 
  }

  deleteTask(taskId: string) {
    return this.delete('tasks', taskId);
  }

  createTask(task: { title: string; description: string; userId: string }) {
    return this.create('tasks', task);
  }

  updateTask(taskId: string, task: { title: string; description: string; userId: string }) {
    return this.update('tasks', taskId, task);
  }
}