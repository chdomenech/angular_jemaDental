import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTratamientoComponent } from './new-tratamiento.component';

describe('NewTratamientoComponent', () => {
  let component: NewTratamientoComponent;
  let fixture: ComponentFixture<NewTratamientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTratamientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTratamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
