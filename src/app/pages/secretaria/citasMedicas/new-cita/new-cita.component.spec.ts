import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCitaComponent } from './new-cita.component';

describe('NewCitaComponent', () => {
  let component: NewCitaComponent;
  let fixture: ComponentFixture<NewCitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
