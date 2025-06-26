import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskFormPageComponent } from './task-form-page.component';

describe('TaskFormPageComponent', () => {
  let component: TaskFormPageComponent;
  let fixture: ComponentFixture<TaskFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TaskFormPageComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
