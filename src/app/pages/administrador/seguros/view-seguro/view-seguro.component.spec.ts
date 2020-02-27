import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSeguroComponent } from './view-seguro.component';

describe('ViewSeguroComponent', () => {
  let component: ViewSeguroComponent;
  let fixture: ComponentFixture<ViewSeguroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSeguroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSeguroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
