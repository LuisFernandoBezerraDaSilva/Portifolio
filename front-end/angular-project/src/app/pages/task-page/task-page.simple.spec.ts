import { TestBed } from '@angular/core/testing';
import { TaskPageComponent } from './task-page.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('TaskPageComponent Simple', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskPageComponent],
      providers: [
        provideMockStore({ initialState: { task: { tasks: [], isLoading: false, error: null } } })
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TaskPageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
