import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPacienteComponent } from './new-paciente.component';

describe('NewPacienteComponent', () => {
  let component: NewPacienteComponent;
  let fixture: ComponentFixture<NewPacienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPacienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
