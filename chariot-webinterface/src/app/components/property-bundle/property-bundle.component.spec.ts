import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyBundleComponent } from './property-bundle.component';

describe('PropertyBundleComponent', () => {
  let component: PropertyBundleComponent;
  let fixture: ComponentFixture<PropertyBundleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyBundleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyBundleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
