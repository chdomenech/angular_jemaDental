import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTratamientoComponent } from './view-tratamiento.component';

describe('ViewTratamientoComponent', () => {
  let component: ViewTratamientoComponent;
  let fixture: ComponentFixture<ViewTratamientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTratamientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTratamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
