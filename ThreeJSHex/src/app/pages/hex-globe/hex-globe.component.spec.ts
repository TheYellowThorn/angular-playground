import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexGlobeComponent } from './hex-globe.component';

describe('HexGlobeComponent', () => {
  let component: HexGlobeComponent;
  let fixture: ComponentFixture<HexGlobeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HexGlobeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HexGlobeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
