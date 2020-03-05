import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NegarSolicitudComponent } from './negar-solicitud.component';

describe('NegarSolicitudComponent', () => {
  let component: NegarSolicitudComponent;
  let fixture: ComponentFixture<NegarSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NegarSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
