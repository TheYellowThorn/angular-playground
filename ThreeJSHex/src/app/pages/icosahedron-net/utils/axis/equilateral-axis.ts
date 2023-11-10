import * as THREE from 'three';

export class EQUILATERAL_AXIS {
    static FULL_HEIGHT: number = 0.5 * Math.sqrt(3);
    static RIGHT: THREE.Vector3 = new THREE.Vector3(-0.5, this.FULL_HEIGHT, 0).normalize();
    static LEFT: THREE.Vector3 = new THREE.Vector3(0.5, this.FULL_HEIGHT, 0).normalize();
    static X_AXIS: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
    static Y_AXIS: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
    static Z_AXIS: THREE.Vector3 = new THREE.Vector3(0, 0, 1);

    static RIGHT_AXIS_SLOPE: number = this.RIGHT.y / this.RIGHT.x;
    static LEFT_AXIS_SLOPE: number = this.LEFT.y / this.LEFT.x;
    static X_AXIS_SLOPE: number = this.X_AXIS.y / this.X_AXIS.x;
    static RIGHT_NEGATIVE_INVERSE_SLOPE: number = -1 / this.RIGHT_AXIS_SLOPE;
    static LEFT_NEGATIVE_INVERSE_SLOPE: number = -1 / this.LEFT_AXIS_SLOPE;
}
