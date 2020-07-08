import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessFlowComponent } from './process-flow.component';

describe('ProcessFlowComponent', () => {
  let component: ProcessFlowComponent;
  let fixture: ComponentFixture<ProcessFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
