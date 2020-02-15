import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSeguroComponent } from './new-seguro.component';

describe('NewSeguroComponent', () => {
  let component: NewSeguroComponent;
  let fixture: ComponentFixture<NewSeguroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSeguroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSeguroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
