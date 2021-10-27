import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageURLPromptComponent } from './image-url-prompt.component';

describe('ImageURLPromptComponent', () => {
  let component: ImageURLPromptComponent;
  let fixture: ComponentFixture<ImageURLPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageURLPromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageURLPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
