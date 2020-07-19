import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickableTextComponent } from './clickable-text.component';

describe('ClickableTextComponent', () => {
  let component: ClickableTextComponent;
  let fixture: ComponentFixture<ClickableTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClickableTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClickableTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
