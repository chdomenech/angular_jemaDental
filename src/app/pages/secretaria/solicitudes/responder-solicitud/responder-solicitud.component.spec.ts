import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponderSolicitudComponent } from './responder-solicitud.component';

describe('ResponderSolicitudComponent', () => {
  let component: ResponderSolicitudComponent;
  let fixture: ComponentFixture<ResponderSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponderSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponderSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
