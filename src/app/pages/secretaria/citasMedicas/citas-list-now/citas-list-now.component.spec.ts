import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasListNowComponent } from './citas-list-now.component';

describe('CitasListNowComponent', () => {
  let component: CitasListNowComponent;
  let fixture: ComponentFixture<CitasListNowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitasListNowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitasListNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
