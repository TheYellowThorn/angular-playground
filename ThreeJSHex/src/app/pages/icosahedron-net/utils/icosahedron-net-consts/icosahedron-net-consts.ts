import * as THREE from 'three';
import { EQUILATERAL_AXIS } from './../axis/equilateral-axis';

const SECTOR_0_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(-0.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(0.0, 0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(0.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)
];
const SECTOR_1_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(0.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(1.0, 0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(1.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)
];
const SECTOR_2_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(1.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(2.0, 0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(2.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)
];
const SECTOR_3_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(2.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(3.0, 0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(3.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)
];
const SECTOR_4_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(3.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(4.0, 0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(4.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)
];
const SECTOR_5_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(-1.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(-0.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(0.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)
];
const SECTOR_6_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(0.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(0.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(1.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)
];
const SECTOR_7_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(1.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(1.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(2.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)
];
const SECTOR_8_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(2.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(2.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(3.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)
];
const SECTOR_9_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(3.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(3.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(4.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)
];
const SECTOR_10_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(-0.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(0.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(0.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)      
];
const SECTOR_11_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(0.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(1.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(1.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)      
];
const SECTOR_12_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(1.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(2.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(2.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)      
];
const SECTOR_13_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(2.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(3.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(3.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)      
];
const SECTOR_14_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(3.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(4.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(4.5, -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)      
];
const SECTOR_15_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(-1.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(-0.5, -2.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(0.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)      
];
const SECTOR_16_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(0.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(0.5, -2.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(1.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)      
];
const SECTOR_17_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(1.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(1.5, -2.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(2.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)     
];
const SECTOR_18_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(2.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(2.5, -2.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(3.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)  
];
const SECTOR_19_BOUNDS: THREE.Vector3[] = [
    new THREE.Vector3(3.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(3.5, -2.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0),
    new THREE.Vector3(4.0, -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT, 0)     
];

enum BOUNDS {
    SECTOR_0_BOUNDS = 0,
    SECTOR_1_BOUNDS = 1,
    SECTOR_2_BOUNDS = 2,
    SECTOR_3_BOUNDS = 3,
    SECTOR_4_BOUNDS = 4,
    SECTOR_5_BOUNDS = 5,
    SECTOR_6_BOUNDS = 6,
    SECTOR_7_BOUNDS = 7,
    SECTOR_8_BOUNDS = 8,
    SECTOR_9_BOUNDS = 9,
    SECTOR_10_BOUNDS = 10,
    SECTOR_11_BOUNDS = 11,
    SECTOR_12_BOUNDS = 12,
    SECTOR_13_BOUNDS = 13,
    SECTOR_14_BOUNDS = 14,
    SECTOR_15_BOUNDS = 15,
    SECTOR_16_BOUNDS = 16,
    SECTOR_17_BOUNDS = 17,
    SECTOR_18_BOUNDS = 18,
    SECTOR_19_BOUNDS = 19
}



export class ICOSAHEDRON_NET_CONSTS {
    public static SECTOR_0_BOUNDS: THREE.Vector3[] = SECTOR_0_BOUNDS;
    public static SECTOR_1_BOUNDS: THREE.Vector3[] = SECTOR_1_BOUNDS;
    public static SECTOR_2_BOUNDS: THREE.Vector3[] = SECTOR_2_BOUNDS;
    public static SECTOR_3_BOUNDS: THREE.Vector3[] = SECTOR_3_BOUNDS;
    public static SECTOR_4_BOUNDS: THREE.Vector3[] = SECTOR_4_BOUNDS;
    public static SECTOR_5_BOUNDS: THREE.Vector3[] = SECTOR_5_BOUNDS;
    public static SECTOR_6_BOUNDS: THREE.Vector3[] = SECTOR_6_BOUNDS;
    public static SECTOR_7_BOUNDS: THREE.Vector3[] = SECTOR_7_BOUNDS;
    public static SECTOR_8_BOUNDS: THREE.Vector3[] = SECTOR_8_BOUNDS;
    public static SECTOR_9_BOUNDS: THREE.Vector3[] = SECTOR_9_BOUNDS;
    public static SECTOR_10_BOUNDS: THREE.Vector3[] = SECTOR_10_BOUNDS;
    public static SECTOR_11_BOUNDS: THREE.Vector3[] = SECTOR_11_BOUNDS;
    public static SECTOR_12_BOUNDS: THREE.Vector3[] = SECTOR_12_BOUNDS;
    public static SECTOR_13_BOUNDS: THREE.Vector3[] = SECTOR_13_BOUNDS;
    public static SECTOR_14_BOUNDS: THREE.Vector3[] = SECTOR_14_BOUNDS;
    public static SECTOR_15_BOUNDS: THREE.Vector3[] = SECTOR_15_BOUNDS;
    public static SECTOR_16_BOUNDS: THREE.Vector3[] = SECTOR_16_BOUNDS;
    public static SECTOR_17_BOUNDS: THREE.Vector3[] = SECTOR_17_BOUNDS;
    public static SECTOR_18_BOUNDS: THREE.Vector3[] = SECTOR_18_BOUNDS;
    public static SECTOR_19_BOUNDS: THREE.Vector3[] = SECTOR_19_BOUNDS;

    public static GET_BOUNDS_MIDPOINT(bounds: THREE.Vector3[]): THREE.Vector3 {
        const midpointX: number = (bounds[0].x + bounds[1].x + bounds[2].x) / 3;
        const midpointY: number = (bounds[0].y + bounds[1].y + bounds[2].y) / 3;
        const midpointZ: number = (bounds[0].z + bounds[1].z + bounds[2].z) / 3;
        return new THREE.Vector3(midpointX, midpointY, midpointZ);
    }

    public static GET_BOUNDS(sector: number): THREE.Vector3[] {
        switch (sector) {
            case 0:
                return this.SECTOR_0_BOUNDS; 
            case 1:
                return this.SECTOR_1_BOUNDS;   
            case 2:
                return this.SECTOR_2_BOUNDS;   
            case 3:
                return this.SECTOR_3_BOUNDS; 
            case 4:
                return this.SECTOR_4_BOUNDS;  
            case 5:
                return this.SECTOR_5_BOUNDS;    
            case 6:
                return this.SECTOR_6_BOUNDS;    
            case 7:
                return this.SECTOR_7_BOUNDS;     
            case 8:
                return this.SECTOR_8_BOUNDS;   
            case 9:
                return this.SECTOR_9_BOUNDS;   
            case 10:
                return this.SECTOR_10_BOUNDS;  
            case 11:
                return this.SECTOR_11_BOUNDS;   
            case 12:
                return this.SECTOR_12_BOUNDS;     
            case 13:
                return this.SECTOR_13_BOUNDS;    
            case 14:
                return this.SECTOR_14_BOUNDS;
            case 15:
                return this.SECTOR_15_BOUNDS;
            case 16:
                return this.SECTOR_16_BOUNDS;
            case 17:
                return this.SECTOR_17_BOUNDS;
            case 18:
                return this.SECTOR_18_BOUNDS;     
            default:
                return this.SECTOR_19_BOUNDS;
                
        }
    }
}
