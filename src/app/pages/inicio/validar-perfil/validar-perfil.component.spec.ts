import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidarPerfilComponent } from './validar-perfil.component';

describe('ValidarPerfilComponent', () => {
  let component: ValidarPerfilComponent;
  let fixture: ComponentFixture<ValidarPerfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidarPerfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidarPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
