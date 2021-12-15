import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarImageModalComponent } from './car-image-modal.component';

describe('CarImageModalComponent', () => {
  let component: CarImageModalComponent;
  let fixture: ComponentFixture<CarImageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarImageModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
