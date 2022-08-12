import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexMapComponent } from './hex-map.component';

describe('HexMapComponent', () => {
  let component: HexMapComponent;
  let fixture: ComponentFixture<HexMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HexMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HexMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
