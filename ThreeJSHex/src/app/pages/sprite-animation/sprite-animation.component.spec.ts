import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpriteAnimationComponent } from './sprite-animation.component';

describe('SpriteAnimationComponent', () => {
  let component: SpriteAnimationComponent;
  let fixture: ComponentFixture<SpriteAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpriteAnimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpriteAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
