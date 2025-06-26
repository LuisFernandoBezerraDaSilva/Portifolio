import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { environment } from '../environments/environment';

interface Task {
  id: string;
  title: string;
  description: string;
  userId: string;
}

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all tasks', () => {
    const mockTasks: Task[] = [
      { id: '1', title: 'Task 1', description: 'Description 1', userId: 'user1' },
      { id: '2', title: 'Task 2', description: 'Description 2', userId: 'user1' }
    ];

    service.getAllTasks().subscribe(tasks => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should create a new task', () => {
    const newTask = { title: 'New Task', description: 'New Description', userId: 'user1' };
    const mockResponse = { id: '3', ...newTask };

    service.createTask(newTask).subscribe(task => {
      expect(task).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(mockResponse);
  });

  it('should update a task', () => {
    const taskId = '1';
    const updatedTask = { title: 'Updated Task', description: 'Updated Description', userId: 'user1' };
    const mockResponse = { id: taskId, ...updatedTask };

    service.updateTask(taskId, updatedTask).subscribe(task => {
      expect(task).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${taskId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTask);
    req.flush(mockResponse);
  });

  it('should delete a task', () => {
    const taskId = '1';

    service.deleteTask(taskId).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle HTTP errors', () => {
    service.getAllTasks().subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
