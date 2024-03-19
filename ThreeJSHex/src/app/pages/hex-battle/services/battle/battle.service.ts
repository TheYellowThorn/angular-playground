import { Injectable } from '@angular/core';
import { Vector3 } from 'three';
import { IBattlePositionData, Team } from './../../core/entities/team';
import { Ability, Abilities } from '../../core/abilities/ability';
import { Subject } from 'rxjs';
import { Unit } from '../../core/entities/unit';
import { UnitPosition, UnitPositions } from '../../core/abilities/unit-positions/unit-position';

@Injectable({
  providedIn: 'root'
})
export class BattleService {

  public availableAbilities: Ability[] = [Abilities.STONE_SKIN];
  public allAbilities: any = this.getAllStaticProperties(Abilities);
  public allTurnActions: any = this.getAllStaticProperties(TurnActions);
  public turns: Turn[] = [];
  public teams: Team[] = [];
  
  private _unitBeingPlaced: Unit | null = null;
  public get unitBeingPlaced(): Unit | null {
    return this._unitBeingPlaced;
  }

  private _currentTeam: Team | undefined = undefined;
  public get currentTeam(): Team | undefined {
    return this._currentTeam;
  }
  private _currentTeamIndex: number = -1;
  public currentBattleCycle: BattleCycle = new BattleCycles.UNSET();
  public currentTurnAction: TurnAction = new TurnActions.UNSET();
  public logBattleActions: boolean = true;

  constructor(public battleDispatcherService: BattleDispatcherService) {
    this.battleDispatcherService.battleCycles.subscribe((battleCycle: BattleCycle) => {
      this.currentBattleCycle = battleCycle;
      this.logBattleAction(`${battleCycle.CYCLE_NAME}`);
      this.nextBattleCycle();
    });
    this.battleDispatcherService.turnActions.subscribe((turnAction: TurnAction) => {
      this.currentTurnAction = turnAction;
      // console.log(turnAction.payload);
      if (turnAction.payload) {
        this.logTurnAction(`\t\t${turnAction.ACTION_NAME}`, turnAction.payload);
        // console.log(`\t\t\t${turnAction.payload}`);
      } else {
        this.logTurnAction(`\t\t${turnAction.ACTION_NAME}`);
      }
      this.nextTurnCycle();
      // console.log('placed', this.currentTeam);
    });
  }

  public initBattle(teams: Team[]): void {
    this.teams = teams;
    this.battleDispatcherService.dispatch(new BattleCycles.INIT_BATTLE());
  }

  public getAllStaticProperties(cls: any): string[] {
    const lengthPrototypeAndName: string[] = Object.getOwnPropertyNames(class {});
    const staticProperties: string[] = Object.getOwnPropertyNames(cls).filter(k => !lengthPrototypeAndName.includes(k));
    return staticProperties;
  }

  public dispatch(action: BattleCycle | TurnAction): void {
    this.battleDispatcherService.dispatch(action);
  }

  public nextBattleCycle(): void {
    switch (this.currentBattleCycle.CYCLE_NAME) {
      case BattleCycleNames.INIT_BATTLE:
        this.battleDispatcherService.dispatch(new BattleCycles.CHANGE_TEAM());
        break;
      case BattleCycleNames.CHANGE_TEAM:
        this.setNextTeam();
        this.battleDispatcherService.dispatch(new BattleCycles.SELECT_ACTIONS());
        // this.nextTurn();
        // this.currentBattleCycle = new BattleCycles.SELECT_ACTIONS();
        // this.nextBattleCycle();
        break;
      case BattleCycleNames.SELECT_ACTIONS:
        break;
      case BattleCycleNames.ATTACK_AND_DEFEND:
        break;
      case BattleCycleNames.END_BATTLE:
        break;
    }
    
  }

  public nextTurnCycle(): void {
    const team: Team = this.currentTeam as Team;
    switch (this.currentTurnAction.ACTION_NAME) {
      case TurnActionNames.UNSET:
        this._unitBeingPlaced = null;
        break;
      case TurnActionNames.INIT_TURN:
        break;
      case TurnActionNames.SPAWN_UNIT:
        break;
      case TurnActionNames.PLACE_UNIT:
        const unit: Unit = new Unit();
        this._unitBeingPlaced = unit;
        unit.position = this.currentTurnAction.payload;
        this.battleDispatcherService.dispatch(new TurnActions.ENABLE_POSITION_UNIT());
        break;
      case TurnActionNames.POSITION_UNIT:
        const positionedUnit: Unit = this._unitBeingPlaced as Unit;
        team.units.push(positionedUnit);
        console.log(positionedUnit.position, this.currentTurnAction.payload);
        const positionData: IBattlePositionData = team.getPositionDataAt(positionedUnit.position.x, positionedUnit.position.y);
        positionData.unit = positionedUnit;
        console.log(team.battlePositions);
        this._unitBeingPlaced = null;
        
        //  console.log(team.getPositionDataAt(2, 1));
        this.battleDispatcherService.dispatch(new TurnActions.UNSET());
        break;
      case TurnActionNames.USE_ABILITY:
        break;
      case TurnActionNames.MOVE_UNIT:
        break;
      case TurnActionNames.END_TURN:
        break;
    }
  }

  public nextTurn(): void {
    // if (this._currentTeamIndex === -1) {
    //   this.setNextTeam();
    // }

    const turn: Turn = new Turn();
    this.turns.push(turn);
    turn.dispatch(new TurnActions.INIT_TURN(), this._currentTeam as Team);
  }
  public setNextTeam(): void {
    this._currentTeamIndex = (this._currentTeamIndex + 1) % this.teams.length;
    this._currentTeam = this.teams[this._currentTeamIndex];

    console.log(this.currentTeamName());
  }

  public currentTeamName() {
    return `\tTeam ${this._currentTeamIndex + 1}:`;
  }

  private logBattleAction(message: string, payload?: any): void {
    if (this.logBattleActions) {
      console.log('%c' + message, 'font-size: 14px; font-weight: bold; color: #000');
      // if (payload) {
        console.log(`%c${JSON.stringify(payload)}`, 'font-size: 14px; font-weight: bold; color: #000; padding-left: 50px;')
      //}
    }
  }
  private logTurnAction(message: string, payload: any = null): void {
    if (this.logBattleActions) {
      console.log('%c' + message, 'font-size: 12px; font-weight: bold; color: #099');
      if (payload) {
        console.log('%c\t\t\t[Payload]', 'font-size: 12px; font-weight: bold; color: #033');
        console.log('%c\t\t\t' + JSON.stringify(payload), 'font-size: 12px; font-weight: bold; color: #033');
      }
    }
  }
}

export abstract class AbstractTurnAction {
  abstract ACTION_NAME: string;
  abstract team: Team | undefined;
  abstract payload?: any;

  constructor(payload?: any) {
  }
}
export class TurnAction extends AbstractTurnAction {
  override ACTION_NAME = TurnActionNames.UNSET;
  public team: Team | undefined = undefined;
  public payload?: any;

  constructor(payload?: any) {
    super(payload);
    this.payload = payload;
  }
}
export class InitTurn extends TurnAction {
  override ACTION_NAME = TurnActionNames.INIT_TURN;
}
export class EndTurn extends TurnAction {
  override ACTION_NAME = TurnActionNames.END_TURN;
}
export class SpawnUnit extends TurnAction {
  override ACTION_NAME = TurnActionNames.SPAWN_UNIT;
}
export class PlaceUnit extends TurnAction {
  override ACTION_NAME = TurnActionNames.PLACE_UNIT;
  position: Vector3;

  constructor(vector3: Vector3) {
    super(vector3);
    if (!vector3) {
      throw Error('A vector3 is required for placing a unit.');
    }
    this.position = new Vector3(vector3.x, vector3.y, vector3.z);
  }
}
export class UseAbility extends TurnAction {
  override ACTION_NAME = TurnActionNames.USE_ABILITY;
}
export class MoveUnit extends TurnAction {
  override ACTION_NAME = TurnActionNames.MOVE_UNIT;
  from: Vector3 = new Vector3();
  to: Vector3 = new Vector3();
}
export class EnablePositionUnit extends TurnAction {
  override ACTION_NAME = TurnActionNames.ENABLE_POSITION_UNIT;
}
export class PositionUnit extends TurnAction {
  override ACTION_NAME = TurnActionNames.POSITION_UNIT;
  direction: UnitPosition = UnitPositions.UNSET;

  constructor(direction: UnitPosition) {
    super(direction);
    if (!direction) {
      throw Error('A direction is required for finalizing unit placement.');
    }
    this.direction = direction;
  }
}

export enum TurnActionNames {
  UNSET = '[Turn Action] Unset',
  INIT_TURN = '[Turn Action] Unset',
  END_TURN = '[Turn Action] End Turn',
  SPAWN_UNIT = '[Turn Action] Spawn Unit',
  PLACE_UNIT = '[Turn Action] Place Unit',
  ENABLE_POSITION_UNIT = '[Turn Action] Enable Position Unit',
  POSITION_UNIT = '[Turn Action] Position Unit',
  USE_ABILITY = '[Turn Action] Use Ability',
  MOVE_UNIT = '[Turn Action] Move Unit'
}
export class TurnActions {
  public static UNSET: typeof TurnAction = TurnAction;
  public static INIT_TURN: typeof TurnAction = InitTurn;
  public static END_TURN: typeof TurnAction = EndTurn;
  public static SPAWN_UNIT: typeof TurnAction = SpawnUnit;
  public static PLACE_UNIT: typeof TurnAction = PlaceUnit;
  public static ENABLE_POSITION_UNIT: typeof TurnAction = EnablePositionUnit;
  public static POSITION_UNIT: typeof TurnAction = PositionUnit;
  public static USE_ABILITY: typeof TurnAction = UseAbility;
  public static MOVE_UNIT: typeof TurnAction = MoveUnit;
}



export class Turn {

  actions: TurnAction[] = [];
  turnActions: Subject<TurnAction> = new Subject<TurnAction>();

  dispatch(turnAction: TurnAction, team: Team) {
    turnAction.team = team;
    this.actions.push(turnAction);
    this.turnActions.next(turnAction);

    console.log(`\t\tAction: ${turnAction.ACTION_NAME}`)
  }
}


export abstract class AbstractBattleCycle {
  abstract CYCLE_NAME: string;
}
export class BattleCycle extends AbstractBattleCycle {
  override CYCLE_NAME = BattleCycleNames.UNSET;
}
export class InitBattle extends BattleCycle {
  override CYCLE_NAME = BattleCycleNames.INIT_BATTLE;
}
export class ChangeTeam extends BattleCycle {
  override CYCLE_NAME = BattleCycleNames.CHANGE_TEAM;
}
export class SelectActions extends BattleCycle {
  override CYCLE_NAME = BattleCycleNames.SELECT_ACTIONS;
}
export class AttackAndDefend extends BattleCycle {
  override CYCLE_NAME = BattleCycleNames.ATTACK_AND_DEFEND;
}
export class EndBattle extends BattleCycle {
  override CYCLE_NAME = BattleCycleNames.END_BATTLE;
}

export enum BattleCycleNames {
  UNSET = '[Battle Cycle] Unset',
  INIT_BATTLE = '[Battle Cycle] Init Battle',
  CHANGE_TEAM = '[Battle Cycle] Change Team',
  SELECT_ACTIONS = '[Battle Cycle] Select Actions',
  ATTACK_AND_DEFEND ='[Battle Cycle] Attack and Defend',
  END_BATTLE = '[Battle Cycle] End Battle'
}

export class BattleCycles {
  public static UNSET: typeof BattleCycle = BattleCycle;
  public static INIT_BATTLE: typeof BattleCycle = InitBattle;
  public static CHANGE_TEAM: typeof BattleCycle = ChangeTeam;
  public static SELECT_ACTIONS: typeof BattleCycle = SelectActions;
  public static ATTACK_AND_DEFEND: typeof BattleCycle = AttackAndDefend;
  public static END_BATTLE: typeof BattleCycle = EndBattle;
}

@Injectable({
  providedIn: 'root'
})
export class BattleDispatcherService {
  public battleCycles: Subject<BattleCycle> = new Subject<BattleCycle>();
  public turnActions: Subject<TurnAction> = new Subject<TurnAction>();

  constructor() {
  }

  public dispatch(action: BattleCycle | TurnAction): void {
    if (action instanceof BattleCycle) {
      this.battleCycles.next(action);
    }
    if (action instanceof TurnAction) {
      this.turnActions.next(action);
    }
  }

}

