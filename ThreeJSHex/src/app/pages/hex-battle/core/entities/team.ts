import { IEntity } from "./i-entity";
import { Unit } from './unit';
import { Hero } from './hero';

export class Team implements IEntity {
    public units: Unit[] = [];
    public hero: Hero | undefined;
    public spawnsPerTurn: number = 3;
    public spawnsRemaining: number = 3;
    public battlePositions: IBattlePositionData[][] = [];

    public getPositionDataAt(x: number, y: number): IBattlePositionData {
        return this.battlePositions[y][x];
    }

    public initializeBattlePositions(numOfColumns: number, numOfRows: number): void {
        
        const rows: IBattlePositionData[][] = [];

        for (let j = 0; j < numOfRows; j++) {
            const row: IBattlePositionData[] = [];
            rows.push(row);

            for (let i = 0; i < numOfColumns; i++) {
                const battlePosition: IBattlePositionData = {
                    unit: undefined,
                    position: { x: i, y: j }
                };
                row.push(battlePosition);
            }
        }

        this.battlePositions = rows;
    }
}

export interface IBattlePositionData {
    unit: Unit | undefined;
    position: { x: number, y: number };
}


