import { UnitLocation, UnitLocations } from "./unit-location/unit-location";

export class Ability {}

export class StoneSkin extends Ability {
    public location: UnitLocation = UnitLocations.FRONT;
}

export class Abilities {
    public static STONE_SKIN: Ability = StoneSkin;
}