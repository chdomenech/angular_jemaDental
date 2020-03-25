import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarEliminarOdontologoComponent } from './aprobar-eliminar.component';

describe('AprobarEliminarOdontologoComponent', () => {
  let component: AprobarEliminarOdontologoComponent;
  let fixture: ComponentFixture<AprobarEliminarOdontologoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprobarEliminarOdontologoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobarEliminarOdontologoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
