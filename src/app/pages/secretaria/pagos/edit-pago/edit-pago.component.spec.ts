import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPagoComponent } from './edit-pago.component';

describe('EditPagoComponent', () => {
  let component: EditPagoComponent;
  let fixture: ComponentFixture<EditPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
