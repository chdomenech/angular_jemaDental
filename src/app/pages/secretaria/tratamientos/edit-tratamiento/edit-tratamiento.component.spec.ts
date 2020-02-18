import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTratamientoComponent } from './edit-tratamiento.component';

describe('EditTratamientoComponent', () => {
  let component: EditTratamientoComponent;
  let fixture: ComponentFixture<EditTratamientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTratamientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTratamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
