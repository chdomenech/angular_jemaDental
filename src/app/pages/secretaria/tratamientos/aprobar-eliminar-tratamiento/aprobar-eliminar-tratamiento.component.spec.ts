import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarEliminarTratamientoComponent } from './aprobar-eliminar-tratamiento.component';

describe('AprobarEliminarTratamientoComponent', () => {
  let component: AprobarEliminarTratamientoComponent;
  let fixture: ComponentFixture<AprobarEliminarTratamientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprobarEliminarTratamientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobarEliminarTratamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
