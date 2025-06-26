import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the loading spinner', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const spinner = compiled.querySelector('mat-progress-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should have the correct selector', () => {
    expect(component).toBeInstanceOf(LoadingComponent);
  });
});
