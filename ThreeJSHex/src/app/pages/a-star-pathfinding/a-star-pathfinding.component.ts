import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-a-star-pathfinding',
  templateUrl: './a-star-pathfinding.component.html',
  styleUrls: ['./a-star-pathfinding.component.scss']
})
export class AStarPathfindingComponent implements OnInit {

  ITEMS_WIDE: number = 20;
  ROWS_HIGH: number = 16;

  rows: Box[][] = [];

  startingCoordinates: { x: number, y: number } = { x: 0, y: 0 };
  endCoordinates: { x: number, y: number } = { x: 0, y: 0 };

  showCosts: boolean = false;
  useHorizontalPathsOnly: boolean = false;

  path: Box[] = [];
  pathMinX: number = Infinity;
  pathMaxX: number = -1;
  pathMinY: number = Infinity;
  pathMaxY: number = -1;

  closedSet: Box[] = [];
  closedSetMinX: number = Infinity;
  closedSetMaxX: number = -1;
  closedSetMinY: number = Infinity;
  closedSetMaxY: number = -1;

  movingStartingBox: boolean = false;
  movingEndBox: boolean = false;
  drawingObstactles: boolean = false;
  shiftIsDown: boolean = false;

  @HostListener('document:mouseup', ['$event']) onMouseUp(): void {
    this.movingStartingBox = false;
    this.movingEndBox = false;
    this.drawingObstactles = false;
  }
  @HostListener('document:keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Shift') {
      this.shiftIsDown = true;
    }
  }
  @HostListener('document:keyup', ['$event']) onKeyUp(e: KeyboardEvent): void {
    if (e.key === 'Shift') {
      this.shiftIsDown = false;
    }
  }

  constructor() { }

  ngOnInit(): void {

    this.startingCoordinates.x = Math.floor(Math.random() * this.ITEMS_WIDE);
    this.startingCoordinates.y = Math.floor(Math.random() * this.ROWS_HIGH);

    this.endCoordinates.x = Math.floor(Math.random() * this.ITEMS_WIDE);
    this.endCoordinates.y = Math.floor(Math.random() * this.ROWS_HIGH);

    console.log('start:', this.startingCoordinates);
    console.log('end:', this.endCoordinates);

    let row: Box[];
    for (let i = 0; i < this.ROWS_HIGH; i++) {
      row = [];
      this.rows.push(row);
      for (let j = 0; j < this.ITEMS_WIDE; j++) {
        row.push(new Box(j, i));
      }
    }
  }

  startDraw(e: MouseEvent, x: number, y: number): void {
    const startingBoxClicked: boolean = this.startingCoordinates.x === x && this.startingCoordinates.y === y;
    const endBoxClicked: boolean = this.endCoordinates.x === x && this.endCoordinates.y === y;
    
    if (startingBoxClicked) {
      this.movingStartingBox = true;
    }
    if (endBoxClicked) {
      this.movingEndBox = true;
    }
    if (!startingBoxClicked && !endBoxClicked) {
      this.drawingObstactles = true;
    }

    this.overBox(e, x, y);
  }

  overBox(e: MouseEvent, x: number, y: number): void {
    const overObstacle: boolean = this.isObstacle(x, y);

    if (this.movingStartingBox) {
      if (!overObstacle && (this.startingCoordinates.x !== x || this.startingCoordinates.y !== y)) {
        this.startingCoordinates.x = x;
        this.startingCoordinates.y = y;
        this.findPath();
      }
      
    }
    if (!overObstacle && this.movingEndBox) {
      if (this.endCoordinates.x !== x || this.endCoordinates.y !== y) {
        this.endCoordinates.x = x;
        this.endCoordinates.y = y;
        this.findPath();
      }
    }
    if (this.drawingObstactles) {
      if (!overObstacle && !this.shiftIsDown) {
        this.toggleBoxAsObstacle(x, y);
        this.findPath();
      } else if (overObstacle && this.shiftIsDown) {
        this.toggleBoxAsObstacle(x, y);
        this.findPath();
      }
    }
   
  }

  toggleBoxAsObstacle(x: number, y: number): void {
    const box: Box = this.rows[y][x];
    box.obstacle = !this.shiftIsDown; // true; //  !box.obstacle;
  }

  isStartingPoint(x: number, y: number): boolean {
    return this.startingCoordinates.x === x && this.startingCoordinates.y === y;
  }
  isEndPoint(x: number, y: number): boolean {
    return this.endCoordinates.x === x && this.endCoordinates.y === y;
  }
  isObstacle(x: number, y: number): boolean {
    if (this.isStartingPoint(x, y) || this.isEndPoint(x, y)) {
      return false;
    }
    const box: Box = this.rows[y][x];
    return box.obstacle;
  }

  findPath(): void {

    this.resetCosts();

    const openSet: Box[] = [];
    const closedSet: Box[] = [];

    const startingBox: Box = this.rows[this.startingCoordinates.y][this.startingCoordinates.x];
    const endBox: Box = this.rows[this.endCoordinates.y][this.endCoordinates.x];
    openSet.push(startingBox);

    // f(n) = g(n) + h(n);
    while (openSet.length > 0) {
      let currentBox: Box = openSet[0];
      let openSetBox: Box;

      for ( let i = 1; i < openSet.length; i++) {
        openSetBox = openSet[i];
        if (openSetBox.fCost < currentBox.fCost || (openSetBox.fCost === currentBox.fCost && openSetBox.hCost < currentBox.hCost)) {
          currentBox = openSetBox;
        }
      }

      let currentBoxIndex: number = openSet.indexOf(currentBox);
      openSet.splice(currentBoxIndex, 1);
      closedSet.push(currentBox);

      if (currentBox === endBox) {
        this.path = this.retracePath(startingBox, endBox);
        this.getPathMinAndMaxes();

        this.closedSet = closedSet;
        this.getClosedSetMinAndMaxes();
        return;
      }

      const neightbors: Box[] = this.getNeighboringBoxes(currentBox);

      for (let i = 0; i < neightbors.length; i++) {
        const neighbor: Box = neightbors[i];
        if (neighbor.obstacle || closedSet.indexOf(neighbor) !== -1) {
          continue;
        }

        const newMovementCostToNeighbor: number = currentBox.gCost + this.getDistanceBetweenBoxes(currentBox, neighbor);
        const openSetContainsNeighbor: boolean = openSet.indexOf(neighbor) !== -1;
        if (newMovementCostToNeighbor < neighbor.gCost || !openSetContainsNeighbor) {
          neighbor.gCost = newMovementCostToNeighbor;
          neighbor.hCost = this.getDistanceBetweenBoxes(neighbor, endBox);
          neighbor.parent = currentBox;

          if (!openSetContainsNeighbor) {
            openSet.push(neighbor);
          }
        }
      }

    }

    if (openSet.length === 0) {
      // this.resetCosts();
      this.getPathMinAndMaxes();

      this.closedSet = closedSet;
      this.getClosedSetMinAndMaxes();
      this.path = [];
    }

  }

  resetCosts(): void {
    this.closedSet.forEach((box: Box) => {
      box.gCost = 0;
      box.hCost = 0;
    });
    this.path.forEach((box: Box) => {
      box.gCost = 0;
      box.hCost = 0;
    })
  }

  retracePath(startBox: Box, endBox: Box): Box[] {
    const path: Box[] = [];
    let currentBox: Box = endBox;

    while (currentBox !== startBox) {
      path.push(currentBox);

      currentBox = currentBox.parent!;
    }

    path.reverse();

    return path;
  }

  getPathMinAndMaxes(): void {
    this.pathMinX = Infinity;
    this.pathMaxX = -1;
    this.pathMinY = Infinity;
    this.pathMaxY = -1;

    for (let i: number = 0; i < this.path.length; i++) {
      const box: Box = this.path[i];
      this.pathMinX = Math.min(box.x, this.pathMinX);
      this.pathMaxX = Math.max(box.x, this.pathMaxX);
      this.pathMinY = Math.min(box.y, this.pathMinY);
      this.pathMaxY = Math.max(box.y, this.pathMaxY);
    }
  }

  getClosedSetMinAndMaxes(): void {
    this.closedSetMinX = Infinity;
    this.closedSetMaxX = -1;
    this.closedSetMinY = Infinity;
    this.closedSetMaxY = -1;

    for (let i: number = 0; i < this.closedSet.length; i++) {
      const box: Box = this.closedSet[i];
      this.closedSetMinX = Math.min(box.x, this.closedSetMinX);
      this.closedSetMaxX = Math.max(box.x, this.closedSetMaxX);
      this.closedSetMinY = Math.min(box.y, this.closedSetMinY);
      this.closedSetMaxY = Math.max(box.y, this.closedSetMaxY);
    }
  }

  isInPath(x: number, y: number): boolean {
    if (x < this.pathMinX || x > this.pathMaxX || y < this.pathMinY || y > this.pathMaxY) {
      return false;
    }

    const endBox: Box = this.rows[this.endCoordinates.y][this.endCoordinates.x];
    for (let i = 0; i < this.path.length; i++) {
      const box: Box = this.path[i];
      if (box === endBox) {
        return false;
      }
      if (box.x === x && box.y === y) {
        return true;
      }
    }
    return false;
  }

  getBoxAt(x: number, y: number): Box {
    return this.rows[y][x];
  }

  isInClosedSet(x: number, y: number): boolean {
    if (x < this.closedSetMinX || x > this.closedSetMaxX || y < this.closedSetMinY || y > this.closedSetMaxY) {
      return false;
    }

    const endBox: Box = this.rows[this.endCoordinates.y][this.endCoordinates.x];
    const startingBox: Box = this.rows[this.startingCoordinates.y][this.startingCoordinates.x];

    for (let i = 0; i < this.closedSet.length; i++) {
      const box: Box = this.closedSet[i];
      if (box === endBox && box === startingBox) {
        return false;
      }
      if (box.x === x && box.y === y) {
        return true;
      }
    }
    return false;
  }

  getDistanceBetweenBoxes(box1: Box, box2: Box): number {
    const distX: number = Math.abs(box1.x - box2.x);
    const distY: number = Math.abs(box1.y - box2.y);

    if (distY > distX) {
      return 14 * distX + 10 * (distY - distX);
    }
    return 14 * distY + 10 * (distX - distY);
  }

  getNeighboringBoxes(box: Box): Box[] {
    const neighbors: Box[] = [];
    
    const xStart: number = box.x - 1;
    const yStart: number = box.y - 1;

    if (!this.useHorizontalPathsOnly) {
      for (let i: number = yStart; i <= yStart + 2; i++) {
        for (let j: number = xStart; j <= xStart + 2; j++) {
          if (j >= 0 && i >= 0 && j < this.ITEMS_WIDE && i < this.ROWS_HIGH) {
            const neighbor: Box = this.rows[i][j];
            if (neighbor !== box) {
              neighbors.push(neighbor);
            }
           
          }
        }
      }  
    } else {
      for (let j: number = xStart; j <= xStart + 2; j++) {
        if (j >= 0 && j < this.ITEMS_WIDE) {
          const neighbor: Box = this.rows[box.y][j];
          if (neighbor !== box) {
            neighbors.push(neighbor);
          }
        }
      }
      for (let i: number = yStart; i <= yStart + 2; i++) {
        if (i >= 0 && i < this.ROWS_HIGH) {
          const neighbor: Box = this.rows[i][box.x];
          if (neighbor !== box) {
            neighbors.push(neighbor);
          }
        }
      }
    }
    
    return neighbors;
  }

  toggleShowCosts(): void {
    this.showCosts = !this.showCosts;
  }
  toggleHorizontalOnly(): void {
    this.useHorizontalPathsOnly = !this.useHorizontalPathsOnly;
    this.findPath();
  }

}

class Box {

  x: number = 0;
  y: number = 0;
  obstacle: boolean = false;
  gCost: number = 0;
  hCost: number = 0;
  parent: Box | undefined = undefined;

  public get fCost(): number { 
    return this.gCost + this.hCost;
  }

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  
}
