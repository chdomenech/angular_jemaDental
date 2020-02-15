import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEspecialidadComponent } from './edit-especialidad.component';

describe('EditEspecialidadComponent', () => {
  let component: EditEspecialidadComponent;
  let fixture: ComponentFixture<EditEspecialidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEspecialidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
