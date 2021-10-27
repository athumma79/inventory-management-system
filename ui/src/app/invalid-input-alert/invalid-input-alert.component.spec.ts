import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidInputAlertComponent } from './invalid-input-alert.component';

describe('InvalidInputAlertComponent', () => {
  let component: InvalidInputAlertComponent;
  let fixture: ComponentFixture<InvalidInputAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvalidInputAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidInputAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
