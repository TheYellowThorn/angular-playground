import { Injectable } from '@angular/core';
import { EQUILATERAL_AXIS } from './../../axis/equilateral-axis';
import { ICOSAHEDRON_NET_CONSTS } from './../../icosahedron-net-consts/icosahedron-net-consts';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class IcosahedronUtilsService {

  public icosahedronNetCenterPoint: THREE.Vector3 = new THREE.Vector3(-0.25, -Math.sqrt(3) / 2, 0.0);
  public sectorArea: number = this.getArea(new THREE.Vector3(-0.5, 0, 0), new THREE.Vector3(0.0, EQUILATERAL_AXIS.FULL_HEIGHT, 0), new THREE.Vector3(0.5, 0, 0));

  constructor() { }

  getMinDistanceToSectorLine(point: THREE.Vector3, axis: THREE.Vector3 = EQUILATERAL_AXIS.LEFT, axisXOffset: number = 0, axisYOffset: number = 0): number {

    if (axis.equals(EQUILATERAL_AXIS.X_AXIS)) {
      return Math.abs(point.y + axisYOffset);
    }
    
    const intersectionPoint: THREE.Vector2 = this.getPerpendicularIntersectionPoint(point, axis, axisXOffset, axisYOffset);
    // console.log('intersects:', intersectionPoint, EQUILATERAL_AXIS.X_AXIS);
    const distance: number = Math.sqrt( Math.pow(intersectionPoint.x - point.x, 2) + Math.pow(intersectionPoint.y - point.y, 2));
    
    return distance;
  }

  // y = mx + b 
  // axis line equation is -Math.sqrt(3) / 2 = axisSlope * -0.25 + axisB
  // negInverseSlope * x + b = axisSlope * x + axisB
  getPerpendicularIntersectionPoint(point: THREE.Vector3, axis: THREE.Vector3 = EQUILATERAL_AXIS.LEFT, axisXOffset: number = 0, axisYOffset: number = 0): THREE.Vector2 {
    
    const axisSlope = axis.y / axis.x;
    const axisB: number = axisYOffset - axisSlope * axisXOffset; // -Math.sqrt(3) / 2;
    
    const negInverseSlope: number = -1 / axisSlope;
    const b = point.y - negInverseSlope * point.x;
    const xIntersectionPoint: number = (b - axisB) / (axisSlope - negInverseSlope);
    const yIntersectionPoint: number = xIntersectionPoint * negInverseSlope + b;

    return new THREE.Vector2(xIntersectionPoint, yIntersectionPoint);
  }

  // // y = mx + b 
  // // axis line equation is -Math.sqrt(3) / 2 = axisSlope * -0.25 + axisB
  // // negInverseSlope * x + b = axisSlope * x + axisB
  // getPerpendicularIntersectionPoint(point: THREE.Vector3, axis: THREE.Vector3 = EQUILATERAL_AXIS.LEFT): THREE.Vector2 {
    
  //   const axisSlope = axis.y / axis.x;
  //   const axisB: number = this.icosahedronNetCenterPoint.y - axisSlope * this.icosahedronNetCenterPoint.x; // -Math.sqrt(3) / 2;

  //   console.log(axisSlope, axisB);
    
  //   const negInverseSlope: number = -1 / axisSlope;
  //   const b = point.y - negInverseSlope * point.x;
  //   const xIntersectionPoint: number = (b - axisB) / (axisSlope - negInverseSlope);
  //   const yIntersectionPoint: number = xIntersectionPoint * negInverseSlope + b;

  //   return new THREE.Vector2(xIntersectionPoint, yIntersectionPoint);
  // }

  // x direction -1 = left, 0 = same, 1 = right
  // y direction -1 = down, 0 = same, 1 = up
  // getDirectionFromAxis(point: THREE.Vector3, axis: THREE.Vector3 = EQUILATERAL_AXIS.LEFT): THREE.Vector2 {
    
  //   const directionVector: THREE.Vector2 = new THREE.Vector2();
  //   const intersectionPoint: THREE.Vector2 = this.getPerpendicularIntersectionPoint(point, axis);
  //   if (point.x < intersectionPoint.x) {
  //     directionVector.x = -1;
  //   } else {
  //     directionVector.x = point.x > intersectionPoint.x ? 1 : 0;
  //   }

  //   if (point.y < intersectionPoint.y) {
  //     directionVector.y = -1;
  //   } else {
  //     directionVector.y = point.y > intersectionPoint.y ? 1 : 0;
  //   }

  //   return directionVector;
  // }
  // SECTORS: 0 - 19
  // -----------------------------------
  //      /\    /\    /\    /\    /\
  //     /  \  /  \  /  \  /  \  /  \
  //    /_00_\/_01_\/_02_\/_03_\/_04_\
  //   /\    /\    /\    /\    /\    /
  //  /  \10/  \11/  \12/  \13/  \14/
  // /_05_\/_06_\/_07_\/_08_\/_09_\/
  // \    /\    /\    /\    /\    /
  //  \15/  \16/  \17/  \18/  \19/
  //   \/    \/    \/    \/    \/
  // -----------------------------------

  getArea(point1: THREE.Vector3, point2: THREE.Vector3, point3: THREE.Vector3) {
    return Math.abs(( point1.x * (point2.y - point3.y) + point2.x * (point3.y - point1.y) + point3.x * (point1.y - point2.y)) / 2);
  }

  isInTriangle(point: THREE.Vector3, sectorBounds: THREE.Vector3[]): boolean {
    const sectorPoint1: THREE.Vector3 = sectorBounds[0];
    const sectorPoint2: THREE.Vector3 = sectorBounds[1];
    const sectorPoint3: THREE.Vector3 = sectorBounds[2];

    let area = this.getArea(sectorPoint1, sectorPoint2, sectorPoint3);
    let areaA = this.getArea(sectorPoint1, sectorPoint2, point);
    let areaB = this.getArea(point, sectorPoint2, sectorPoint3);
    let areaC = this.getArea(sectorPoint1, point, sectorPoint3);
    return Math.abs(areaA + areaB + areaC - area) < 0.001;
  }

  getSectorFromPoint(point: THREE.Vector3): number[] {

    const sectors: number[] = [];

    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_0_BOUNDS)) {
      sectors.push(0);
    }
    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_1_BOUNDS)) {
      sectors.push(1);
    }
    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_2_BOUNDS)) {
      sectors.push(2);
    }
    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_3_BOUNDS)) {
      sectors.push(3);
    }
    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_4_BOUNDS)) {
      sectors.push(4);
    }

    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_5_BOUNDS)) {
      sectors.push(5);
    }
    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_6_BOUNDS)) {
      sectors.push(6);
    }
    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_7_BOUNDS)) {
      sectors.push(7);
    }
    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_8_BOUNDS)) {
      sectors.push(8);
    }
    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_9_BOUNDS)) {
      sectors.push(9);
    }

    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_10_BOUNDS)) {
      sectors.push(10);
    }
    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_11_BOUNDS)) {
      sectors.push(11);
    }
    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_12_BOUNDS)) {
      sectors.push(12);
    }
    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_13_BOUNDS)) {
      sectors.push(13);
    }
    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_14_BOUNDS)) {
      sectors.push(14);
    }

    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_15_BOUNDS)) {
      sectors.push(15);
    }
    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_16_BOUNDS)) {
      sectors.push(16);
    }
    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_17_BOUNDS)) {
      sectors.push(17);
    }
    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_18_BOUNDS)) {
      sectors.push(18);
    }
    if (this.isInTriangle(point, ICOSAHEDRON_NET_CONSTS.SECTOR_19_BOUNDS)) {
      sectors.push(19);
    }


    return sectors;
  }

  pointIsOutOfBounds(point: THREE.Vector3): boolean {
    return this.getSectorFromPoint(point).length === 0;
  }

  pointsFallInTheSameSector(point1Sectors: number[], point2Sectors: number[], point3Sectors: number[]): boolean {
    return point1Sectors.length === 1 && 
      point2Sectors.length === 1 && 
      point3Sectors.length === 1 && 
      point1Sectors[0] === point2Sectors[0] &&
      point2Sectors[0] === point3Sectors[0];
  }

  allPointsInSectors(points: THREE.Vector3[], sectorNumbers: number[]): boolean {
    let inSectorCount: number = 0;
    const requiredCount: number = points.length * sectorNumbers.length;
    for (let i = 0; i < points.length; i++) {
      const point: THREE.Vector3 = points[i];
      for (let j = 0; j < sectorNumbers.length; j++) {
        const sectorNumber: number = sectorNumbers[j];
        let sectorBounds: THREE.Vector3[] = ICOSAHEDRON_NET_CONSTS.GET_BOUNDS(sectorNumber);
        if (this.isInTriangle(point, sectorBounds)) {
          inSectorCount++;
        }
      }
    }
    return requiredCount === inSectorCount;
  }

  interpolatePointsTowardEquilateralCenter(point: THREE.Vector3, strength: number = 1.0): THREE.Vector3 { // strength between 0.0 and 1.0
    const sector: number = this.getSectorFromPoint(point)[0];
    const bounds: THREE.Vector3[] = ICOSAHEDRON_NET_CONSTS.GET_BOUNDS(sector);
    const midpoint: THREE.Vector3 = ICOSAHEDRON_NET_CONSTS.GET_BOUNDS_MIDPOINT(bounds);
    const midpointDistanceToCorner: number = midpoint.distanceTo(bounds[0]);
    const distanceToMidpoint: number = midpoint.distanceTo(point);
    // console.log(midpointDistanceToCorner - distanceToMidpoint);

    // let minDist: number = midpointDistanceToCorner;
    // if (point.equals(midpoint)) {
      // const midDistFromEdge1: number = this.getMinDistanceToSectorLine(point, bounds[0]);
      // const midDistFromEdge2: number = this.getMinDistanceToSectorLine(point, bounds[1]);
      // const midDistFromEdge3: number = this.getMinDistanceToSectorLine(point, bounds[2]);
      // // console.log(midDistFromEdge1, midDistFromEdge2, midDistFromEdge3);
      // minDist = Math.min( Math.min(midDistFromEdge1, midDistFromEdge2), midDistFromEdge3 );
    // }
    // if ((point.x - bounds[0].x) > 1) {
    //   console.log(point.x - bounds[0].x);
    // }
    // if ((point.y - bounds[0].y) > 1) {
    //   console.log(point.y - bounds[0].y);
    // }
    let minDist: number = midpointDistanceToCorner;
    const pointCopy: THREE.Vector3 = new THREE.Vector3().copy(point);
    pointCopy.x -= bounds[0].x;
    pointCopy.y -= bounds[0].y;
    

    const bounds0: THREE.Vector3 = new THREE.Vector3().copy(bounds[0]);
    const bounds1: THREE.Vector3 = new THREE.Vector3().copy(bounds[1]);
    const bounds2: THREE.Vector3 = new THREE.Vector3().copy(bounds[2]);

    const leftSideAxis: THREE.Vector3 = new THREE.Vector3().copy(bounds1).sub(new THREE.Vector3().copy(bounds0));
    const rightSideAxis: THREE.Vector3 = new THREE.Vector3().copy(bounds2).sub(new THREE.Vector3().copy(bounds1));
    const xAxis: THREE.Vector3 = new THREE.Vector3().copy(bounds2).sub(new THREE.Vector3().copy(bounds0))
    
    const midDistFromEdge1: number = this.getMinDistanceToSectorLine(pointCopy, leftSideAxis);
    const midDistFromEdge2: number = this.getMinDistanceToSectorLine(pointCopy, rightSideAxis, 1.0);
    const midDistFromEdge3: number = this.getMinDistanceToSectorLine(pointCopy, xAxis, 1.0, 0.0);
    minDist = Math.min( Math.min(midDistFromEdge1, midDistFromEdge2), midDistFromEdge3 );
    // if (minDist >= EQUILATERAL_AXIS.FULL_HEIGHT / 2 - 0.05) {
    if (midpoint.equals(point)) {
      console.log(minDist, Math.sqrt(3) / 6);
    }
     
    // }

    
    // console.log(leftSideAxis);

    // if (sector === 0 && pointCopy.y > 0) {
      
    // }
    

    
    // const midDistFromEdge2: number = this.getMinDistanceToSectorLine(pointCopy, bounds2);
    // const midDistFromEdge3: number = this.getMinDistanceToSectorLine(pointCopy, bounds2);
    // console.log(midDistFromEdge1, midDistFromEdge2, midDistFromEdge3);
    // minDist = Math.min( Math.min(midDistFromEdge1, midDistFromEdge2), midDistFromEdge3 );

    return point;
  }



}
