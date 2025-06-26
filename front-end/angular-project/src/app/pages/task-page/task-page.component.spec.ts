import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { TaskPageComponent } from './task-page.component';
import { TaskService } from '../../services/task.service';

describe('TaskPageComponent', () => {
  let component: TaskPageComponent;
  let fixture: ComponentFixture<TaskPageComponent>;
  let router: jasmine.SpyObj<Router>;
  let taskService: jasmine.SpyObj<TaskService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const mockTasks = [
    { id: '1', title: 'Task 1', description: 'Description 1', date: '2025-01-01' },
    { id: '2', title: 'Task 2', description: 'Description 2', date: '2025-01-02' }
  ];

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const taskServiceSpy = jasmine.createSpyObj('TaskService', ['getAllTasks', 'deleteTask']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [TaskPageComponent, BrowserAnimationsModule, HttpClientTestingModule]
    })
    .overrideProvider(TaskService, { useValue: taskServiceSpy })
    .overrideProvider(Router, { useValue: routerSpy })
    .overrideProvider(MatSnackBar, { useValue: snackBarSpy })
    .compileComponents();

    fixture = TestBed.createComponent(TaskPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.dataSource.data).toEqual([]);
    expect(component.displayedColumns).toEqual(['date', 'title', 'description', 'actions']);
    expect(component.isLoading).toBe(true);
  });

  it('should have empty dataSource initially', () => {
    expect(component.dataSource.data.length).toBe(0);
  });

  it('should have correct component properties', () => {
    expect(component.displayedColumns).toBeDefined();
    expect(component.dataSource).toBeDefined();
    expect(component.isLoading).toBeDefined();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should navigate to create new task', () => {
    component.createNewTask();
    expect(router.navigate).toHaveBeenCalledWith(['/task']);
  });

  it('should navigate to edit task with query params', () => {
    const task = mockTasks[0];
    
    component.editTask(task);

    expect(router.navigate).toHaveBeenCalledWith(['/task'], {
      queryParams: {
        taskId: task.id,
        title: task.title,
        description: task.description,
        date: task.date
      }
    });
  });

  it('should fetch tasks on init', () => {
    taskService.getAllTasks.and.returnValue(of(mockTasks));
    
    component.ngOnInit();

    expect(taskService.getAllTasks).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockTasks);
    expect(component.isLoading).toBe(false);
  });

  it('should handle error when fetching tasks', () => {
    taskService.getAllTasks.and.returnValue(throwError(() => new Error('Server error')));
    
    component.ngOnInit();

    expect(component.isLoading).toBe(false);
    expect(component.dataSource.data).toEqual([]);
  });

  it('should delete task successfully', fakeAsync(() => {
    taskService.deleteTask.and.returnValue(of(void 0));
    taskService.getAllTasks.and.returnValue(of(mockTasks));
    
    component.deleteTask('1');
    tick(); // Wait for async operations to complete
    flush(); // Ensure all async operations are completed

    expect(taskService.deleteTask).toHaveBeenCalledWith('1');
    expect(snackBar.open).toHaveBeenCalledWith('Task deleted successfully!', 'Close', { duration: 3000 });
    expect(taskService.getAllTasks).toHaveBeenCalled();
  }));

  it('should handle error when deleting task', fakeAsync(() => {
    taskService.deleteTask.and.returnValue(throwError(() => new Error('Delete error')));
    
    component.deleteTask('1');
    tick(); // Wait for async operations to complete

    expect(snackBar.open).toHaveBeenCalledWith('Error deleting task!', 'Close', { duration: 3000 });
  }));
});
