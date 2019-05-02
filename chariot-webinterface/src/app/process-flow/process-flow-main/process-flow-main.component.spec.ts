import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessFlowMainComponent } from './process-flow-main.component';

describe('ProcessFlowMainComponent', () => {
  let component: ProcessFlowMainComponent;
  let fixture: ComponentFixture<ProcessFlowMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessFlowMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessFlowMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
