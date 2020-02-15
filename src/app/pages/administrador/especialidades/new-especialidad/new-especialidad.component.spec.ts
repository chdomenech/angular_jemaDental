import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEspecialidadComponent } from './new-especialidad.component';

describe('NewEspecialidadComponent', () => {
  let component: NewEspecialidadComponent;
  let fixture: ComponentFixture<NewEspecialidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEspecialidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEspecialidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
