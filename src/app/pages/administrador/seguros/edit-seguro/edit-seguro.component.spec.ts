import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSeguroComponent } from './edit-seguro.component';

describe('EditSeguroComponent', () => {
  let component: EditSeguroComponent;
  let fixture: ComponentFixture<EditSeguroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSeguroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSeguroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
