import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOdontologoComponent } from './edit-odontologo.component';

describe('EditOdontologoComponent', () => {
  let component: EditOdontologoComponent;
  let fixture: ComponentFixture<EditOdontologoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOdontologoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOdontologoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
