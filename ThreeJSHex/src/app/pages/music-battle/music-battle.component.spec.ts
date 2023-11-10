import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicBattleComponent } from './music-battle.component';

describe('MusicBattleComponent', () => {
  let component: MusicBattleComponent;
  let fixture: ComponentFixture<MusicBattleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MusicBattleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicBattleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
