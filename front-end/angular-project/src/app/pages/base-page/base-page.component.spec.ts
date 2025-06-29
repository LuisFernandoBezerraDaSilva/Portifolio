import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { BasePageComponent } from './base-page.component';

describe('BasePageComponent', () => {
  let component: BasePageComponent;
  let fixture: ComponentFixture<BasePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add subscription to subscriptions array', () => {
    const mockSubscription = new Subscription();
    (component as any).addSubscription(mockSubscription);
    
    expect((component as any).subscriptions).toContain(mockSubscription);
  });

  it('should unsubscribe all subscriptions on destroy', () => {
    const mockSubscription1 = new Subscription();
    const mockSubscription2 = new Subscription();
    
    spyOn(mockSubscription1, 'unsubscribe');
    spyOn(mockSubscription2, 'unsubscribe');
    
    (component as any).addSubscription(mockSubscription1);
    (component as any).addSubscription(mockSubscription2);
    
    component.ngOnDestroy();
    
    expect(mockSubscription1.unsubscribe).toHaveBeenCalled();
    expect(mockSubscription2.unsubscribe).toHaveBeenCalled();
  });
});
