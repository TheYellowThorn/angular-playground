import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { createNoise2D, NoiseFunction2D } from 'simplex-noise';
import { Quaternion, Vector3 } from 'three';
import { UnitPositions } from './core/abilities/unit-positions/unit-position';
import { IBattlePositionData, Team } from './core/entities/team';
import { Unit } from './core/entities/unit';
import { BattleService, TurnActionNames, TurnActions } from './services/battle/battle.service';

@Component({
  selector: 'app-hex-battle',
  templateUrl: './hex-battle.component.html',
  styleUrls: ['./hex-battle.component.scss']
})
export class HexBattleComponent implements AfterViewInit, OnInit {

  @ViewChild('canvas2d', {read: ElementRef, static: true}) public canvas2DRef: ElementRef | null = null;

  ITEMS_WIDE: number = 10;
  ROWS_HIGH: number = 16;

  rows: Hexagon[][] = [];
  turnActionNames: typeof TurnActionNames = TurnActionNames;
  unitPositions: typeof UnitPositions = UnitPositions;

  context: CanvasRenderingContext2D | null = null;
  SEED: number = Math.random();
  currentUnitRotation: number = -30;
  hexBeingPlacedUpon: HTMLElement | undefined;

  raisedCoordinates: { x: number, y: number, height: number }[] = [];

  constructor(public battleService: BattleService) { }

  async ngOnInit(): Promise<void> {

    let row: Hexagon[]
    for (let i = 0; i < this.ROWS_HIGH; i++) {
      row = [];
      this.rows.push(row);
      for (let j = 0; j < this.ITEMS_WIDE; j++) {
        row.push(new Hexagon(j, i));
      }
    }
    await this.addObjects();
  }

  async ngAfterViewInit() {

    const team1: Team = new Team();
    const team2: Team = new Team();
    const teams: Team[] = [team1, team2];

    for (let i = 0; i < teams.length; i++) {
      const team: Team = teams[i];
      team.initializeBattlePositions(this.ITEMS_WIDE, this.ROWS_HIGH);
    }
    this.battleService.initBattle(teams);
  }

  async addObjects(): Promise<void> {

    var canvas2d: HTMLCanvasElement = this.canvas2DRef?.nativeElement as HTMLCanvasElement;

    canvas2d.width = 40;
    canvas2d.height = 40;
    // Again, set dimensions to fit the screen.
    this.context = canvas2d.getContext('2d')!;
    this.context.imageSmoothingEnabled = false;
    const myImageData = this.context.createImageData(40, 40);

    const noise2D: NoiseFunction2D = createNoise2D(() => this.SEED); // noise2D returns between -1 and 1

    for(let i = -this.ITEMS_WIDE / 2; i <= this.ITEMS_WIDE / 2; i++) {
      for(let j = -this.ROWS_HIGH / 2; j <= this.ROWS_HIGH / 2; j++) {

        const offsetX: number = i + this.ITEMS_WIDE / 2;
        const offsetY: number = j + this.ROWS_HIGH / 2;
        
        let noise: number = (noise2D(i * 0.2, j * 0.2) + 1) * 0.5;
        noise = Math.pow(noise, 1.5);
        noise = Math.floor(noise * 10) / 10; // make terraces

        if (noise >= 0.7) { this.raisedCoordinates.push({ x: offsetX, y: offsetY, height: 2 }); }
        else if (noise >= 0.5) { this.raisedCoordinates.push({ x: offsetX, y: offsetY, height: 1 }); }
  
        let data: Uint8ClampedArray = myImageData.data;
        data[0] = noise * 255; // red
        data[1] = noise * 255; // green
        data[2] = noise * 255; // blue
        data[3] = 255; // alpha
        this.context.putImageData( myImageData, offsetX, offsetY ); 
      } 
    }
  }

  raisedHeight(x: number, y: number): number {
    const len: number = this.raisedCoordinates.length;
    for (let i = 0; i < len; i++) {
      const coord: {x: number, y: number, height: number} = this.raisedCoordinates[i];
      if (coord.x === x && coord.y === y) {
        return coord.height;
      }
    }
    return 0;
  }

  hexClicked(e: MouseEvent, x: number, y: number): void {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (this.battleService.currentTurnAction.ACTION_NAME === TurnActionNames.SPAWN_UNIT) {
      this.hexBeingPlacedUpon = e.currentTarget as HTMLElement;
      this.battleService.dispatch(new TurnActions.PLACE_UNIT(new Vector3(x, y, 0)));
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('click', this.onPositionUnit);
    }
    
  }

  getPlacementRotation(hexagon: HTMLElement): number | undefined {
    if (hexagon !== this.hexBeingPlacedUpon) {
      return undefined;
    }
    return this.currentUnitRotation;
  }

  onPositionUnit = (e: MouseEvent) => {
    document.removeEventListener('click', this.onPositionUnit);
    document.removeEventListener('mousemove', this.onMouseMove);
    this.battleService.dispatch(new TurnActions.POSITION_UNIT(this.battleService.unitBeingPlaced!.direction));
  }

  onMouseMove = (e: MouseEvent) => {
    const element: HTMLElement = this.hexBeingPlacedUpon as HTMLElement;
    const rect: DOMRect = element.getBoundingClientRect();
    const containerScale: number = 0.5;
    const halfWidth: number = containerScale * element.offsetWidth * 0.5;
    const halfHeight: number = containerScale * element.offsetHeight * 0.5;

    const vec: Vector3 = new Vector3(rect.x + halfWidth, rect.y + halfHeight, 0);
    const mousePos: Vector3 = new Vector3(e.clientX - vec.x, e.clientY - vec.y, 0);

    const v1: Vector3 = new Vector3(0, 1, 0);
    const v2: Vector3 = mousePos.normalize();
    const posNeg: number = v2.x > 0 ? -1 : 1;

    const angleFromDirection: number = posNeg * 180 * v1.angleTo(v2) / Math.PI;
    const clampEvery60: number = Math.floor((angleFromDirection) / 60) * 60 + 30;

    this.currentUnitRotation = clampEvery60;

    switch (clampEvery60) {
      case -30:
        this.battleService.unitBeingPlaced!.direction = UnitPositions.FRONT;
        break;
      case 30:
        this.battleService.unitBeingPlaced!.direction = UnitPositions.FRONT_RIGHT;
        break;
      case 90:
        this.battleService.unitBeingPlaced!.direction = UnitPositions.BACK_RIGHT;
        break;
      case 150:
        this.battleService.unitBeingPlaced!.direction = UnitPositions.BACK;
        break;
      case -150:
        this.battleService.unitBeingPlaced!.direction = UnitPositions.BACK_LEFT;
        break;
      case -90:
        this.battleService.unitBeingPlaced!.direction = UnitPositions.FRONT_LEFT;
        break;
      default:
        this.battleService.unitBeingPlaced!.direction = UnitPositions.FRONT;
        break;
    }
  }

  spawnUnit(e: MouseEvent): void {
    e.preventDefault();
    this.battleService.dispatch(new TurnActions.SPAWN_UNIT());
  }

  cancelSpawn(e: MouseEvent): void {
    document.removeEventListener('mousemove', this.onMouseMove);
    e.preventDefault();
    this.battleService.dispatch(new TurnActions.UNSET());
  }

  inPlacementMode(): boolean {
    return this.battleService.currentTurnAction.ACTION_NAME === TurnActionNames.SPAWN_UNIT;
    
  }
  inPositionMode(): boolean {
    return this.battleService.currentTurnAction.ACTION_NAME === TurnActionNames.ENABLE_POSITION_UNIT;
  }

  unitOnTile(x: number, y: number): boolean {

    const teams: Team[] = this.battleService.teams;
    for (let i = 0; i < teams.length; i++) {
      const team: Team = teams[i];
      const positionData: IBattlePositionData = team.getPositionDataAt(x, y);
      if (positionData.unit) {
        return true;
      }
    }

    const unitBeingPlaced: Unit | null = this.battleService.unitBeingPlaced;
    if (unitBeingPlaced && unitBeingPlaced.position.x === x && unitBeingPlaced.position.y === y) {
      return true;
    }
    if (!this.battleService.currentTeam || !this.battleService.currentTeam.units) {
      return false;
    }
    const unitsOnTile: Unit[] = this.battleService.currentTeam!.units.filter((unit: Unit) => {
      return unit.position.x === x && unit.position.y === y;
    });

    return unitsOnTile.length > 0;
  }
}

class Hexagon {

  x: number = 0;
  y: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  
}
