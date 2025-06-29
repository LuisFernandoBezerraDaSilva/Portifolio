import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TaskPageComponent } from './task-page.component';
import * as TaskActions from '../../store/task/task.actions';
import * as TaskSelectors from '../../store/task/task.selectors';
import { Task } from '../../models/task.model';

describe('TaskPageComponent', () => {
  let component: TaskPageComponent;
  let fixture: ComponentFixture<TaskPageComponent>;
  let router: jasmine.SpyObj<Router>;
  let store: MockStore;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const mockTasks: Task[] = [
    { id: '1', title: 'Task 1', description: 'Description 1', date: '2025-01-01', status: 'A_FAZER', userId: 'user1' },
    { id: '2', title: 'Task 2', description: 'Description 2', date: '2025-01-02', status: 'CONCLUIDO', userId: 'user1' }
  ];

  const initialState = {
    auth: {
      user: null,
      isAuthenticated: false,
      token: null,
      isLoading: false,
      error: null
    },
    task: {
      tasks: [],
      selectedTask: null,
      total: 0,
      page: 1,
      totalPages: 1,
      isLoading: false,
      error: null
    }
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [TaskPageComponent, BrowserAnimationsModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    })
    .compileComponents();

    store = TestBed.inject(Store) as MockStore;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    
    // Set up initial selectors
    store.overrideSelector(TaskSelectors.selectTasks, []);
    store.overrideSelector(TaskSelectors.selectTasksLoading, false);
    store.overrideSelector(TaskSelectors.selectTasksError, null);
    
    fixture = TestBed.createComponent(TaskPageComponent);
    component = fixture.componentInstance;
    
    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have NgRx observables defined', () => {
    expect(component.tasks$).toBeDefined();
    expect(component.isLoading$).toBeDefined();
    expect(component.error$).toBeDefined();
  });

  it('should dispatch loadTasks action on init', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(TaskActions.loadTasks());
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

  it('should dispatch deleteTask action when deleteTask is called', () => {
    component.deleteTask('1');
    expect(store.dispatch).toHaveBeenCalledWith(TaskActions.deleteTask({ id: '1' }));
  });
});
