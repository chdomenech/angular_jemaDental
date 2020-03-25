import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarEliminarComponent } from './aprobar-eliminar.component';

describe('AprobarEliminarComponent', () => {
  let component: AprobarEliminarComponent;
  let fixture: ComponentFixture<AprobarEliminarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprobarEliminarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobarEliminarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
