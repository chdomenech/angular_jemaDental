import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPagoComponent } from './editar-pago.component';

describe('EditarPagoComponent', () => {
  let component: EditarPagoComponent;
  let fixture: ComponentFixture<EditarPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
