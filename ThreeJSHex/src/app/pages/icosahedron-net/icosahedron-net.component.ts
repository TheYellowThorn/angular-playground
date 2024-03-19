import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {SceneBuilderService } from './../../services/scene-builder.service';
import * as THREE from 'three';
import {BufferGeometry, IcosahedronGeometry, Vector3 } from 'three';
import { IcosahedronUtilsService } from './utils/services/icosahedron-utils/icosahedron-utils.service';
import { EQUILATERAL_AXIS } from './utils/axis/equilateral-axis';
import { ICOSAHEDRON_NET_CONSTS } from './utils/icosahedron-net-consts/icosahedron-net-consts';

@Component({
  selector: 'app-icosahedron-net',
  templateUrl: './icosahedron-net.component.html',
  styleUrls: ['./icosahedron-net.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IcosahedronNetComponent implements OnInit {

  icosahedronNetGeometry: THREE.BufferGeometry | undefined;
  isosahedronNetMaterial: THREE.MeshLambertMaterial | undefined;
  icosahedronNetMesh: THREE.Mesh | undefined;
  icosahedronGeometry: THREE.BufferGeometry | undefined;
  icosahedronMaterial: THREE.MeshLambertMaterial | undefined;
  icosahedronMesh: THREE.Mesh | undefined;

  icosahedronDualNetGeometry0: THREE.BufferGeometry | undefined;
  icosahedronDualNetMaterial0: THREE.MeshLambertMaterial | undefined;
  icosahedronDualNetMesh0: THREE.Mesh | undefined;

  icosahedronDualNetGeometry: THREE.BufferGeometry | undefined;
  icosahedronDualNetMaterial: THREE.MeshLambertMaterial | undefined;
  icosahedronDualNetMesh: THREE.Mesh | undefined;

  mappingMeshGeometry: THREE.BufferGeometry | undefined;
  mappingMeshMaterial: THREE.MeshLambertMaterial | undefined;
  mappingMesh: THREE.Mesh | undefined;

  subdivisions: number = 1;
  quadDivisions: number = 1;

  @ViewChild('canvas', {read: ElementRef, static: true}) public canvasRef: ElementRef | undefined;
  @ViewChild('canvasParent', {read: ElementRef, static: true}) public canvasParentRef: ElementRef | undefined;

  constructor(public sceneBuilderService: SceneBuilderService, public icosahedronUtilsService: IcosahedronUtilsService) {}

  ngOnInit(): void {
    this.sceneBuilderService.createScene(this.canvasRef!);

    const subdivisions: number = this.subdivisions;

    const now: number = Date.now();
    this.icosahedronNetGeometry = this.getIcosahedronNet2(subdivisions); // this.getIcosahedronNet(subdivisions);
    // console.log('render time:', (Date.now() - now));
    this.icosahedronNetGeometry.computeVertexNormals();
    this.isosahedronNetMaterial = new THREE.MeshLambertMaterial( {color: 0x333333 } );
    this.icosahedronNetMesh = new THREE.Mesh( this.icosahedronNetGeometry, this.isosahedronNetMaterial );
    this.icosahedronNetMesh.scale.x = this.icosahedronNetMesh.scale.y = this.icosahedronNetMesh.scale.z = 1;
    // this.icosahedronNetMesh.position.x = -5;
    this.icosahedronNetMesh.position.z = 3;
    this.isosahedronNetMaterial.wireframe = true;
    // this.sceneBuilderService.scene!.add(this.icosahedronNetMesh);

    this.icosahedronDualNetGeometry0 = this.getIcosahedronDualNet(subdivisions); // this.getIcosahedronNet(subdivisions);
    // this.icosahedronDualNetGeometry = this.getIcosahedronDualNetWithQuads(subdivisions);
    this.icosahedronDualNetGeometry0.computeVertexNormals();
    this.icosahedronDualNetMaterial0 = new THREE.MeshLambertMaterial( {color: 0x333333 } );
    this.icosahedronDualNetMesh0 = new THREE.Mesh( this.icosahedronDualNetGeometry0, this.icosahedronDualNetMaterial0 );
    this.icosahedronDualNetMesh0.scale.x = this.icosahedronDualNetMesh0.scale.y = this.icosahedronDualNetMesh0.scale.z = 1;
    // this.icosahedronDualNetMesh.position.x = 0.5;
    // this.icosahedronDualNetMesh.position.y = -Math.sqrt(3) / 2;
    this.icosahedronDualNetMesh0.position.z = 3;
    this.icosahedronDualNetMaterial0.wireframe = true;
    this.sceneBuilderService.scene!.add(this.icosahedronDualNetMesh0);
    (this.icosahedronDualNetMesh0.material as THREE.MeshLambertMaterial).wireframe = true;

    // this.icosahedronDualNetGeometry = this.getIcosahedronDualNet(subdivisions); // this.getIcosahedronNet(subdivisions);
    this.icosahedronDualNetGeometry = this.getIcosahedronDualNetWithQuads(subdivisions);
    this.icosahedronDualNetGeometry.computeVertexNormals();
    this.icosahedronDualNetMaterial = new THREE.MeshLambertMaterial( {color: 0x333333 } );
    this.icosahedronDualNetMesh = new THREE.Mesh( this.icosahedronDualNetGeometry, this.icosahedronDualNetMaterial );
    this.icosahedronDualNetMesh.scale.x = this.icosahedronDualNetMesh.scale.y = this.icosahedronDualNetMesh.scale.z = 1;
    // this.icosahedronDualNetMesh.position.x = 0.5;
    // this.icosahedronDualNetMesh.position.y = -Math.sqrt(3) / 2;
    this.icosahedronDualNetMesh.position.z = 3;
    this.isosahedronNetMaterial.wireframe = true;
    this.sceneBuilderService.scene!.add(this.icosahedronDualNetMesh);
    (this.icosahedronDualNetMesh.material as THREE.MeshLambertMaterial).wireframe = true;

    const icosahedronBoundsNetGeometry = this.getIcosahedronNetBounds();
    const material2 = new THREE.MeshLambertMaterial( {color: 0x553333 } );
    const mesh2 = new THREE.Mesh( icosahedronBoundsNetGeometry, material2 );
    mesh2.scale.x = mesh2.scale.y = mesh2.scale.z = 1;
    material2.wireframe = true;
    // this.sceneBuilderService.scene.add(mesh2);

    this.icosahedronGeometry = this.getIcosahedron(subdivisions, 0.6);
    this.icosahedronGeometry.computeVertexNormals();
    this.icosahedronNetGeometry.normalizeNormals();
    this.icosahedronMaterial = new THREE.MeshLambertMaterial({color: 0x55cc11});
    if (this.icosahedronMaterial.map) {
      this.icosahedronMaterial.map.anisotropy = 16;
    }
    // this.icosahedronMaterial.wireframe = true;
    this.icosahedronMesh = new THREE.Mesh(this.icosahedronGeometry, this.icosahedronMaterial);
    this.icosahedronMesh.scale.x = this.icosahedronMesh.scale.y = this.icosahedronMesh.scale.z = 2;
    this.icosahedronMesh.position.y = 0;
    this.icosahedronMesh.castShadow = true;
    this.icosahedronMesh.receiveShadow = true;
    // this.sceneBuilderService.scene!.add(this.icosahedronMesh);

    this.mappingMeshGeometry = new THREE.BufferGeometry();
    const fullHeight: number = 0.5 * Math.sqrt(3) * 1;
    const vertices = new Float32Array( [
      -2.0, 0.0, 0.0,
      -1, 0.0, 0.0,
      -1.5, fullHeight,  0.0
    ] );
    

    this.mappingMeshGeometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    this.mappingMeshGeometry.computeVertexNormals();
    // console.log(this.mappingMeshGeometry.getAttribute('position').array);
    this.mappingMeshMaterial = new THREE.MeshLambertMaterial({color: 0x990000});
    this.mappingMesh = new THREE.Mesh(this.mappingMeshGeometry, this.mappingMeshMaterial);
    this.mappingMesh.scale.x = this.icosahedronNetMesh.scale.y = this.icosahedronNetMesh.scale.z = 1;
    this.mappingMesh.position.z = 3;
    this.sceneBuilderService.scene!.add(this.mappingMesh);

    // console.log(this.mappingMeshGeometry.getAttribute('position').array);

    this.sceneBuilderService.onRenderFrame.subscribe(e => {
      // console.log(e.fps, e.averageFps);
      // this.icosahedronNetMesh.rotation.x += Math.PI / 512;
      // this.icosahedronNetMesh.rotation.y += Math.PI / 512;
      // this.icosahedronNetMesh.rotation.z += Math.PI / 10; // 512;

      //this.icosahedronMesh.rotation.x += Math.PI / 10; // 100; // 512;
      // this.icosahedronMesh.rotation.y += Math.PI / 10; // 512;
      // this.icosahedronMesh.rotation.z += Math.PI / 10; // 512;

      // this.mappingMesh.rotation.x += Math.PI / 100;
    })
    this.sceneBuilderService.initRender();
  }

  getIcosahedronNetBounds(): THREE.BufferGeometry {
    const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    const fullHeight: number = 0.5 * Math.sqrt(3) * 1;

    const vertices = new Float32Array( [
      0.0, 0.0, 1.0,
      1.0, 0.0, 1.0,
      0.5, fullHeight,  1.0
    ] );

    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    return geometry;
  }

  getIcosahedronNet(subdivisions: number = 0): THREE.BufferGeometry {
    const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    
    const netArray: number[] = [];

    for (let i = 0; i < 20; i++) {
      netArray.push(...this.getIcosadronNetSectorArray(subdivisions, i));
    }
    
    const vertices = new Float32Array( netArray );
    geometry.setAttribute( 'position', new THREE .BufferAttribute( vertices, 3 ) );

    return geometry;
  }

  getIcosahedronDualNet(subdivisions: number = 0): THREE.BufferGeometry {
    const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    
    const netArray: number[] = [];

    // for (let i = 0; i < 20; i++) {
      netArray.push(...this.getIcosadronDualNetSectorArray(subdivisions));
    // }
    
    const vertices = new Float32Array( netArray );
    geometry.setAttribute( 'position', new THREE .BufferAttribute( vertices, 3 ) );

    return geometry;
  }

  getIcosahedronDualNetWithQuads(subdivisions: number = 0): THREE.BufferGeometry {
    const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    
    const netArray: number[] = [];

    // for (let i = 0; i < 20; i++) {
      netArray.push(...this.getIcosadronDualNetSectorArrayWithQuads(subdivisions));
    // }
    
    const vertices = new Float32Array( netArray );
    geometry.setAttribute( 'position', new THREE .BufferAttribute( vertices, 3 ) );

    return geometry;
  }

  getIcosahedronNet2(subdivisions: number = 0): THREE.BufferGeometry {
    const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    
    const netArray: number[] = [];

    // for (let i = 0; i < 20; i++) {
      netArray.push(...this.getIcosadronNetSectorArray2(subdivisions));
    // }
    
    const vertices = new Float32Array( netArray );
    geometry.setAttribute( 'position', new THREE .BufferAttribute( vertices, 3 ) );

    return geometry;
  }

  getIcosahedron(subdivisions: number = 0, spherizeAmount: number = 0): THREE.BufferGeometry {
    const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    
    const netArray: number[] = [];

    for (let i = 0; i < 20; i++) {
      netArray.push(...this.getIcosadronSectorArray(subdivisions, i, spherizeAmount));
    }
    
    const vertices = new Float32Array( netArray );
    geometry.setAttribute( 'position', new THREE .BufferAttribute( vertices, 3 ) );

    return geometry;
  }

  getIcosadronNetSectorArray(subdivisions: number = 0, sectorNumber: number = 0): number[] {
    const vertexArray = [];

    let cols: number = subdivisions;
    let rows: number = 2 * subdivisions;
    for (let i = 0; i <= rows; i++) {
      for (let j = 0; j <= cols; j++) {
        if (i % 2 === 1 && j == 0) {
          cols--;
        }
        vertexArray.push(...this.getTriangleFromPoint(j, i, subdivisions, sectorNumber));
      }
    }

    return vertexArray;
  }

  getSectorNum(vec: THREE.Vector3, vec2: THREE.Vector3): number {

    const fullHeight: number = 0.5 * Math.sqrt(3);
    const slope: number = fullHeight / 0.5; //mx + b
    // const slope: number = (vec2.y - vec.y) / (vec2.x - vec.x);

    // leftmost triangle is shifted 2.5 units left and down Math.sqrt(3) / 4 - this is the b for the first left edge
    const xShift: number = -2.5;
    const yShift: number = -Math.sqrt(3) / 4;
    const b: number = yShift - xShift * slope; // vec.y - vec.x * slope; // Math.sqrt(3) / 4;
    const b2: number = yShift + xShift * slope;
    // const firstLineB: number = b - 2 * fullHeight;

    // const leftmostB: number = 
    const x: number = vec.x;
    const y: number = vec.y;

    const tri: number[] = this.getTriangleFromPoint2(0, -3, this.subdivisions);
    const testVec: THREE.Vector3 = new THREE.Vector3(tri[0], tri[1], tri[2]);

    
    let sectorX: number = 5;
    for (let xi = 0; xi <= 5; xi++) {
      // point is to the left
      if (testVec.y > (slope * (testVec.x - xi) + b)) {
        sectorX = xi - 1;
        break;
      }
    }
    // Valid sector remainders range from 0 to 4 -- x value is outside of net
    if (sectorX === -1 || sectorX === 5) {
      // console.log('x value is out of bounds');
    }

    // console.log('sec:',  yShift - fullHeight * 0);
    let sectorX2: number = 5;
    for (let xi2 = -1; xi2 <= 6; xi2++) {
      // point is to the left
      if (testVec.y < (-slope * (testVec.x - xi2) + b2)) {
        sectorX2 = xi2;
        break;
      }
    }
    if (sectorX2 === -1 || sectorX2 === 6) {
      // console.log('x value is out of bounds');
    }

    

    let sectorY: number = -1;
    for (let yi = 0; yi < 3; yi++) {
      // point is above
      if (testVec.y >= yShift - fullHeight * yi) {
        sectorY = yi;
        break;
      }
    }

    // sector
    // 0:  {x1: 0, x2: 1, y: 0}
    // 1:  {x1: 1, x2: 2, y: 0}
    // 2:  {x1: 2, x2: 3, y: 0}
    // 3:  {x1: 3, x2: 4, y: 0}
    // 4:  {x1: 4, x2: 5, y: 0}
    // 5:  {x1: 0, x2: 0, y: 1}
    // 6:  {x1: 1, x2: 1, y: 1} 
    // 7:  {x1: 2, x2: 2, y: 1} 
    // 8:  {x1: 3, x2: 3, y: 1} 
    // 9:  {x1: 4, x2: 4, y: 1} 
    // 10: {x1: 0, x2: 1, y: 1} 
    // 11: {x1: 1, x2: 2, y: 1} 
    // 12: {x1: 2, x2: 3, y: 1} 
    // 13: {x1: 3, x2: 4, y: 1} 
    // 14: {x1: 4, x2: 5, y: 1} 
    // 15: {x1: 0, x2: 0, y: 2} 
    // 16: {x1: 1, x2: 1, y: 2} 
    // 17: {x1: 2, x2: 2, y: 2} 
    // 18: {x1: 3, x2: 3, y: 2} 
    // 19: {x1: 4, x2: 4, y: 2} 
    
    // console.log(testVec, (sectorX2 - sectorX) * 5 + sectorY * 5 + sectorX);
    
    // console.log('sectors:', {x1: sectorX, x2: sectorX2, y: sectorY}, testVec);

    // if (testVec.y > (slope * (testVec.x - 2) + b)) {
    //   console.log('in first two left sectors');
    // }

    // if (testVec.y > (slope * (testVec.x - 3) + b)) {
    //   console.log('in first three left sectors');
    // }

    // if (testVec.y > (slope * (testVec.x - 4) + b)) {
    //   console.log('in first four left sectors');
    // }
    
    // if (testVec.y > (slope * (testVec.x - 5) + b)) {
    //   console.log('in first five left sectors');
    // }

   return 0;
  }

  // 5:
  // 0 -6 5
  // 1 -6 5
  // 2 -6 5
  // 0 -5 5
  // 1 -5 5
  // 0 -4 5
  // 1 -4 5
  // 0 -3 5
  // 0 -2 5

  // 10:
  // 0 -1 5
  // 1 -1 5
  // 2 -1 5
  // 1 -2 5
  // 2 -2 5
  // 1 -3 5
  // 2 -3 5
  // 2 -4 5
  // 2 -5 5

  getIcosadronNetSectorArray2(subdivisions: number = 0): number[] {
    const vertexArray = [];
    const fullHeight: number = 0.5 * Math.sqrt(3) * 1;

    for (let sectorNumber = 0; sectorNumber < 20; sectorNumber++) {
      // console.log('\nSector #: ', sectorNumber);
      // if (!(sectorNumber === 10 || sectorNumber === 5)) continue;
      const maxTrianglesHigh: number = 2 * subdivisions + 1;
      const sectorXOffset: number = (subdivisions + 1) * (sectorNumber % 5) + 0.5 * (subdivisions + 1) * Math.floor(sectorNumber / 10);
      const sectorColumnNumber: number = (-maxTrianglesHigh - 1) * Math.floor((sectorNumber + 5) / 10);
      const reverseMultiplier: number = -2 * Math.floor(sectorNumber / 10) + 1;
      const zeroifier: number = Math.floor(sectorNumber / 10);
      const thirdOrFourth: number = Math.floor((sectorNumber - 5) / 10);
      let xI: number;
      let yI: number;
      let cols: number = subdivisions;
      let rows: number = 2 * subdivisions;

        for (let i = 0; i <= rows; i++) {
          for (let j = 0; j <= cols; j++) {
            if (i % 2 === 1 && j == 0) {
              cols--;
            }
            const flippedSectorYAdjustement: number =  + Math.floor(sectorNumber / 10) * ( -1 - ((subdivisions - 1) / 2) + Math.ceil(i / 2) );
            xI = j + sectorXOffset + flippedSectorYAdjustement;
            yI = reverseMultiplier * (i + sectorColumnNumber) + -zeroifier * ( maxTrianglesHigh + 2 + 2 * (thirdOrFourth * maxTrianglesHigh + thirdOrFourth));

            // console.log(xI, yI, maxTrianglesHigh);

            const trianglePoints: number[] = this.getTriangleFromPoint2(xI, yI, subdivisions);
            this.getSectorNum(new THREE.Vector3(trianglePoints[0], trianglePoints[1], trianglePoints[2]), new THREE.Vector3(trianglePoints[6], trianglePoints[7], trianglePoints[8]));

            vertexArray.push(...trianglePoints);
          }
        }
    }

    return vertexArray;
  }

  getIcosadronDualNetSectorArray(subdivisions: number = 0): number[] {
    const vertexArray = [];
    const fullHeight: number = 0.5 * Math.sqrt(3) * 1;

    // draw all hexes
    for (let sectorNumber = 0; sectorNumber < 20; sectorNumber++) { // 20; sectorNumber++) {
      console.log('\nSector #: ', sectorNumber);
      // if (!(sectorNumber === 10 || sectorNumber === 5)) continue;
      const maxTrianglesHigh: number = 2 * subdivisions + 1;
      const sectorXOffset: number = (subdivisions + 1) * (sectorNumber % 5) + 0.5 * (subdivisions + 1) * Math.floor(sectorNumber / 10);
      const sectorColumnNumber: number = (-maxTrianglesHigh - 1) * Math.floor((sectorNumber + 5) / 10);
      const reverseMultiplier: number = -2 * Math.floor(sectorNumber / 10) + 1;
      const zeroifier: number = Math.floor(sectorNumber / 10);
      const thirdOrFourth: number = Math.floor((sectorNumber - 5) / 10);
      let xI: number;
      let yI: number;
      let cols: number = subdivisions;
      let rows: number = 2 * subdivisions;
      let trianglePoints: number[];


      for (let i = 0; i <= rows; i++) {
        for (let j = 0; j <= cols; j++) {
          if ((i % 2 === 1 && j == 0)) {
            cols--;
          }

          const flippedSectorYAdjustement: number =  + Math.floor(sectorNumber / 10) * ( -1 - ((subdivisions - 1) / 2) + Math.ceil(i / 2) );
          xI = j + sectorXOffset + flippedSectorYAdjustement;
          yI = reverseMultiplier * (i + sectorColumnNumber) + -zeroifier * ( maxTrianglesHigh + 2 + 2 * (thirdOrFourth * maxTrianglesHigh + thirdOrFourth));
          if (yI % 2 !== 0) {
            continue;
          }
          
          if (i === 0 && j == 0) {
            if (sectorNumber < 10) {
              trianglePoints = this.getPentagonTrianglesFromPoint(sectorNumber, xI, yI, subdivisions);

              for (let k = 0; k < trianglePoints.length; k+=3) {
                let point: THREE.Vector3 = new THREE.Vector3(trianglePoints[k] + 2, trianglePoints[k + 1], trianglePoints[k + 2]); // offset by 2
                // point = this.icosahedronUtilsService.interpolatePointsTowardEquilateralCenter(point);
                const sector: number[] = this.icosahedronUtilsService.getValidSectorFromPoint(point);

                // point = this.icosahedronUtilsService.transformNetPointToIcosahedron(point, sector[0]);

                trianglePoints[k] = point.x - 2;
                trianglePoints[k + 1] = point.y;
                trianglePoints[k + 2] = point.z;
              }

              vertexArray.push(...trianglePoints);
              continue;
            }
            
          } else {
            trianglePoints = this.getHexTrianglesFromPoint(xI, yI, subdivisions);

            for (let k = 0; k < trianglePoints.length; k+=3) {
              let point: THREE.Vector3 = new THREE.Vector3(trianglePoints[k] + 2, trianglePoints[k + 1], trianglePoints[k + 2]); // offset by 2
              // point = this.icosahedronUtilsService.interpolatePointsTowardEquilateralCenter(point);
              const sector: number[] = this.icosahedronUtilsService.getValidSectorFromPoint(point);

              // point = this.icosahedronUtilsService.transformNetPointToIcosahedron(point, sector[0]);

              trianglePoints[k] = point.x - 2;
              trianglePoints[k + 1] = point.y;
              trianglePoints[k + 2] = point.z;
            }
            vertexArray.push(...trianglePoints);
            
            
          }
        }
      }
      // draw top and bottom pentagons
      if (sectorNumber === 0 || sectorNumber === 15) {
        const rowNum: number = sectorNumber === 0 ? (subdivisions + 1) * 2 : (subdivisions + 1) * 2 - 1;
        const colNum: number = sectorNumber === 0 ? 0 : 0;

        const flippedSectorYAdjustement: number =  + Math.floor(sectorNumber / 10) * ( -1 - ((subdivisions - 1) / 2) + Math.ceil(rowNum / 2) );
        xI = colNum + sectorXOffset + flippedSectorYAdjustement;
        yI = reverseMultiplier * (rowNum + sectorColumnNumber) + -zeroifier * ( maxTrianglesHigh + 2 + 2 * (thirdOrFourth * maxTrianglesHigh + thirdOrFourth));
        trianglePoints = this.getPentagonTrianglesFromPoint(sectorNumber, xI, yI, subdivisions);

        for (let k = 0; k < trianglePoints.length; k+=3) {
          let point: THREE.Vector3 = new THREE.Vector3(trianglePoints[k] + 2, trianglePoints[k + 1], trianglePoints[k + 2]); // offset by 2
          // point = this.icosahedronUtilsService.interpolatePointsTowardEquilateralCenter(point);
          const sector: number[] = this.icosahedronUtilsService.getValidSectorFromPoint(point);
          // console.log(sector[0]);
          // point = this.icosahedronUtilsService.transformNetPointToIcosahedron(point, sector[0]);

          trianglePoints[k] = point.x - 2;
          trianglePoints[k + 1] = point.y;
          trianglePoints[k + 2] = point.z;
        }
        vertexArray.push(...trianglePoints);
      }
    }
    return vertexArray;
  }

  getIcosadronDualNetSectorArrayWithQuads(subdivisions: number = 0): number[] {
    const vertexArray = [];
    const fullHeight: number = 0.5 * Math.sqrt(3) * 1;

    // draw all hexes
    for (let sectorNumber = 0; sectorNumber < 20; sectorNumber++) { // 20; sectorNumber++) {
      console.log('\nSector #: ', sectorNumber);
      // if (!(sectorNumber === 10 || sectorNumber === 5)) continue;
      const maxTrianglesHigh: number = 2 * subdivisions + 1;
      const sectorXOffset: number = (subdivisions + 1) * (sectorNumber % 5) + 0.5 * (subdivisions + 1) * Math.floor(sectorNumber / 10);
      const sectorColumnNumber: number = (-maxTrianglesHigh - 1) * Math.floor((sectorNumber + 5) / 10);
      const reverseMultiplier: number = -2 * Math.floor(sectorNumber / 10) + 1;
      const zeroifier: number = Math.floor(sectorNumber / 10);
      const thirdOrFourth: number = Math.floor((sectorNumber - 5) / 10);
      let xI: number;
      let yI: number;
      let cols: number = subdivisions;
      let rows: number = 2 * subdivisions;
      let trianglePoints: number[];


      for (let i = 0; i <= rows; i++) {
        for (let j = 0; j <= cols; j++) {
          if ((i % 2 === 1 && j == 0)) {
            cols--;
          }

          const flippedSectorYAdjustement: number =  + Math.floor(sectorNumber / 10) * ( -1 - ((subdivisions - 1) / 2) + Math.ceil(i / 2) );
          xI = j + sectorXOffset + flippedSectorYAdjustement;
          yI = reverseMultiplier * (i + sectorColumnNumber) + -zeroifier * ( maxTrianglesHigh + 2 + 2 * (thirdOrFourth * maxTrianglesHigh + thirdOrFourth));
          if (yI % 2 !== 0) {
            continue;
          }
          
          if (i === 0 && j == 0) {
            if (sectorNumber < 10) {
              trianglePoints = this.getPentagonQuadTrianglesFromPoint(sectorNumber, xI, yI, subdivisions);

              for (let k = 0; k < trianglePoints.length; k+=3) {
                let point: THREE.Vector3 = new THREE.Vector3(trianglePoints[k] + 2, trianglePoints[k + 1], trianglePoints[k + 2]); // offset by 2
                // point = this.icosahedronUtilsService.interpolatePointsTowardEquilateralCenter(point);
                const sector: number[] = this.icosahedronUtilsService.getValidSectorFromPoint(point);

                // point = this.icosahedronUtilsService.transformNetPointToIcosahedron(point, sector[0]);

                trianglePoints[k] = point.x - 2;
                trianglePoints[k + 1] = point.y;
                trianglePoints[k + 2] = point.z;
              }

              vertexArray.push(...trianglePoints);
              continue;
            }
            
          } else {
            trianglePoints = this.getHexQuadTrianglesFromPoint(xI, yI, subdivisions);

            for (let k = 0; k < trianglePoints.length; k+=3) {
              let point: THREE.Vector3 = new THREE.Vector3(trianglePoints[k] + 2, trianglePoints[k + 1], trianglePoints[k + 2]); // offset by 2
              // point = this.icosahedronUtilsService.interpolatePointsTowardEquilateralCenter(point);
              const sector: number[] = this.icosahedronUtilsService.getValidSectorFromPoint(point);

              // point = this.icosahedronUtilsService.transformNetPointToIcosahedron(point, sector[0]);

              trianglePoints[k] = point.x - 2;
              trianglePoints[k + 1] = point.y;
              trianglePoints[k + 2] = point.z;
            }
            // vertexArray.push(...trianglePoints);
            
            
          }
        }
      }
      // draw top and bottom pentagons
      if (sectorNumber === 0 || sectorNumber === 15) {
        const rowNum: number = sectorNumber === 0 ? (subdivisions + 1) * 2 : (subdivisions + 1) * 2 - 1;
        const colNum: number = sectorNumber === 0 ? 0 : 0;

        const flippedSectorYAdjustement: number =  + Math.floor(sectorNumber / 10) * ( -1 - ((subdivisions - 1) / 2) + Math.ceil(rowNum / 2) );
        xI = colNum + sectorXOffset + flippedSectorYAdjustement;
        yI = reverseMultiplier * (rowNum + sectorColumnNumber) + -zeroifier * ( maxTrianglesHigh + 2 + 2 * (thirdOrFourth * maxTrianglesHigh + thirdOrFourth));
        trianglePoints = this.getPentagonQuadTrianglesFromPoint(sectorNumber, xI, yI, subdivisions);

        for (let k = 0; k < trianglePoints.length; k+=3) {
          let point: THREE.Vector3 = new THREE.Vector3(trianglePoints[k] + 2, trianglePoints[k + 1], trianglePoints[k + 2]); // offset by 2
          // point = this.icosahedronUtilsService.interpolatePointsTowardEquilateralCenter(point);
          const sector: number[] = this.icosahedronUtilsService.getValidSectorFromPoint(point);
          // console.log(sector[0]);
          // point = this.icosahedronUtilsService.transformNetPointToIcosahedron(point, sector[0]);

          trianglePoints[k] = point.x - 2;
          trianglePoints[k + 1] = point.y;
          trianglePoints[k + 2] = point.z;
        }
        vertexArray.push(...trianglePoints);
      }
    }
    return vertexArray;
  }

  getMappedPointOnIcosadedron(point: THREE.Vector3, subdivisions: number, sectorNumber: number = 0, spherizeAmount: number = 0): number[] {
    const triangle: any[] = point.toArray(); // this.getTriangleFromPoint(x, y, subdivisions, sectorNumber);
    const p1: THREE.Vector3 = new Vector3(triangle[0], triangle[1], triangle[2]);
    const p2: THREE.Vector3 = new Vector3(triangle[3], triangle[4], triangle[5]);
    const p3: THREE.Vector3 = new Vector3(triangle[6], triangle[7], triangle[8]);

    const fullHeight: number = 0.5 * Math.sqrt(3) * 1;
    const sectorColumnNumber: number = Math.floor((sectorNumber + 5) / 10);
    const xAxis: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
    const rightSideOfEquilateralVector: THREE.Vector3 = new THREE.Vector3(-0.5, fullHeight, 0).normalize();
    const leftSideOfEquilateralVector: THREE.Vector3 = new THREE.Vector3(0.5, fullHeight, 0).normalize();
    const faceBendAngle: number = (Math.PI - Math.acos(-Math.sqrt(5) / 3));
    const columnIndex: number = Math.floor(sectorNumber / 5);
    const oddColumn: boolean = columnIndex % 2 === 1; // start with index of 0

    if (columnIndex === 0 || columnIndex === 3) {
      const num: number = sectorColumnNumber + 1;
      const neg: number = sectorNumber < 15 ? 1 : -1;
      const rad: number = neg * faceBendAngle;
      const yShift: number = num * (fullHeight / 2);

      this.translatePoints([p1, p2, p3], 0, yShift, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], xAxis, rad);
      this.translatePoints([p1, p2, p3], 0, -yShift, 0);
    }
    

    if (sectorNumber % 5 < 0 || (oddColumn && sectorNumber % 5 < 1)) {
      this.translatePoints([p1, p2, p3], 2.25, fullHeight, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], rightSideOfEquilateralVector, faceBendAngle);
      this.translatePoints([p1, p2, p3], -2.25, -fullHeight, 0);
    }

    if (sectorNumber % 5 < 1) {
      this.translatePoints([p1, p2, p3], 1.75, fullHeight, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], leftSideOfEquilateralVector, faceBendAngle);
      this.translatePoints([p1, p2, p3], -1.75, -fullHeight, 0);
    }

    if (sectorNumber % 5 < 1 || (oddColumn && sectorNumber % 5 < 2)) {
      
      this.translatePoints([p1, p2, p3], 1.25, fullHeight, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], rightSideOfEquilateralVector, faceBendAngle);
      this.translatePoints([p1, p2, p3], -1.25, -fullHeight, 0);
    }

    if (sectorNumber % 5 < 2) {

      this.translatePoints([p1, p2, p3], 0.75, fullHeight, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], leftSideOfEquilateralVector, faceBendAngle);
      this.translatePoints([p1, p2, p3], -0.75, -fullHeight, 0);
    }

    if (sectorNumber % 5 < 2 || (oddColumn && sectorNumber % 5 < 3)) {
      
      this.translatePoints([p1, p2, p3], 0.25, fullHeight, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], rightSideOfEquilateralVector, faceBendAngle);
      this.translatePoints([p1, p2, p3], -0.25, -fullHeight, 0);
    }

    if (sectorNumber % 5 > 4 || (!oddColumn && sectorNumber % 5 > 3)) {
      this.translatePoints([p1, p2, p3], -1.75, fullHeight, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], rightSideOfEquilateralVector, -faceBendAngle);
      this.translatePoints([p1, p2, p3], 1.75, -fullHeight, 0);
    }

    if (sectorNumber % 5 > 3) {

      this.translatePoints([p1, p2, p3], -1.25, fullHeight, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], leftSideOfEquilateralVector, -faceBendAngle);
      this.translatePoints([p1, p2, p3], 1.25, -fullHeight, 0);
    }

    if (sectorNumber % 5 > 3 || (!oddColumn && sectorNumber % 5 > 2)) {
      
      this.translatePoints([p1, p2, p3], -0.75, fullHeight, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], rightSideOfEquilateralVector, -faceBendAngle);
      this.translatePoints([p1, p2, p3], 0.75, -fullHeight, 0);
    }

    if (sectorNumber % 5 > 2) {
      this.translatePoints([p1, p2, p3], -0.25, fullHeight, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], leftSideOfEquilateralVector, -faceBendAngle);
      this.translatePoints([p1, p2, p3], 0.25, -fullHeight, 0);
    }

    this.translatePoints([p1, p2, p3], 0, (0.5 * fullHeight) + ((1/3) * fullHeight), -this.getInradius());

    if (spherizeAmount !== 0) {
      const nrmP1: THREE.Vector3 = new THREE.Vector3().copy(p1);
      const nrmP2: THREE.Vector3 = new THREE.Vector3().copy(p2);
      const nrmP3: THREE.Vector3 = new THREE.Vector3().copy(p3);
      this.normalizePoints([nrmP1, nrmP2, nrmP3]);

      const nrmDiffP1: THREE.Vector3 = new THREE.Vector3().copy(nrmP1).sub(p1);
      const nrmDiffP2: THREE.Vector3 = new THREE.Vector3().copy(nrmP2).sub(p2);
      const nrmDiffP3: THREE.Vector3 = new THREE.Vector3().copy(nrmP3).sub(p3);

      nrmDiffP1.multiply(new THREE.Vector3(spherizeAmount, spherizeAmount, spherizeAmount));
      nrmDiffP2.multiply(new THREE.Vector3(spherizeAmount, spherizeAmount, spherizeAmount));
      nrmDiffP3.multiply(new THREE.Vector3(spherizeAmount, spherizeAmount, spherizeAmount));

      p1.add(nrmDiffP1);
      p2.add(nrmDiffP2);
      p3.add(nrmDiffP3);
    }

    this.scalePoints([p1, p2, p3], 1, 1, 1);
    

    return [
      -p1.x, p1.y, p1.z,
      -p2.x, p2.y, p2.z,
      -p3.x, p3.y, p3.z
    ];
  }

  getIcosadronSectorArray(subdivisions: number = 0, sectorNumber: number = 0, spherizeAmount: number = 0): number[] {
    const vertexArray = [];

    let cols: number = subdivisions;
    let rows: number = 2 * subdivisions;
    for (let i = 0; i <= rows; i++) {
      for (let j = 0; j <= cols; j++) {
        if (i % 2 === 1 && j == 0) {
          cols--;
        }
        vertexArray.push(...this.getMappedTriangleFromPoint(j, i, subdivisions, sectorNumber, spherizeAmount));
      }
    }

    return vertexArray;
  }

  rotateAroundAxis(vector: THREE.Vector3, axis: THREE.Vector3, angleInRadians: number): THREE.Vector3 {
    return vector.applyAxisAngle( axis, angleInRadians );
  }

  getTriangleFromPoint2(x: number, y: number, subdivisions: number, sectorNumber: number = 0): number[] {
  
    const fullHeight: number = 0.5 * Math.sqrt(3) * 1;
    const maxTrianglesWide: number = subdivisions + 1;
    const maxTrianglesHigh: number = 2 * subdivisions + 1;
    const rowH = Math.ceil(maxTrianglesHigh / 2);

    const sectorColumnNumber: number = Math.floor((sectorNumber + 5) / 10);
    const sectorYOffset: number = -sectorColumnNumber * fullHeight;
    const sectorXOffset: number = sectorNumber % 5 - (Math.floor((sectorNumber) / 5) % 2) * 0.5;
    const flip: number = sectorNumber >= 10 ? -1 : 1;

    const xOffset: number = sectorXOffset + -0.5 + (Math.ceil(y / 2) * 0.5) / maxTrianglesWide;
    const yOffset: number = sectorYOffset + -(fullHeight / 2) + (Math.floor(y / 2) / rowH * fullHeight);
    const yUpperOffset: number = sectorYOffset + -(fullHeight / 2) + (Math.floor(y / 2) + 1) / rowH * fullHeight;
    const yIsEven: boolean = y % 2 === 0;

    let p1: THREE.Vector3;
    let p2: THREE.Vector3;
    let p3: THREE.Vector3;

    if (yIsEven) {
      p1 = new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset, 0.0);
      p2 = new THREE.Vector3(0.0 + xOffset + (x + 1) / maxTrianglesWide, 0.0 + yOffset, 0.0);
      p3 = new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yUpperOffset, 0.0);
    } else {
      p1 = new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yUpperOffset, 0.0);
      p2 = new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset, 0.0);
      p3 = new THREE.Vector3(0.0 + xOffset + (x + 1) / maxTrianglesWide, 0.0 + yUpperOffset, 0.0);
    }

    const zAxis: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
    
    if (flip === -1 ) {
      // console.log('preflip', p1, p2, p3);
      const p1Copy: THREE.Vector3 = new THREE.Vector3().copy(p1);
      const p2Copy: THREE.Vector3 = new THREE.Vector3().copy(p2);
      const p3Copy: THREE.Vector3 = new THREE.Vector3().copy(p3);

      // p1.x = p2Copy.x;
      // p2.x = p1Copy.x;

      // p1.y = p3Copy.y;
      // p2.y = p3Copy.y;
      // p3.y = p1Copy.y;

      const translateY: number = sectorColumnNumber * fullHeight;
      const translateX: number = (sectorNumber % 5 - (sectorColumnNumber - 1) / 2);

      this.translatePoints([p1, p2, p3], -translateX, translateY, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], zAxis, 180 * Math.PI / 180);
      this.translatePoints([p1, p2, p3], translateX, -translateY, 0);

      // console.log(x, y, p1Copy.sub(p1), p2Copy.sub(p2), p3Copy.sub(p3));
      // console.log('postflip', p1, p2, p3);
    }
    

    this.translatePoints([p1, p2, p3], -2, 0, 0);

    return [
      p1.x, p1.y, p1.z,
      p2.x, p2.y, p2.z,
      p3.x, p3.y, p3.z
    ];
  }

  getPentagonTrianglesFromPoint(sectorNumber: number, x: number, y: number, subdivisions: number): number[] {

    const subdivisionsAdd1: number = subdivisions + 1;
    const fullHeight: number = 0.5 * Math.sqrt(3) * 1;
    const maxTrianglesWide: number = subdivisionsAdd1;
    const maxTrianglesHigh: number = 2 * subdivisionsAdd1;
    const rowH = Math.ceil(maxTrianglesHigh / 2);

    const xOffset: number = -0.5 + (Math.ceil(y / 2) * 0.5) / maxTrianglesWide;
    const yOffset: number = -(fullHeight / 2) + (Math.floor(y / 2) / rowH * fullHeight);

    let p1: THREE.Vector3 = new THREE.Vector3();
    let p2: THREE.Vector3 = new THREE.Vector3();
    let p3: THREE.Vector3 = new THREE.Vector3();

    let p4: THREE.Vector3 = new THREE.Vector3();
    let p5: THREE.Vector3 = new THREE.Vector3();
    let p6: THREE.Vector3 = new THREE.Vector3();

    let p7: THREE.Vector3 = new THREE.Vector3();
    let p8: THREE.Vector3 = new THREE.Vector3();
    let p9: THREE.Vector3 = new THREE.Vector3();

    let p10: THREE.Vector3 = new THREE.Vector3();
    let p11: THREE.Vector3 = new THREE.Vector3();
    let p12: THREE.Vector3 = new THREE.Vector3();

    let p13: THREE.Vector3 = new THREE.Vector3();
    let p14: THREE.Vector3 = new THREE.Vector3();
    let p15: THREE.Vector3 = new THREE.Vector3();

    let p16: THREE.Vector3 = new THREE.Vector3();
    let p17: THREE.Vector3 = new THREE.Vector3();
    let p18: THREE.Vector3 = new THREE.Vector3();

    let p19: THREE.Vector3 = new THREE.Vector3();
    let p20: THREE.Vector3 = new THREE.Vector3();
    let p21: THREE.Vector3 = new THREE.Vector3();

    let p22: THREE.Vector3 = new THREE.Vector3();
    let p23: THREE.Vector3 = new THREE.Vector3();
    let p24: THREE.Vector3 = new THREE.Vector3();

    let p25: THREE.Vector3 = new THREE.Vector3();
    let p26: THREE.Vector3 = new THREE.Vector3();
    let p27: THREE.Vector3 = new THREE.Vector3();

    let p28: THREE.Vector3 = new THREE.Vector3();
    let p29: THREE.Vector3 = new THREE.Vector3();
    let p30: THREE.Vector3 = new THREE.Vector3();

    const midpointHeight: number = (Math.sqrt(3) / 6) / subdivisionsAdd1;
    const halfSubdividedTriHeight: number = fullHeight / subdivisionsAdd1 / 2;
    const hexCenterPoint: THREE.Vector3 = new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset, 0.0);

    p1 = hexCenterPoint.clone();
    p2 = new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset + midpointHeight, 0.0);
    p3 = new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset + halfSubdividedTriHeight, 0.0);

    p4 = hexCenterPoint.clone();
    p5 = new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset, 0.0);
    p6 = new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset + midpointHeight, 0.0);

    p7 = hexCenterPoint.clone();
    p8 = new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset - midpointHeight, 0.0);
    p9 = new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset, 0.0);

    p10 = hexCenterPoint.clone();
    p11 = new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset - halfSubdividedTriHeight, 0.0);
    p12 = new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset - midpointHeight, 0.0);  
    
    p13 = hexCenterPoint.clone();
    p14 = new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset - 2 * midpointHeight, 0.0);
    p15 = new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset - halfSubdividedTriHeight, 0.0);

    p16 = hexCenterPoint.clone();
    p17 = new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset - halfSubdividedTriHeight, 0.0);
    p18 = new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset - 2 * midpointHeight, 0.0);

    p19 = hexCenterPoint.clone();
    p20 = new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset - midpointHeight, 0.0);
    p21 = new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset - halfSubdividedTriHeight, 0.0);

    p22 = hexCenterPoint.clone();
    p23 = new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset, 0.0);
    p24 = new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset - midpointHeight, 0.0);

    p25 = hexCenterPoint.clone();
    p26 = new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset + midpointHeight, 0.0);
    p27 = new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset, 0.0);

    p25 = hexCenterPoint.clone();
    p26 = new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset + midpointHeight, 0.0);
    p27 = new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset, 0.0);

    p28 = hexCenterPoint.clone();
    p29 = new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset + halfSubdividedTriHeight, 0.0);
    p30 = new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset + midpointHeight, 0.0);

    let xTranslationOffset: number = 0.5 - Math.floor(x / subdivisionsAdd1);
    let outOfBoundsOffset: number = Math.max(xTranslationOffset, 0) * 10;
    const faceBendAngle: number = Math.PI / 3;
    const points: THREE.Vector3[] = [
      p1, p2, p3,
      p4, p5, p6,
      p7, p8, p9,
      p10, p11, p12,
      p13, p14, p15,
      p16, p17, p18,
      p19, p20, p21,
      p22, p23, p24,
      p25, p26, p27,
      p28, p29, p30
    ]

    for (let i = 0; i < points.length; i++) {
      const point1: THREE.Vector3 = points[i++];
      const point2: THREE.Vector3 = points[i++];
      const point3: THREE.Vector3 = points[i];

      if (this.icosahedronUtilsService.pointIsOutOfBounds(point1) || this.icosahedronUtilsService.pointIsOutOfBounds(point2) || this.icosahedronUtilsService.pointIsOutOfBounds(point3)) {
        if (sectorNumber === 0 && x === 0 && y === 0) { // sector 0 bottom left          
            this.translatePoints([
              point1, point2, point3
            ], -xTranslationOffset + outOfBoundsOffset + 0.5, 0.0, 0);
          
        } else if (sectorNumber === 5) { // sector 5 bottom left
          this.translatePoints([
            point1, point2, point3
          ], xTranslationOffset + 2.0, 1.5 * fullHeight, 0);

          this.rotatePointsAroundAxis([
            point1, point2, point3
          ], EQUILATERAL_AXIS.Z_AXIS, -faceBendAngle);

          this.translatePoints([
            point1, point2, point3
          ], -(xTranslationOffset + 2.0) + 0.75 + outOfBoundsOffset, -0.0 * fullHeight, 0);
        }
      }

      // sectors 6 thru 9 bottom left
      // if (sectorNumber > 5 && sectorNumber < 10 && !this.icosahedronUtilsService.allPointsInSectors([point1, point2, point3], [sectorNumber]) && !this.icosahedronUtilsService.allPointsInSectors([point1, point2, point3], [sectorNumber + 10])) {
      //   this.translatePoints([
      //     point1, point2, point3
      //   ], xTranslationOffset + 2.0, 1.5 * fullHeight, 0);

      //   this.rotatePointsAroundAxis([
      //     point1, point2, point3
      //   ], EQUILATERAL_AXIS.Z_AXIS, -faceBendAngle);

      //   this.translatePoints([
      //     point1, point2, point3
      //   ], -(xTranslationOffset + 2.0) + 0.75 + outOfBoundsOffset, -0.0 * fullHeight, 0);
      // }
      if (sectorNumber > 5 && sectorNumber < 10) {
        this.translatePoints([point1, point2, point3], xTranslationOffset + 0.5, 1.5 * fullHeight, 0);
        this.rotatePointsAroundAxis([point1, point2, point3], EQUILATERAL_AXIS.Z_AXIS, 180 * Math.PI / 180);
        this.translatePoints([point1, point2, point3], -(xTranslationOffset + 0.5), -1.5 * fullHeight, 0);
      }
      

      if (sectorNumber === 0 && !(x === 0 && y === 0)) { // sectors 0 thru 4 top
        let netTopSegmentRotation: number = 2 - Math.floor(i / 6); // Math.floor(i / 6) - 3; // 6 points per top segment
        let netTopSegmentXTranslation: number = (netTopSegmentRotation + 5) % 5;

        this.translatePoints([
          point1, point2, point3
        ], xTranslationOffset - 0.5, -0.5 * fullHeight, 0);

        this.rotatePointsAroundAxis([
          point1, point2, point3
        ], EQUILATERAL_AXIS.Z_AXIS, -(netTopSegmentRotation) * faceBendAngle);

        this.translatePoints([
          point1, point2, point3
        ], -(xTranslationOffset - 0.5) + netTopSegmentXTranslation, 0.5 * fullHeight, 0);
      }

      if (sectorNumber === 15) {
        let netTopSegmentRotation: number = Math.floor(i / 6) + 1; // Math.floor(i / 6) - 3; // 6 points per top segment
        let netTopSegmentXTranslation: number = (netTopSegmentRotation + 5) % 5;

        this.translatePoints([
          point1, point2, point3
        ], xTranslationOffset + 1.0, 2.5 * fullHeight, 0);

        this.rotatePointsAroundAxis([
          point1, point2, point3
        ], EQUILATERAL_AXIS.Z_AXIS, -(netTopSegmentRotation) * -faceBendAngle);

        this.translatePoints([
          point1, point2, point3
        ], -(xTranslationOffset + 1.0) + netTopSegmentXTranslation, -2.5 * fullHeight, 0);
      }
    }

    this.translatePoints([
      p1, p2, p3,
      p4, p5, p6,
      p7, p8, p9,
      p10, p11, p12,
      p13, p14, p15,
      p16, p17, p18,
      p19, p20, p21,
      p22, p23, p24,
      p25, p26, p27,
      p28, p29, p30
    ], -2, 0, 0);

    return [
      p1.x, p1.y, p1.z,
      p2.x, p2.y, p2.z,
      p3.x, p3.y, p3.z,
      
      p4.x, p4.y, p4.z,
      p5.x, p5.y, p5.z,
      p6.x, p6.y, p6.z,

      p7.x, p7.y, p7.z,
      p8.x, p8.y, p8.z,
      p9.x, p9.y, p9.z,

      p10.x, p10.y, p10.z,
      p11.x, p11.y, p11.z,
      p12.x, p12.y, p12.z,

      p13.x, p13.y, p13.z,
      p14.x, p14.y, p14.z,
      p15.x, p15.y, p15.z,

      p16.x, p16.y, p16.z,
      p17.x, p17.y, p17.z,
      p18.x, p18.y, p18.z,

      p19.x, p19.y, p19.z,
      p20.x, p20.y, p20.z,
      p21.x, p21.y, p21.z,

      p22.x, p22.y, p22.z,
      p23.x, p23.y, p23.z,
      p24.x, p24.y, p24.z,

      p25.x, p25.y, p25.z,
      p26.x, p26.y, p26.z,
      p27.x, p27.y, p27.z,

      p28.x, p28.y, p28.z,
      p29.x, p29.y, p29.z,
      p30.x, p30.y, p30.z
    ];
  }

  getHexTrianglesFromPoint(x: number, y: number, subdivisions: number): number[] {
    
    const subdivisionsAdd1: number = subdivisions + 1;
    const fullHeight: number = 0.5 * Math.sqrt(3) * 1;
    const maxTrianglesWide: number = subdivisionsAdd1;
    const maxTrianglesHigh: number = 2 * subdivisionsAdd1;
    const rowH = Math.ceil(maxTrianglesHigh / 2);

    const xOffset: number = -0.5 + (Math.ceil(y / 2) * 0.5) / maxTrianglesWide;
    const yOffset: number = -(fullHeight / 2) + (Math.floor(y / 2) / rowH * fullHeight);

    let p1: THREE.Vector3 = new THREE.Vector3();
    let p2: THREE.Vector3 = new THREE.Vector3();
    let p3: THREE.Vector3 = new THREE.Vector3();

    let p4: THREE.Vector3 = new THREE.Vector3();
    let p5: THREE.Vector3 = new THREE.Vector3();
    let p6: THREE.Vector3 = new THREE.Vector3();

    let p7: THREE.Vector3 = new THREE.Vector3();
    let p8: THREE.Vector3 = new THREE.Vector3();
    let p9: THREE.Vector3 = new THREE.Vector3();

    let p10: THREE.Vector3 = new THREE.Vector3();
    let p11: THREE.Vector3 = new THREE.Vector3();
    let p12: THREE.Vector3 = new THREE.Vector3();

    let p13: THREE.Vector3 = new THREE.Vector3();
    let p14: THREE.Vector3 = new THREE.Vector3();
    let p15: THREE.Vector3 = new THREE.Vector3();

    let p16: THREE.Vector3 = new THREE.Vector3();
    let p17: THREE.Vector3 = new THREE.Vector3();
    let p18: THREE.Vector3 = new THREE.Vector3();

    let p19: THREE.Vector3 = new THREE.Vector3();
    let p20: THREE.Vector3 = new THREE.Vector3();
    let p21: THREE.Vector3 = new THREE.Vector3();

    let p22: THREE.Vector3 = new THREE.Vector3();
    let p23: THREE.Vector3 = new THREE.Vector3();
    let p24: THREE.Vector3 = new THREE.Vector3();

    let p25: THREE.Vector3 = new THREE.Vector3();
    let p26: THREE.Vector3 = new THREE.Vector3();
    let p27: THREE.Vector3 = new THREE.Vector3();

    let p28: THREE.Vector3 = new THREE.Vector3();
    let p29: THREE.Vector3 = new THREE.Vector3();
    let p30: THREE.Vector3 = new THREE.Vector3();

    let p31: THREE.Vector3 = new THREE.Vector3();
    let p32: THREE.Vector3 = new THREE.Vector3();
    let p33: THREE.Vector3 = new THREE.Vector3();

    let p34: THREE.Vector3 = new THREE.Vector3();
    let p35: THREE.Vector3 = new THREE.Vector3();
    let p36: THREE.Vector3 = new THREE.Vector3();

    const midpointHeight: number = (Math.sqrt(3) / 6) / subdivisionsAdd1;
    const halfSubdividedTriHeight: number = fullHeight / subdivisionsAdd1 / 2;
    const hexCenterPoint: THREE.Vector3 = new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset, 0.0);

    p1 = hexCenterPoint.clone();
    p2 = new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset + midpointHeight, 0.0);
    p3 = new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset + halfSubdividedTriHeight, 0.0);

    p4 = hexCenterPoint.clone();
    p5 = new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset, 0.0);
    p6 = new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset + midpointHeight, 0.0);

    p7 = hexCenterPoint.clone();
    p8 = new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset - midpointHeight, 0.0);
    p9 = new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset, 0.0);

    p10 = hexCenterPoint.clone();
    p11 = new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset - halfSubdividedTriHeight, 0.0);
    p12 = new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset - midpointHeight, 0.0);

    p13 = hexCenterPoint.clone();
    p14 = new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset - 2 * midpointHeight, 0.0);
    p15 = new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset - halfSubdividedTriHeight, 0.0);

    p16 = hexCenterPoint.clone();
    p17 = new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset - halfSubdividedTriHeight, 0.0);
    p18 = new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset - 2 * midpointHeight, 0.0);

    p19 = hexCenterPoint.clone();
    p20 = new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset - midpointHeight, 0.0);
    p21 = new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset - halfSubdividedTriHeight, 0.0);

    p22 = hexCenterPoint.clone();
    p23 = new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset, 0.0);
    p24 = new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset - midpointHeight, 0.0);

    p25 = hexCenterPoint.clone();
    p26 = new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset + midpointHeight, 0.0);
    p27 = new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset, 0.0);

    p25 = hexCenterPoint.clone();
    p26 = new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset + midpointHeight, 0.0);
    p27 = new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset, 0.0);

    p28 = hexCenterPoint.clone();
    p29 = new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset + halfSubdividedTriHeight, 0.0);
    p30 = new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset + midpointHeight, 0.0);

    p31 = hexCenterPoint.clone();
    p32 = new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset + 2 * midpointHeight, 0.0);
    p33 = new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset + halfSubdividedTriHeight, 0.0);

    p34 = hexCenterPoint.clone();
    p35 = new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset + halfSubdividedTriHeight, 0.0);
    p36 = new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset + 2 * midpointHeight, 0.0);

    let xTranslationOffset: number = 0.5 - Math.floor(x / subdivisionsAdd1);
    let outOfBoundsOffset: number = Math.max(xTranslationOffset, 0) * 10;
    const faceBendAngle: number = Math.PI / 3;
    const points: THREE.Vector3[] = [
      p1, p2, p3,
      p4, p5, p6,
      p7, p8, p9,
      p10, p11, p12,
      p13, p14, p15,
      p16, p17, p18,
      p19, p20, p21,
      p22, p23, p24,
      p25, p26, p27,
      p28, p29, p30,
      p31, p32, p33,
      p34, p35, p36
    ]

    for (let i = 0; i < points.length; i++) {
      const point1: THREE.Vector3 = points[i++];
      const point2: THREE.Vector3 = points[i++];
      const point3: THREE.Vector3 = points[i];

      if (this.icosahedronUtilsService.pointIsOutOfBounds(point1) || this.icosahedronUtilsService.pointIsOutOfBounds(point2) || this.icosahedronUtilsService.pointIsOutOfBounds(point3)) {
        
        // hexCenterPointSectors
        if (hexCenterPoint.y >= -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT) { // sectors 0 to 4
          this.translatePoints([
            point1, point2, point3
          ], xTranslationOffset, fullHeight / 2, 0);
          
          this.rotatePointsAroundAxis([
            point1, point2, point3
          ], EQUILATERAL_AXIS.Z_AXIS, faceBendAngle);
        
          this.translatePoints([
            point1, point2, point3
          ], -xTranslationOffset + outOfBoundsOffset, -fullHeight / 2, 0);
          // console.log('any');
        } else if (hexCenterPoint.y >= -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT) { // sector 5
          this.translatePoints([
            point1, point2, point3
          ], -xTranslationOffset + outOfBoundsOffset + 0.5, 0.0, 0);
        } else { // sectors 15 to 19
          this.translatePoints([
            point1, point2, point3
          ], xTranslationOffset + 2.0, 1.5 * fullHeight, 0);

          this.rotatePointsAroundAxis([
            point1, point2, point3
          ], EQUILATERAL_AXIS.Z_AXIS, -faceBendAngle);

          this.translatePoints([
            point1, point2, point3
          ], -(xTranslationOffset + 2.0) + 0.75 + outOfBoundsOffset, -0.0 * fullHeight, 0);
        }
      } 
    }

    this.translatePoints([
      p1, p2, p3,
      p4, p5, p6,
      p7, p8, p9,
      p10, p11, p12,
      p13, p14, p15,
      p16, p17, p18,
      p19, p20, p21,
      p22, p23, p24,
      p25, p26, p27,
      p28, p29, p30,
      p31, p32, p33,
      p34, p35, p36
    ], -2, 0, 0);

    return [
      p1.x, p1.y, p1.z,
      p2.x, p2.y, p2.z,
      p3.x, p3.y, p3.z,
      
      p4.x, p4.y, p4.z,
      p5.x, p5.y, p5.z,
      p6.x, p6.y, p6.z,

      p7.x, p7.y, p7.z,
      p8.x, p8.y, p8.z,
      p9.x, p9.y, p9.z,

      p10.x, p10.y, p10.z,
      p11.x, p11.y, p11.z,
      p12.x, p12.y, p12.z,

      p13.x, p13.y, p13.z,
      p14.x, p14.y, p14.z,
      p15.x, p15.y, p15.z,

      p16.x, p16.y, p16.z,
      p17.x, p17.y, p17.z,
      p18.x, p18.y, p18.z,

      p19.x, p19.y, p19.z,
      p20.x, p20.y, p20.z,
      p21.x, p21.y, p21.z,

      p22.x, p22.y, p22.z,
      p23.x, p23.y, p23.z,
      p24.x, p24.y, p24.z,

      p25.x, p25.y, p25.z,
      p26.x, p26.y, p26.z,
      p27.x, p27.y, p27.z,

      p28.x, p28.y, p28.z,
      p29.x, p29.y, p29.z,
      p30.x, p30.y, p30.z,

      p31.x, p31.y, p31.z,
      p32.x, p32.y, p32.z,
      p33.x, p33.y, p33.z,

      p34.x, p34.y, p34.z,
      p35.x, p35.y, p35.z,
      p36.x, p36.y, p36.z,
    ];
  }

  getHexQuadTrianglesFromPoint(x: number, y: number, subdivisions: number): number[] {
    
    const oddDivisions: number = this.quadDivisions * 2 - 1; // only odd divisions line up with pentagons
    const subdivisionsAdd1: number = subdivisions + 1;
    const fullHeight: number = 0.5 * Math.sqrt(3) * 1;
    const maxTrianglesWide: number = subdivisionsAdd1;
    const maxTrianglesHigh: number = 2 * subdivisionsAdd1;
    const rowH = Math.ceil(maxTrianglesHigh / 2);

    const xOffset: number = -0.5 + (Math.ceil(y / 2) * 0.5) / maxTrianglesWide;
    const yOffset: number = -(fullHeight / 2) + (Math.floor(y / 2) / rowH * fullHeight);

    const midpointHeight: number = (Math.sqrt(3) / 6) / subdivisionsAdd1;
    const hexCenterPoint: THREE.Vector3 = new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset, 0.0);

    let quadAnchors: THREE.Vector3[] = [];
    let quadDiffs: THREE.Vector3[] = [];
    let points: THREE.Vector3[] = [];
    const quadsWide: number = oddDivisions + 1;
    const quadsHigh: number = quadsWide;

    const hexRegions: THREE.Vector3[][] = [
      [
        hexCenterPoint.clone(),
        new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset + midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset + 2 * midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset + midpointHeight, 0.0)
      ],
      [
        new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset - 2 * midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset - midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset + midpointHeight, 0.0),
        hexCenterPoint.clone(),
      ],
      [
        new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset + midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset - midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset - 2 * midpointHeight, 0.0),
        hexCenterPoint.clone()
      ]
    ];

    for (let j = 0; j < oddDivisions + 1; j++) {
      for (let i = 0; i < oddDivisions + 1; i++) {

        const xPosOffset: number = i / quadsWide;
        const yPosOffset: number = j / quadsHigh;
        const splitPerc: number = 1 / (oddDivisions + 1);
        
        for (let k = 0; k < hexRegions.length; k++) {

          quadAnchors = hexRegions[k];

          quadDiffs = [
            new THREE.Vector3().copy(quadAnchors[0]).sub(quadAnchors[1]),
            new THREE.Vector3().copy(quadAnchors[0]).sub(quadAnchors[3]),
          ];          

          points.push(
          
            // triangle 1 of quad
            new THREE.Vector3(
              quadAnchors[0].x - xPosOffset * quadDiffs[0].x - yPosOffset * quadDiffs[1].x,
              quadAnchors[0].y - xPosOffset * quadDiffs[0].y - yPosOffset * quadDiffs[1].y,
              0
            ),
            new THREE.Vector3(
              quadAnchors[0].x - splitPerc * quadDiffs[0].x - xPosOffset * quadDiffs[0].x - yPosOffset * quadDiffs[1].x,
              quadAnchors[0].y - splitPerc * quadDiffs[0].y - xPosOffset * quadDiffs[0].y - yPosOffset * quadDiffs[1].y,
              0
            ),
            new THREE.Vector3(
              quadAnchors[0].x - splitPerc * quadDiffs[0].x - splitPerc * quadDiffs[1].x - xPosOffset * quadDiffs[0].x - yPosOffset * quadDiffs[1].x,
              quadAnchors[0].y - splitPerc * quadDiffs[0].y - splitPerc * quadDiffs[1].y - xPosOffset * quadDiffs[0].y - yPosOffset * quadDiffs[1].y,
              0
            ),

            // triangle 2 of quad
            new THREE.Vector3(
              quadAnchors[0].x - xPosOffset * quadDiffs[0].x - yPosOffset * quadDiffs[1].x,
              quadAnchors[0].y - xPosOffset * quadDiffs[0].y - yPosOffset * quadDiffs[1].y,
              0
            ),
            new THREE.Vector3(
              quadAnchors[0].x - splitPerc * quadDiffs[0].x - splitPerc * quadDiffs[1].x - xPosOffset * quadDiffs[0].x - yPosOffset * quadDiffs[1].x,
              quadAnchors[0].y - splitPerc * quadDiffs[0].y - splitPerc * quadDiffs[1].y - xPosOffset * quadDiffs[0].y - yPosOffset * quadDiffs[1].y,
              0
            ),
            new THREE.Vector3(
              quadAnchors[0].x - splitPerc * quadDiffs[1].x - xPosOffset * quadDiffs[0].x - yPosOffset * quadDiffs[1].x,
              quadAnchors[0].y - splitPerc * quadDiffs[1].y - xPosOffset * quadDiffs[0].y - yPosOffset * quadDiffs[1].y,
              0
            )
            
          );
          }

      }
    }

    let xTranslationOffset: number = 0.5 - Math.floor(x / subdivisionsAdd1);
    let outOfBoundsOffset: number = Math.max(xTranslationOffset, 0) * 10;
    const faceBendAngle: number = Math.PI / 3;

    for (let i = 0; i < points.length; i++) {
      const point1: THREE.Vector3 = points[i];

      if (this.icosahedronUtilsService.pointIsOutOfBounds(point1)) {
        
        if (hexCenterPoint.y >= -0.5 * EQUILATERAL_AXIS.FULL_HEIGHT) { // sectors 0 to 4

          this.translatePoints([point1], xTranslationOffset, fullHeight / 2, 0);
          this.rotatePointsAroundAxis([point1], EQUILATERAL_AXIS.Z_AXIS, faceBendAngle);
          this.translatePoints([point1], -xTranslationOffset + outOfBoundsOffset, -fullHeight / 2, 0);

        } else if (hexCenterPoint.y >= -1.5 * EQUILATERAL_AXIS.FULL_HEIGHT) { // sector 5

          this.translatePoints([point1], -xTranslationOffset + outOfBoundsOffset + 0.5, 0.0, 0);

        } else { // sectors 15 to 19

          this.translatePoints([point1], xTranslationOffset + 2.0, 1.5 * fullHeight, 0);
          this.rotatePointsAroundAxis([point1], EQUILATERAL_AXIS.Z_AXIS, -faceBendAngle);
          this.translatePoints([point1], -(xTranslationOffset + 2.0) + 0.75 + outOfBoundsOffset, -0.0 * fullHeight, 0);

        }
      } 
    }

    this.translatePoints(points, -2, 0, 0);

    const flattendPoints: number[] = points.reduce((prev: number[], curr: THREE.Vector3) => {
      return prev.concat([curr.x, curr.y, curr.z]);
    }, []);

    return flattendPoints;
  }

  getPentagonQuadTrianglesFromPoint(sectorNumber: number, x: number, y: number, subdivisions: number): number[] {
    
    const oddDivisions: number = this.quadDivisions - 1; // only odd divisions line up with pentagons
    const subdivisionsAdd1: number = subdivisions + 1;
    const fullHeight: number = 0.5 * Math.sqrt(3) * 1;
    const maxTrianglesWide: number = subdivisionsAdd1;
    const maxTrianglesHigh: number = 2 * subdivisionsAdd1;
    const rowH = Math.ceil(maxTrianglesHigh / 2);

    const xOffset: number = -0.5 + (Math.ceil(y / 2) * 0.5) / maxTrianglesWide;
    const yOffset: number = -(fullHeight / 2) + (Math.floor(y / 2) / rowH * fullHeight);

    const midpointHeight: number = (Math.sqrt(3) / 6) / subdivisionsAdd1;

    let quadAnchors: THREE.Vector3[] = [];
    let quadDiffs: THREE.Vector3[] = [];
    let points: THREE.Vector3[] = [];
    const quadsWide: number = oddDivisions + 1;
    const quadsHigh: number = quadsWide;
    const halfSubdividedTriHeight: number = fullHeight / subdivisionsAdd1 / 2;

    const outerPentagonRegions: THREE.Vector3[][] = [
      [
        new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset + 0.5 * midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset + midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset + halfSubdividedTriHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x + 0.125) / maxTrianglesWide, 0.0 + yOffset + 0.5 * halfSubdividedTriHeight, 0.0)
      ],
      [
        new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset + 0.5 * midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset + midpointHeight, 0.0),
      ],
      [
        new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset - 0.5 * midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset - midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset, 0.0)
      ],
      [
        new THREE.Vector3(0.0 + xOffset + (x + 0.125) / maxTrianglesWide, 0.0 + yOffset - 0.5 * halfSubdividedTriHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset - halfSubdividedTriHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset - midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset - 0.5 * midpointHeight, 0.0)
      ],
      [
        new THREE.Vector3(0.0 + xOffset + (x + 0.125) / maxTrianglesWide, 0.0 + yOffset - 0.5 * halfSubdividedTriHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset - midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset - 2 * midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset - halfSubdividedTriHeight, 0.0)
      ],
      [
        new THREE.Vector3(0.0 + xOffset + (x - 0.125) / maxTrianglesWide, 0.0 + yOffset - 0.5 * halfSubdividedTriHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset - halfSubdividedTriHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset - 2 * midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset - midpointHeight, 0.0)
      ],
      [
        new THREE.Vector3(0.0 + xOffset + (x - 0.125) / maxTrianglesWide, 0.0 + yOffset - 0.5 * halfSubdividedTriHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset - 0.5 * midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset - midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset - halfSubdividedTriHeight, 0.0),
      ],
      [
        new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset - 0.5 * midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset - midpointHeight, 0.0)
      ],
      [
        new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset + 0.5 * midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset + midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset, 0.0)
      ],
      [
        new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset + 0.5 * midpointHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x - 0.125) / maxTrianglesWide, 0.0 + yOffset + 0.5 * halfSubdividedTriHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset + halfSubdividedTriHeight, 0.0),
        new THREE.Vector3(0.0 + xOffset + (x - 0.5) / maxTrianglesWide, 0.0 + yOffset + midpointHeight, 0.0)
      ]
    ];

    const innerPentagonRegions: THREE.Vector3[][] = [
        [
          new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset, 0.0),
          new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset, 0.0),
          new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset + 0.5 * midpointHeight, 0.0),
          new THREE.Vector3(0.0 + xOffset + (x + 0.125) / maxTrianglesWide, 0.0 + yOffset + 0.5 * halfSubdividedTriHeight, 0.0)
        ],
        [
          new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset, 0.0),
          new THREE.Vector3(0.0 + xOffset + (x + 0.125) / maxTrianglesWide, 0.0 + yOffset - 0.5 * halfSubdividedTriHeight, 0.0),
          new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset - 0.5 * midpointHeight, 0.0),
          new THREE.Vector3(0.0 + xOffset + (x + 0.25) / maxTrianglesWide, 0.0 + yOffset, 0.0)
        ],
        [
          new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset, 0.0),
          new THREE.Vector3(0.0 + xOffset + (x - 0.125) / maxTrianglesWide, 0.0 + yOffset - 0.5 * halfSubdividedTriHeight, 0.0),
          new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset - midpointHeight, 0.0),
          new THREE.Vector3(0.0 + xOffset + (x + 0.125) / maxTrianglesWide, 0.0 + yOffset - 0.5 * halfSubdividedTriHeight, 0.0)
        ],
        [
          new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset, 0.0),
          new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset, 0.0),
          new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset - 0.5 * midpointHeight, 0.0),
          new THREE.Vector3(0.0 + xOffset + (x - 0.125) / maxTrianglesWide, 0.0 + yOffset - 0.5 * halfSubdividedTriHeight, 0.0),
        ],
        [
          new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset, 0.0),
          new THREE.Vector3(0.0 + xOffset + (x - 0.125) / maxTrianglesWide, 0.0 + yOffset + 0.5 * halfSubdividedTriHeight, 0.0),
          new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset + 0.5 * midpointHeight, 0.0),
          new THREE.Vector3(0.0 + xOffset + (x - 0.25) / maxTrianglesWide, 0.0 + yOffset, 0.0),       
        ]

    ];

    for (let j = 0; j < oddDivisions + 1; j++) {
      for (let i = 0; i < oddDivisions + 1; i++) {

        const quadWidthIncrement: number = 1 / quadsWide;
        const quadHeightIncrement: number = 1 / quadsHigh;
        const xPosOffset: number = i / quadsWide;
        const yPosOffset: number = j / quadsHigh;
        
        for (let k = 0; k < outerPentagonRegions.length; k++) {

          quadAnchors = outerPentagonRegions[k];

          quadDiffs = [
            new THREE.Vector3().copy(quadAnchors[0]).sub(quadAnchors[1]),
            new THREE.Vector3().copy(quadAnchors[0]).sub(quadAnchors[3]),
            new THREE.Vector3().copy(quadAnchors[3]).sub(quadAnchors[2]),
            new THREE.Vector3().copy(quadAnchors[1]).sub(quadAnchors[2]),
          ];      
          
          const bottomRightSectionAnchor: THREE.Vector3 = new Vector3(
            quadAnchors[0].x - xPosOffset * quadDiffs[0].x,
            quadAnchors[0].y - xPosOffset * quadDiffs[0].y,
            0
          );
          const bottomLeftSectionAnchor: THREE.Vector3 = new Vector3(
            quadAnchors[3].x - xPosOffset * quadDiffs[2].x,
            quadAnchors[3].y - xPosOffset * quadDiffs[2].y,
            0
          );
          const bottomSectionDiffs: THREE.Vector3 = new THREE.Vector3().copy(bottomRightSectionAnchor).sub(bottomLeftSectionAnchor);

          const topRightSectionAnchor: THREE.Vector3 = new Vector3(
            quadAnchors[0].x - (xPosOffset + quadWidthIncrement) * quadDiffs[0].x,
            quadAnchors[0].y - (xPosOffset + quadWidthIncrement) * quadDiffs[0].y,
            0
          );
          const topLeftSectionAnchor: THREE.Vector3 = new Vector3(
            quadAnchors[3].x - (xPosOffset + quadWidthIncrement) * quadDiffs[2].x,
            quadAnchors[3].y - (xPosOffset + quadWidthIncrement) * quadDiffs[2].y,
            0
          );
          const topSectionDiffs: THREE.Vector3 = new THREE.Vector3().copy(topRightSectionAnchor).sub(topLeftSectionAnchor);

          const pt1: THREE.Vector3 = new THREE.Vector3(
            bottomRightSectionAnchor.x - yPosOffset * bottomSectionDiffs.x,
            bottomRightSectionAnchor.y - yPosOffset * bottomSectionDiffs.y,
            0
          );
          const pt2: THREE.Vector3 = new THREE.Vector3(
            topRightSectionAnchor.x - yPosOffset * topSectionDiffs.x,
            topRightSectionAnchor.y - yPosOffset * topSectionDiffs.y,
            0
          );
          const pt3: THREE.Vector3 = new THREE.Vector3(
            topRightSectionAnchor.x - (yPosOffset + quadHeightIncrement) * topSectionDiffs.x,
            topRightSectionAnchor.y - (yPosOffset + quadHeightIncrement) * topSectionDiffs.y,
            0
          );
          const pt4: THREE.Vector3 = new THREE.Vector3(
            bottomRightSectionAnchor.x - (yPosOffset + quadHeightIncrement) * bottomSectionDiffs.x,
            bottomRightSectionAnchor.y - (yPosOffset + quadHeightIncrement) * bottomSectionDiffs.y,
            0
          );

          points.push(
            pt1,
            pt2,
            pt3,

            new THREE.Vector3().copy(pt1),
            new THREE.Vector3().copy(pt3),
            pt4        
          );
          }

      }
    }

    for (let j = 0; j < oddDivisions + 1; j++) {
      for (let i = 0; i < oddDivisions + 1; i++) {

        const quadWidthIncrement: number = 1 / quadsWide;
        const quadHeightIncrement: number = 1 / quadsHigh;
        const xPosOffset: number = i / quadsWide;
        const yPosOffset: number = j / quadsHigh;
        
        for (let k = 0; k < innerPentagonRegions.length; k++) {

          quadAnchors = innerPentagonRegions[k];

          quadDiffs = [
            new THREE.Vector3().copy(quadAnchors[0]).sub(quadAnchors[1]),
            new THREE.Vector3().copy(quadAnchors[0]).sub(quadAnchors[3]),
            new THREE.Vector3().copy(quadAnchors[3]).sub(quadAnchors[2]),
            new THREE.Vector3().copy(quadAnchors[1]).sub(quadAnchors[2]),
          ];      
          
          const bottomRightSectionAnchor: THREE.Vector3 = new Vector3(
            quadAnchors[0].x - xPosOffset * quadDiffs[0].x,
            quadAnchors[0].y - xPosOffset * quadDiffs[0].y,
            0
          );
          const bottomLeftSectionAnchor: THREE.Vector3 = new Vector3(
            quadAnchors[3].x - xPosOffset * quadDiffs[2].x,
            quadAnchors[3].y - xPosOffset * quadDiffs[2].y,
            0
          );
          const bottomSectionDiffs: THREE.Vector3 = new THREE.Vector3().copy(bottomRightSectionAnchor).sub(bottomLeftSectionAnchor);

          const topRightSectionAnchor: THREE.Vector3 = new Vector3(
            quadAnchors[0].x - (xPosOffset + quadWidthIncrement) * quadDiffs[0].x,
            quadAnchors[0].y - (xPosOffset + quadWidthIncrement) * quadDiffs[0].y,
            0
          );
          const topLeftSectionAnchor: THREE.Vector3 = new Vector3(
            quadAnchors[3].x - (xPosOffset + quadWidthIncrement) * quadDiffs[2].x,
            quadAnchors[3].y - (xPosOffset + quadWidthIncrement) * quadDiffs[2].y,
            0
          );
          const topSectionDiffs: THREE.Vector3 = new THREE.Vector3().copy(topRightSectionAnchor).sub(topLeftSectionAnchor);

          const pt1: THREE.Vector3 = new THREE.Vector3(
            bottomRightSectionAnchor.x - yPosOffset * bottomSectionDiffs.x,
            bottomRightSectionAnchor.y - yPosOffset * bottomSectionDiffs.y,
            0
          );
          const pt2: THREE.Vector3 = new THREE.Vector3(
            topRightSectionAnchor.x - yPosOffset * topSectionDiffs.x,
            topRightSectionAnchor.y - yPosOffset * topSectionDiffs.y,
            0
          );
          const pt3: THREE.Vector3 = new THREE.Vector3(
            topRightSectionAnchor.x - (yPosOffset + quadHeightIncrement) * topSectionDiffs.x,
            topRightSectionAnchor.y - (yPosOffset + quadHeightIncrement) * topSectionDiffs.y,
            0
          );
          const pt4: THREE.Vector3 = new THREE.Vector3(
            bottomRightSectionAnchor.x - (yPosOffset + quadHeightIncrement) * bottomSectionDiffs.x,
            bottomRightSectionAnchor.y - (yPosOffset + quadHeightIncrement) * bottomSectionDiffs.y,
            0
          );

          points.push(
            pt1,
            pt2,
            pt3,

            new THREE.Vector3().copy(pt1),
            new THREE.Vector3().copy(pt3),
            pt4        
          );
          }

      }
    }    

    let xTranslationOffset: number = 0.5 - Math.floor(x / subdivisionsAdd1);
    let outOfBoundsOffset: number = Math.max(xTranslationOffset, 0) * 10;
    const faceBendAngle: number = Math.PI / 3;

    for (let i = 0; i < points.length; i++) {
      const point1: THREE.Vector3 = points[i];

      const validSectors: number[] = this.icosahedronUtilsService.getValidSectorFromPoint(point1);
      let semivalidSectors: number[] = [];
      if (validSectors.length === 0) {
        semivalidSectors = this.icosahedronUtilsService.getSemiValidSectorFromPoint(point1);
      }

      if (this.icosahedronUtilsService.pointIsOutOfBounds(point1)) {

        const BOUNDS: any = ICOSAHEDRON_NET_CONSTS.BOUNDS;
        const firstSemiValidSector: number = semivalidSectors[0];

        const isLeftOfSector0: boolean = 
          firstSemiValidSector === BOUNDS.SECTOR_0_LEFT_BOUNDS ||
          firstSemiValidSector === BOUNDS.SECTOR_5_LEFT_BOUNDS ||
          firstSemiValidSector === BOUNDS.SECTOR_5_UPPER_LEFT_BOUNDS;

        const isLeftOfSector5: boolean = 
          firstSemiValidSector === BOUNDS.SECTOR_5_LEFT_BOUNDS || 
          firstSemiValidSector === BOUNDS.SECTOR_5_LEFT2_BOUNDS ||
          firstSemiValidSector === BOUNDS.SECTOR_15_LEFT2_BOUNDS || 
          firstSemiValidSector === BOUNDS.SECTOR_15_LEFT_BOUNDS;

        if (isLeftOfSector0 && x === 0 && y === 0) { // sector 0 bottom left    
          this.translatePoints([point1], -xTranslationOffset + outOfBoundsOffset + 0.5, 0.0, 0);
          
        } else if (isLeftOfSector5 && x === 0) { // sector 5 bottom left
          this.translatePoints([point1], xTranslationOffset + 2.0, 1.5 * fullHeight, 0);
          this.rotatePointsAroundAxis([point1], EQUILATERAL_AXIS.Z_AXIS, -faceBendAngle);
          this.translatePoints([point1], -(xTranslationOffset + 2.0) + 0.75 + outOfBoundsOffset, -0.0 * fullHeight, 0);
        }
      }
  
      if (sectorNumber > 5 && sectorNumber < 10) {
        // console.log('sectors:', validSectors, semivalidSectors);
        // this.translatePoints([point1], xTranslationOffset + 0.5, 1.5 * fullHeight, 0);
        // this.rotatePointsAroundAxis([point1], EQUILATERAL_AXIS.Z_AXIS, 180 * Math.PI / 180);
        // this.translatePoints([point1], -(xTranslationOffset + 0.5), -1.5 * fullHeight, 0);
      }

      // if (sectorNumber === 0 && !(x === 0 && y === 0)) { // sectors 0 thru 4 top
      //   let netTopSegmentRotation: number = 2 - Math.floor(i / 6); // Math.floor(i / 6) - 3; // 6 points per top segment
      //   let netTopSegmentXTranslation: number = (netTopSegmentRotation + 5) % 5;

      //   this.translatePoints([point1], xTranslationOffset - 0.5, -0.5 * fullHeight, 0);
      //   this.rotatePointsAroundAxis([point1], EQUILATERAL_AXIS.Z_AXIS, -(netTopSegmentRotation) * faceBendAngle);
      //   this.translatePoints([point1], -(xTranslationOffset - 0.5) + netTopSegmentXTranslation, 0.5 * fullHeight, 0);
      // }

      if (sectorNumber === 15) {
        // console.log('semi valid:', validSectors, semivalidSectors);
        this.translatePoints([point1], xTranslationOffset + 1.0, 2.5 * fullHeight, 0);
        this.rotatePointsAroundAxis([point1], EQUILATERAL_AXIS.Z_AXIS, 180 * Math.PI / 180);
        this.translatePoints([point1], -(xTranslationOffset + 1.0), -2.5 * fullHeight, 0);
        let netTopSegmentRotation: number = Math.floor(Math.floor(i / 3) / 6); // Math.floor(i / 6) - 3; // 6 points per top segment
        let netTopSegmentXTranslation: number = (netTopSegmentRotation + 5) % 5;

        this.translatePoints([point1], xTranslationOffset + 1.0, 2.5 * fullHeight, 0);
        // this.rotatePointsAroundAxis([point1], EQUILATERAL_AXIS.Z_AXIS, -(netTopSegmentRotation) * -faceBendAngle);
        // this.translatePoints([point1], -(xTranslationOffset + 1.0) + netTopSegmentXTranslation, -2.5 * fullHeight, 0);
      }
    }

    this.translatePoints(points, -2, 0, 0);

    const flattendPoints: number[] = points.reduce((prev: number[], curr: THREE.Vector3) => {
      return prev.concat([curr.x, curr.y, curr.z]);
    }, []);

    
    return flattendPoints;
  }


  getMappedTriangleFromPoint(x: number, y: number, subdivisions: number, sectorNumber: number = 0, spherizeAmount: number = 0): number[] {
    const triangle: any[] = this.getTriangleFromPoint(x, y, subdivisions, sectorNumber);
    const p1: THREE.Vector3 = new Vector3(triangle[0], triangle[1], triangle[2]);
    const p2: THREE.Vector3 = new Vector3(triangle[3], triangle[4], triangle[5]);
    const p3: THREE.Vector3 = new Vector3(triangle[6], triangle[7], triangle[8]);

    const fullHeight: number = 0.5 * Math.sqrt(3) * 1;
    const sectorColumnNumber: number = Math.floor((sectorNumber + 5) / 10);
    const xAxis: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
    const rightSideOfEquilateralVector: THREE.Vector3 = new THREE.Vector3(-0.5, fullHeight, 0).normalize();
    const leftSideOfEquilateralVector: THREE.Vector3 = new THREE.Vector3(0.5, fullHeight, 0).normalize();
    const faceBendAngle: number = (Math.PI - Math.acos(-Math.sqrt(5) / 3));
    const columnIndex: number = Math.floor(sectorNumber / 5);
    const oddColumn: boolean = columnIndex % 2 === 1; // start with index of 0

    if (columnIndex === 0 || columnIndex === 3) {
      const num: number = sectorColumnNumber + 1;
      const neg: number = sectorNumber < 15 ? 1 : -1;
      const rad: number = neg * faceBendAngle;
      const yShift: number = num * (fullHeight / 2);

      this.translatePoints([p1, p2, p3], 0, yShift, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], xAxis, rad);
      this.translatePoints([p1, p2, p3], 0, -yShift, 0);
    }
    

    if (sectorNumber % 5 < 0 || (oddColumn && sectorNumber % 5 < 1)) {
      this.translatePoints([p1, p2, p3], 2.25, fullHeight, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], rightSideOfEquilateralVector, faceBendAngle);
      this.translatePoints([p1, p2, p3], -2.25, -fullHeight, 0);
    }

    if (sectorNumber % 5 < 1) {
      this.translatePoints([p1, p2, p3], 1.75, fullHeight, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], leftSideOfEquilateralVector, faceBendAngle);
      this.translatePoints([p1, p2, p3], -1.75, -fullHeight, 0);
    }

    if (sectorNumber % 5 < 1 || (oddColumn && sectorNumber % 5 < 2)) {
      
      this.translatePoints([p1, p2, p3], 1.25, fullHeight, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], rightSideOfEquilateralVector, faceBendAngle);
      this.translatePoints([p1, p2, p3], -1.25, -fullHeight, 0);
    }

    if (sectorNumber % 5 < 2) {

      this.translatePoints([p1, p2, p3], 0.75, fullHeight, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], leftSideOfEquilateralVector, faceBendAngle);
      this.translatePoints([p1, p2, p3], -0.75, -fullHeight, 0);
    }

    if (sectorNumber % 5 < 2 || (oddColumn && sectorNumber % 5 < 3)) {
      
      this.translatePoints([p1, p2, p3], 0.25, fullHeight, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], rightSideOfEquilateralVector, faceBendAngle);
      this.translatePoints([p1, p2, p3], -0.25, -fullHeight, 0);
    }

    if (sectorNumber % 5 > 4 || (!oddColumn && sectorNumber % 5 > 3)) {
      this.translatePoints([p1, p2, p3], -1.75, fullHeight, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], rightSideOfEquilateralVector, -faceBendAngle);
      this.translatePoints([p1, p2, p3], 1.75, -fullHeight, 0);
    }

    if (sectorNumber % 5 > 3) {

      this.translatePoints([p1, p2, p3], -1.25, fullHeight, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], leftSideOfEquilateralVector, -faceBendAngle);
      this.translatePoints([p1, p2, p3], 1.25, -fullHeight, 0);
    }

    if (sectorNumber % 5 > 3 || (!oddColumn && sectorNumber % 5 > 2)) {
      
      this.translatePoints([p1, p2, p3], -0.75, fullHeight, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], rightSideOfEquilateralVector, -faceBendAngle);
      this.translatePoints([p1, p2, p3], 0.75, -fullHeight, 0);
    }

    if (sectorNumber % 5 > 2) {
      this.translatePoints([p1, p2, p3], -0.25, fullHeight, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], leftSideOfEquilateralVector, -faceBendAngle);
      this.translatePoints([p1, p2, p3], 0.25, -fullHeight, 0);
    }

    this.translatePoints([p1, p2, p3], 0, (0.5 * fullHeight) + ((1/3) * fullHeight), -this.getInradius());

    if (spherizeAmount !== 0) {
      const nrmP1: THREE.Vector3 = new THREE.Vector3().copy(p1);
      const nrmP2: THREE.Vector3 = new THREE.Vector3().copy(p2);
      const nrmP3: THREE.Vector3 = new THREE.Vector3().copy(p3);
      this.normalizePoints([nrmP1, nrmP2, nrmP3]);

      const nrmDiffP1: THREE.Vector3 = new THREE.Vector3().copy(nrmP1).sub(p1);
      const nrmDiffP2: THREE.Vector3 = new THREE.Vector3().copy(nrmP2).sub(p2);
      const nrmDiffP3: THREE.Vector3 = new THREE.Vector3().copy(nrmP3).sub(p3);

      nrmDiffP1.multiply(new THREE.Vector3(spherizeAmount, spherizeAmount, spherizeAmount));
      nrmDiffP2.multiply(new THREE.Vector3(spherizeAmount, spherizeAmount, spherizeAmount));
      nrmDiffP3.multiply(new THREE.Vector3(spherizeAmount, spherizeAmount, spherizeAmount));

      p1.add(nrmDiffP1);
      p2.add(nrmDiffP2);
      p3.add(nrmDiffP3);
    }

    this.scalePoints([p1, p2, p3], 1, 1, 1);
    

    return [
      -p1.x, p1.y, p1.z,
      -p2.x, p2.y, p2.z,
      -p3.x, p3.y, p3.z
    ];
  }

  getTriangleFromPoint(x: number, y: number, subdivisions: number, sectorNumber: number): number[] {
  
    const fullHeight: number = 0.5 * Math.sqrt(3) * 1;
    const maxTrianglesWide: number = subdivisions + 1;
    const maxTrianglesHigh: number = 2 * subdivisions + 1;
    const rowH = Math.ceil(maxTrianglesHigh / 2);

    const sectorColumnNumber: number = Math.floor((sectorNumber + 5) / 10);
    const sectorYOffset: number = -sectorColumnNumber * fullHeight;
    const sectorXOffset: number = sectorNumber % 5 - (Math.floor((sectorNumber) / 5) % 2) * 0.5;
    const flip: number = sectorNumber >= 10 ? -1 : 1;

    const xOffset: number = sectorXOffset + -0.5 + (Math.ceil(y / 2) * 0.5) / maxTrianglesWide;
    const yOffset: number = sectorYOffset + -(fullHeight / 2) + (Math.floor(y / 2) / rowH * fullHeight);
    const yUpperOffset: number = sectorYOffset + -(fullHeight / 2) + (Math.floor(y / 2) + 1) / rowH * fullHeight;
    const yIsEven: boolean = y % 2 === 0;

    let p1: THREE.Vector3;
    let p2: THREE.Vector3;
    let p3: THREE.Vector3;

    if (yIsEven) {
      p1 = new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yOffset, 0.0);
      p2 = new THREE.Vector3(0.0 + xOffset + (x + 1) / maxTrianglesWide, 0.0 + yOffset, 0.0);
      p3 = new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yUpperOffset, 0.0);
    } else {
      p1 = new THREE.Vector3(0.0 + xOffset + x / maxTrianglesWide, 0.0 + yUpperOffset, 0.0);
      p2 = new THREE.Vector3(0.0 + xOffset + (x + 0.5) / maxTrianglesWide, 0.0 + yOffset, 0.0);
      p3 = new THREE.Vector3(0.0 + xOffset + (x + 1) / maxTrianglesWide, 0.0 + yUpperOffset, 0.0);
    }

    const zAxis: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
    
    if (flip === -1 ) {
      // console.log('preflip', p1, p2, p3);
      const p1Copy: THREE.Vector3 = new THREE.Vector3().copy(p1);
      const p2Copy: THREE.Vector3 = new THREE.Vector3().copy(p2);
      const p3Copy: THREE.Vector3 = new THREE.Vector3().copy(p3);

      // p1.x = p2Copy.x;
      // p2.x = p1Copy.x;

      // p1.y = p3Copy.y;
      // p2.y = p3Copy.y;
      // p3.y = p1Copy.y;

      const translateY: number = sectorColumnNumber * fullHeight;
      const translateX: number = (sectorNumber % 5 - (sectorColumnNumber - 1) / 2);

      this.translatePoints([p1, p2, p3], -translateX, translateY, 0);
      this.rotatePointsAroundAxis([p1, p2, p3], zAxis, 180 * Math.PI / 180);
      this.translatePoints([p1, p2, p3], translateX, -translateY, 0);

      // console.log(x, y, p1Copy.sub(p1), p2Copy.sub(p2), p3Copy.sub(p3));
      // console.log('postflip', p1, p2, p3);
    }
    

    this.translatePoints([p1, p2, p3], -2, 0, 0);

    return [
      p1.x, p1.y, p1.z,
      p2.x, p2.y, p2.z,
      p3.x, p3.y, p3.z
    ];
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

  scalePoints(points: THREE.Vector3[], scaleX: number, scaleY: number, scaleZ: number): void {
    const pointLen: number = points.length;
    let point: THREE.Vector3;
    for (let i = 0; i < pointLen; i++) {
      point = points[i];
      point.x *= scaleX;
      point.y *= scaleY;
      point.z *= scaleZ;
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

  getInradius(): number {
    return (3 * Math.sqrt(3) + Math.sqrt(15)) / 12;
  }

  getMidradius(): number {
    return (1 + Math.sqrt(5)) / 4;
  }

  getCircumradius(): number {
    return Math.sqrt( 10 + 2 * Math.sqrt(5) ) / 4;
  }

  getMidPoint(p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3): THREE.Vector3 {
    return new THREE.Vector3(
      this.get3DAverage(p1.x, p2.x, p3.x),
      this.get3DAverage(p1.y, p2.y, p3.y),
      this.get3DAverage(p1.z, p2.z, p3.z)
    );
  }

  get3DAverage(num1: number, num2: number, num3: number): number {
    return (num1 + num2 + num3) / 3;
  }

  toggleNet(e: MouseEvent): void {
    if (this.icosahedronDualNetMesh0 && this.sceneBuilderService.scene) {
      if (this.icosahedronDualNetMesh0.parent === this.sceneBuilderService.scene) {
        this.sceneBuilderService.scene.remove(this.icosahedronDualNetMesh0);
      } else {
        this.sceneBuilderService.scene.add(this.icosahedronDualNetMesh0);
      }
      
    }
  }

}
