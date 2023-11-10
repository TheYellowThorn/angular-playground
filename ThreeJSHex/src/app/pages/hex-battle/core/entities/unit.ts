import { IEntity } from "./i-entity";
import { Ability } from "./../abilities/ability";
import { Vector3 } from "three";
import { UnitLocation, UnitLocations } from "../abilities/unit-location/unit-location";

export class Unit implements IEntity {
    public hitPoints: number = 100;
    public abilities: Ability[] = [];
    public position: Vector3 = new Vector3();
    public direction: UnitLocation = UnitLocations.FRONT;
}