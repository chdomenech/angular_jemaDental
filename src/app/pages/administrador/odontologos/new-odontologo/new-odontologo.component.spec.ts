import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOdontologoComponent } from './new-odontologo.component';

describe('NewOdontologoComponent', () => {
  let component: NewOdontologoComponent;
  let fixture: ComponentFixture<NewOdontologoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewOdontologoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOdontologoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
