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
    
    const axisSlope = this.getSlopeOfAxis(axis);
    const axisB: number = axisYOffset - axisSlope * axisXOffset; // -Math.sqrt(3) / 2;
    
    const negInverseSlope: number = -1 / axisSlope;
    const b = point.y - negInverseSlope * point.x;
    const xIntersectionPoint: number = (b - axisB) / (axisSlope - negInverseSlope);
    const yIntersectionPoint: number = xIntersectionPoint * negInverseSlope + b;

    return new THREE.Vector2(xIntersectionPoint, yIntersectionPoint);
  }

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

  // SECTORS (VALID): 0 - 19
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

  // SECTORS (SEMIVALID): 0 - 19 and out of bounds sectors 0L - 5L, 5L2, 5UL, 15L - 19L, 15L2, 0UL, 0U, 0UR, 15BL, 15B, 15BR
  // L = Left, UL = Upper Left, U = Up, UR = Upper Right, BL = Bottom Left, B = Bottom, BR = Bottom Right
  // -----------------------------------
  //             ____
  //           /\    /\
  //          /  \0U/  \
  //         /0UL_\/0UR_\ ____  ____  ____
  //        /\    /\    /\    /\    /\    /\
  //       /  \0L/  \1L/  \2L/  \3L/  \4L/  \
  //      /5UL_\/_00_\/_01_\/_02_\/_03_\/_04_\
  //     /\    /\    /\    /\    /\    /\    /
  //    /  \5L/  \10/  \11/  \12/  \13/  \14/
  //   /5L2_\/_05_\/_06_\/_07_\/_08_\/_09_\/
  //   \15L2/\    /\    /\    /\    /\    /
  //    \  /  \15/  \16/  \17/  \18/  \19/
  //     \/15L_\/16L_\/17L_\/18L_\/19L_\/
  //      \15BL/\15BR/
  //       \  /  \  /
  //        \/15B_\/
  // -----------------------------------

  getSemiValidSectorFromPoint(point: THREE.Vector3): number[] {

    const sectors: number[] = [];

    for (let key in ICOSAHEDRON_NET_CONSTS.SEMI_VALID_BOUNDS) {
      
      if (this.isInTriangle(point, (ICOSAHEDRON_NET_CONSTS.SEMI_VALID_BOUNDS as any)[key])) {
        sectors.push((ICOSAHEDRON_NET_CONSTS.BOUNDS as any)[key]);
      }
    }

    return sectors;
  }

  getValidSectorFromPoint(point: THREE.Vector3): number[] {
    
    const sectors: number[] = [];

    for (let key in ICOSAHEDRON_NET_CONSTS.VALID_BOUNDS) {
        if (this.isInTriangle(point, (ICOSAHEDRON_NET_CONSTS.VALID_BOUNDS as any)[key])) {
          sectors.push((ICOSAHEDRON_NET_CONSTS.BOUNDS as any)[key]);
        }
    }

    return sectors;
  }

  pointIsOutOfBounds(point: THREE.Vector3): boolean {
    return this.getValidSectorFromPoint(point).length === 0;
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
    const sector: number = this.getValidSectorFromPoint(point)[0];
    const bounds: THREE.Vector3[] = ICOSAHEDRON_NET_CONSTS.GET_BOUNDS(sector);
    const boundsTranslation: THREE.Vector2 = new THREE.Vector2(bounds[0].x, bounds[1].y > bounds[0].y ? bounds[1].y : bounds[0].y);
    const bounds0: THREE.Vector3 = new THREE.Vector3(bounds[0].x - boundsTranslation.x, bounds[0].y - boundsTranslation.y + EQUILATERAL_AXIS.FULL_HEIGHT, 0); // shifted so left point is center
    const bounds1: THREE.Vector3 = new THREE.Vector3(bounds[1].x - boundsTranslation.x, bounds[1].y - boundsTranslation.y + EQUILATERAL_AXIS.FULL_HEIGHT, 0); // shifted so left point is center
    const bounds2: THREE.Vector3 = new THREE.Vector3(bounds[2].x - boundsTranslation.x, bounds[2].y - boundsTranslation.y + EQUILATERAL_AXIS.FULL_HEIGHT, 0); // shifted so left point is center

    const shiftedBounds: THREE.Vector3[] = [bounds0, bounds1, bounds2];

    const midpoint: THREE.Vector3 = ICOSAHEDRON_NET_CONSTS.GET_BOUNDS_MIDPOINT(shiftedBounds);
    const pointCopy: THREE.Vector3 = new THREE.Vector3(point.x - boundsTranslation.x, point.y - boundsTranslation.y + EQUILATERAL_AXIS.FULL_HEIGHT, point.z);


    const leftSideAxis: THREE.Vector3 = new THREE.Vector3().copy(bounds1).sub(new THREE.Vector3().copy(bounds0));
    const rightSideAxis: THREE.Vector3 = new THREE.Vector3().copy(bounds2).sub(new THREE.Vector3().copy(bounds1));
    const xAxis: THREE.Vector3 = new THREE.Vector3().copy(bounds2).sub(new THREE.Vector3().copy(bounds0));
    
    const leftAxisSlope: number = this.getSlopeOfAxis(leftSideAxis);
    const rightAxisSlope: number = this.getSlopeOfAxis(rightSideAxis);
    const xAxisSlope: number = this.getSlopeOfAxis(xAxis);

    // GET SLOPE BETWEEN CENTER AND POINT
    let minDist: number = Infinity;
    const slope: number = this.getSlopeBetweenPoints(pointCopy, midpoint);
    let edgeIntersectionPoint1: THREE.Vector3 = new THREE.Vector3();
    let edgeIntersectionPoint2: THREE.Vector3 = new THREE.Vector3();
    let edgeIntersectionPoint3: THREE.Vector3 = new THREE.Vector3();
    let distance1: number;
    let distance2: number;
    let distance3: number;
    let distanceToMidPoint: number;
    let intersectionPointToUse: THREE.Vector3 = new THREE.Vector3();

      const leftAxisXShift: number = sector < 10 ? 0.0 : 0.5;
      const rightAxisXShift: number = sector < 10 ? 1.0 : 0.5;
      const xAxisYShift: number = sector < 10 ? 0.0 : 1.0;

      if (pointCopy.equals(midpoint)) {
        intersectionPointToUse = new THREE.Vector3((bounds0.x + bounds2.x) / 2, (bounds0.y + bounds2.y) / 2);
        minDist = this.getDistanceBetweenPoints(intersectionPointToUse, pointCopy);
      } else if (slope === Infinity || slope === -Infinity) {
        edgeIntersectionPoint1 = new THREE.Vector3().copy(bounds1);
        edgeIntersectionPoint2 = new THREE.Vector3((bounds0.x + bounds2.x) / 2, (bounds0.y + bounds2.y) / 2);
        distance1 = edgeIntersectionPoint1.distanceTo(pointCopy);
        distance2 = edgeIntersectionPoint2.distanceTo(pointCopy);
        intersectionPointToUse = distance1 < distance2 ? edgeIntersectionPoint1 : edgeIntersectionPoint2;
        minDist = Math.min(distance1, distance2);
      } else if (slope === 0) {
        edgeIntersectionPoint1 = this.getIntersectionPoint(slope, midpoint.x, midpoint.y, leftAxisSlope, leftAxisXShift, 0);
        edgeIntersectionPoint2 = this.getIntersectionPoint(slope, midpoint.x, midpoint.y, rightAxisSlope, rightAxisXShift, 0);
        distance1 = this.getDistanceBetweenPoints(edgeIntersectionPoint1, pointCopy);
        distance2 = this.getDistanceBetweenPoints(edgeIntersectionPoint2, pointCopy);
        intersectionPointToUse = distance1 < distance2 ? edgeIntersectionPoint1 : edgeIntersectionPoint2;
        minDist = Math.min(distance1, distance2);
      } else {
        edgeIntersectionPoint1 = this.getIntersectionPoint(slope, midpoint.x, midpoint.y, leftAxisSlope, leftAxisXShift, 0);
        edgeIntersectionPoint2 = this.getIntersectionPoint(slope, midpoint.x, midpoint.y, rightAxisSlope, rightAxisXShift, 0);
        edgeIntersectionPoint3 = this.getIntersectionPoint(slope, midpoint.x, midpoint.y, xAxisSlope, 0, xAxisYShift);
        distance1 = this.getDistanceBetweenPoints(edgeIntersectionPoint1, pointCopy);
        distance2 = this.getDistanceBetweenPoints(edgeIntersectionPoint2, pointCopy);
        distance3 = this.getDistanceBetweenPoints(edgeIntersectionPoint3, pointCopy);
        
        if (distance1 < distance2 && distance1 < distance3) {
          intersectionPointToUse = edgeIntersectionPoint1;
        } else if (distance2 < distance1 && distance2 < distance3) {
          intersectionPointToUse = edgeIntersectionPoint2;
        } else {
          intersectionPointToUse = edgeIntersectionPoint3;
        }
        minDist = Math.min( Math.min(distance1, distance2), distance3);
      }
      
      distanceToMidPoint = this.getDistanceBetweenPoints(intersectionPointToUse, midpoint);

      const percToMidpoint: number = minDist / distanceToMidPoint;
      const modifier: number = 0.95;// 7/8; // 3/4; // 2/3; // 5/6; // 3/4; // 5/6; // 3/4;
      const xChangeDist: number = Math.pow(percToMidpoint, modifier) * (midpoint.x - intersectionPointToUse.x);
      const yChangeDist: number = Math.pow(percToMidpoint, modifier) * (midpoint.y - intersectionPointToUse.y);
      
      const newPoint: THREE.Vector3 = new THREE.Vector3(intersectionPointToUse.x + xChangeDist + boundsTranslation.x, intersectionPointToUse.y + yChangeDist + boundsTranslation.y - EQUILATERAL_AXIS.FULL_HEIGHT, point.z);
      return  newPoint;
  }

  transformNetPointToIcosahedron(point: THREE.Vector3, sectorNumber: number = 0, spherizeAmount: number = 0): THREE.Vector3 {

    const fullHeight: number = 0.5 * Math.sqrt(3) * 1;
    const xAxis: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
    const leftVector: THREE.Vector3 = new THREE.Vector3(-0.5, fullHeight, 0).normalize();
    const rightVector: THREE.Vector3 = new THREE.Vector3(0.5, fullHeight, 0).normalize();
    const faceBendAngle: number =  (Math.PI - Math.acos(-Math.sqrt(5) / 3)); // 10 * Math.PI / 180; // 
    const columnIndex: number = Math.floor(sectorNumber / 5);

    if (sectorNumber >= 0 && sectorNumber < 5) { // bend top sectors in first
      this.translatePoints([point], -0.0, 0.5 * fullHeight, 0);
      this.rotatePointsAroundAxis([point], xAxis, -faceBendAngle);
      this.translatePoints([point], -0.0, -0.5 * fullHeight, 0);
    }
    if (sectorNumber > 14) { // bend bottom sectors in first
      this.translatePoints([point], -0.0, 1.5 * fullHeight, 0);
      this.rotatePointsAroundAxis([point], xAxis, faceBendAngle);
      this.translatePoints([point], -0.0, -1.5 * fullHeight, 0);
    }

    /** wrap outside (left and right) in **/
    /** start outside right wrapping **/
    if (sectorNumber === 4 || sectorNumber === 14) {
      this.translatePoints([point], -3.25, 0.0, 0);
      this.rotatePointsAroundAxis([point], leftVector, faceBendAngle);
      this.translatePoints([point], 3.25, 0.0, 0);
    }

    if (sectorNumber === 4 || sectorNumber === 9 || sectorNumber === 14 || sectorNumber === 19) {
      this.translatePoints([point], -3.75, 0.0, 0);
      this.rotatePointsAroundAxis([point], rightVector, faceBendAngle);
      this.translatePoints([point], 3.75, 0.0, 0);
    }

    if (sectorNumber === 3 || sectorNumber === 4 || sectorNumber === 9 || sectorNumber === 13 || sectorNumber === 14 || sectorNumber === 19) {
      this.translatePoints([point], -2.25, 0.0, 0);
      this.rotatePointsAroundAxis([point], leftVector, faceBendAngle);
      this.translatePoints([point], 2.25, 0.0, 0);
    }

    if ((sectorNumber >= 3 && sectorNumber <= 4) || 
    (sectorNumber >= 8 && sectorNumber <= 9) || 
    (sectorNumber >= 13 && sectorNumber <= 14) || 
    (sectorNumber >= 18 && sectorNumber <= 19)) { // sectors 3, 4, 8, 9, 13, 14, 18, 19
      this.translatePoints([point], -2.75, 0.0, 0);
      this.rotatePointsAroundAxis([point], rightVector, faceBendAngle);
      this.translatePoints([point], 2.75, 0.0, 0);
    }
    /** end outside right wrapping **/

    /** start outside left wrapping **/
    if (sectorNumber === 5 || sectorNumber === 15) {
      this.translatePoints([point], 0.75, 0.0, 0);
      this.rotatePointsAroundAxis([point], leftVector, -faceBendAngle);
      this.translatePoints([point], -0.75, 0.0, 0);
    }

    if (sectorNumber === 0 || sectorNumber === 5 || sectorNumber === 10 || sectorNumber === 15) {
      this.translatePoints([point], -0.75, 0.0, 0);
      this.rotatePointsAroundAxis([point], rightVector, -faceBendAngle);
      this.translatePoints([point], 0.75, 0.0, 0);
    }

    if (sectorNumber === 0 || sectorNumber === 5 || sectorNumber === 6 || sectorNumber === 10 || sectorNumber === 15 || sectorNumber === 16) {
      this.translatePoints([point], -0.25, 0.0, 0);
      this.rotatePointsAroundAxis([point], leftVector, -faceBendAngle);
      this.translatePoints([point], 0.25, 0.0, 0);
    }

    if (sectorNumber === 0 || sectorNumber === 1 || sectorNumber === 5 || sectorNumber === 6 || sectorNumber === 10 || sectorNumber === 11 || sectorNumber === 15 || sectorNumber === 16) {
      this.translatePoints([point], -1.75, 0.0, 0);
      this.rotatePointsAroundAxis([point], rightVector, -faceBendAngle);
      this.translatePoints([point], 1.75, 0.0, 0);
    }

     if (sectorNumber < 2 || 
      (sectorNumber >= 5 && sectorNumber <= 7) ||
      (sectorNumber >= 10 && sectorNumber <= 11) ||
      (sectorNumber >= 15 && sectorNumber <= 17)) { // sectors 0, 1, 5, 6, 7, 10, 11, 15, 16, 17
      this.translatePoints([point], -1.25, 0.0, 0);
      this.rotatePointsAroundAxis([point], leftVector, -faceBendAngle);
      this.translatePoints([point], 1.25, 0.0, 0);
    }
    /** end outside left wrapping **/

    /** start spherizing **/
    spherizeAmount = 1;

    const edgeLength: number = 1;
    const circumsphereRadius: number = Math.sqrt( 10 + (2 * Math.sqrt(5))) / 4 * edgeLength;

    point.x -= 2;
    point.y += fullHeight;
    point.z += circumsphereRadius;
    const nrmP1: THREE.Vector3 = new THREE.Vector3().copy(point);
    this.normalizePoints([nrmP1]);

    point = new THREE.Vector3().copy(nrmP1);
    point.x += 2;
    point.y -= fullHeight;
    point.z -= circumsphereRadius;
    /** end spherizing **/

    return point;
  }

  getDistanceBetweenPoints(point1: THREE.Vector3, point2: THREE.Vector3): number {
    return Math.sqrt( Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2) );
  }

  getSlopeBetweenPoints(point1: THREE.Vector3, point2: THREE.Vector3): number {
    return (point1.y - point2.y) / (point1.x - point2.x);
  }

  getSlopeOfAxis(axis: THREE.Vector3): number {
    return axis.y / axis.x;
  }

  getIntersectionPoint(slope: number, x1: number, y1: number, slope2: number, x2: number, y2: number): THREE.Vector3 {
    const b1: number = y1 - slope * x1;
    const b2: number = y2 - slope2 * x2;
    let xIntersectionPoint: number = (b2 - b1) / (slope - slope2);
    let yIntersectionPoint = slope2 * xIntersectionPoint + b2;

    return new THREE.Vector3(xIntersectionPoint, yIntersectionPoint);
  }

  normalizePoints(points: THREE.Vector3[]): void {
    const pointLen: number = points.length;
    let point: THREE.Vector3;
    for (let i = 0; i < pointLen; i++) {
      point = points[i];
      point = point.normalize();
    }
  }

  rotatePointsAroundAxis(points: THREE.Vector3[], axis: THREE.Vector3, angleInRadians: number ): void {
    const pointLen: number = points.length;
    let point: THREE.Vector3;
    for (let i = 0; i < pointLen; i++) {
      point = points[i];
      point = this.rotateAroundAxis(point, axis, angleInRadians);
    }
  }
  rotateAroundAxis(vector: THREE.Vector3, axis: THREE.Vector3, angleInRadians: number): THREE.Vector3 {
    return vector.applyAxisAngle( axis, angleInRadians );
  }

  scalePoints(points: THREE.Vector3[], scale: number): void {
    const pointLen: number = points.length;
    let point: THREE.Vector3;
    for (let i = 0; i < pointLen; i++) {
      point = points[i];
      point.x *= scale;
      point.y *= scale;
      point.z *= scale;
    }
  }

  translatePoints(points: THREE.Vector3[], x: number, y: number, z: number): void {
    const pointLen: number = points.length;
    let point: THREE.Vector3;
    for (let i = 0; i < pointLen; i++) {
      point = points[i];
      point.x += x;
      point.y += y;
      point.z += z;
    }
  }



}
