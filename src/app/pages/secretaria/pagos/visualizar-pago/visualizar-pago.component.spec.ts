import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarPagoComponent } from './visualizar-pago.component';

describe('VisualizarPagoComponent', () => {
  let component: VisualizarPagoComponent;
  let fixture: ComponentFixture<VisualizarPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizarPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizarPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
