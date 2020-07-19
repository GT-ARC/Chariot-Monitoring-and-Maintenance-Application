import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsBehindPlanComponent } from './products-behind-plan.component';

describe('ProductsBehindPlanComponent', () => {
  let component: ProductsBehindPlanComponent;
  let fixture: ComponentFixture<ProductsBehindPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsBehindPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsBehindPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
