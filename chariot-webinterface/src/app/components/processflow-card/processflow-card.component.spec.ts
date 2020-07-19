import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessflowCardComponent } from './processflow-card.component';

describe('ProcessflowCardComponent', () => {
  let component: ProcessflowCardComponent;
  let fixture: ComponentFixture<ProcessflowCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessflowCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessflowCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
