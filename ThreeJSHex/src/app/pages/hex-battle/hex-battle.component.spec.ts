import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexBattleComponent } from './hex-battle.component';

describe('HexBattleComponent', () => {
  let component: HexBattleComponent;
  let fixture: ComponentFixture<HexBattleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HexBattleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HexBattleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
