import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPagoComponent } from './new-pago.component';

describe('NewPagoComponent', () => {
  let component: NewPagoComponent;
  let fixture: ComponentFixture<NewPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
