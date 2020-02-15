import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegurosListComponent } from './seguros-list.component';

describe('SegurosListComponent', () => {
  let component: SegurosListComponent;
  let fixture: ComponentFixture<SegurosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegurosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegurosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
