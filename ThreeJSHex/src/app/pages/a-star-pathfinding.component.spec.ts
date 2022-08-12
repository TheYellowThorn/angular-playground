import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AStarPathfindingComponent } from './a-star-pathfinding.component';

describe('AStarPathfindingComponent', () => {
  let component: AStarPathfindingComponent;
  let fixture: ComponentFixture<AStarPathfindingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AStarPathfindingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AStarPathfindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
