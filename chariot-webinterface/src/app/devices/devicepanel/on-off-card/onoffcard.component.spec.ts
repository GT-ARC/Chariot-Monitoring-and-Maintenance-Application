import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnoffcardComponent } from './onoffcard.component';

describe('OnoffcardComponent', () => {
  let component: OnoffcardComponent;
  let fixture: ComponentFixture<OnoffcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnoffcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnoffcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
