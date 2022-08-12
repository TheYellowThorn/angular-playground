import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sprite-animation',
  templateUrl: './sprite-animation.component.html',
  styleUrls: ['./sprite-animation.component.scss']
})
export class SpriteAnimationComponent implements AfterViewInit, OnInit {

  @ViewChild('canvas2d', {read: ElementRef, static: true}) public canvas2DRef: ElementRef | undefined = undefined;

  FPS: number = 20;
  paused: boolean = true;

  context: CanvasRenderingContext2D | undefined = undefined;
  canvas2d: HTMLCanvasElement | undefined = undefined;

  CANVAS_HEIGHT: number = 600;
  CANVAS_WIDTH: number = 1200;

  background:  CanvasImageSource | HTMLImageElement | undefined = undefined;
  backgroundPosition: { x: number, y: number } = { x: 0, y: 0 };
  backgroundOffsetX: number = 0;
  BACKGROUND_SPEED: number = 40;

  character: CanvasImageSource | HTMLImageElement | undefined = undefined;
  charactorPosition: { x: number, y: number } = { x: 0, y: 0 };

  frameData: { 
    direction: Direction.LEFT | Direction.RIGHT | number, 
    currentCharacterFrame: number,
    width: number,
    height: number
  } = { direction: Direction.RIGHT, currentCharacterFrame: 0, width: 0, height: 0 };

  

  @HostListener('document:keydown', ['$event']) handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowRight':
        this.frameData.direction = Direction.RIGHT; // 0
        return;
      case 'ArrowLeft':
        this.frameData.direction = Direction.LEFT; // 1
        return;
      case ' ':
        this.paused = !this.paused;
        return;
      default:
        return;
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.canvas2d = this.canvas2DRef?.nativeElement as HTMLCanvasElement;
    this.canvas2d.width = this.CANVAS_WIDTH;
    this.canvas2d.height = this.CANVAS_HEIGHT;

    this.context = this.canvas2d.getContext('2d')!;

    this.background = new Image();
    this.background.src = 'assets/img/background-image2.jpeg';
    console.log(this.background.width, this.background.height);

    this.character = new Image();
    this.character.src = 'assets/img/character.png';

    this.frameData.width = this.character.width / 8;
    this.frameData.height = this.character.height / 2;

    this.charactorPosition.x = this.CANVAS_WIDTH / 2 - this.frameData.width / 2
    this.charactorPosition.y =  this.CANVAS_HEIGHT - 220;

    // document.body.appendChild(this.character);

    window.requestAnimationFrame(() => {
      this.onEnterFrame();
    });

  }

  onEnterFrame(): void {
    if (!this.paused) {

      this.frameData.currentCharacterFrame++;
      this.frameData.currentCharacterFrame = this.frameData.currentCharacterFrame % 8;

      if (this.frameData.direction === Direction.RIGHT) {
        this.backgroundOffsetX += this.BACKGROUND_SPEED;
      } else {
        this.backgroundOffsetX -= this.BACKGROUND_SPEED;
      }
      this.backgroundOffsetX = this.backgroundOffsetX % (this.background!.width as number);

      this.context!.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

      this.drawBackground();

      const framePosX: number = this.frameData.currentCharacterFrame * this.frameData.width;
      const framePosY: number = this.frameData.direction * this.frameData.height;
      this.context!.drawImage(
        this.character as CanvasImageSource,
        framePosX, framePosY, this.frameData.width, this.frameData.height, this.charactorPosition.x, this.charactorPosition.y, this.frameData.width, this.frameData.height);
    }

    setTimeout(() => {
      this.onEnterFrame();
    }, 1000 / this.FPS);
  }

  drawBackground(): void {
    this.context!.drawImage(
      this.background as CanvasImageSource,
      this.backgroundOffsetX, 0, this.background!.width as number, this.background!.height as number, 0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

    const directionalDraw: number = this.backgroundOffsetX < 0 ? 1: -1;
    this.context!.drawImage(
      this.background as CanvasImageSource,
      this.backgroundOffsetX + directionalDraw * (this.background!.width as number), 0, this.background!.width as number, this.background!.height as number, 0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
      
    // this.context!.drawImage(
    //     this.background as CanvasImageSource,
    //     this.backgroundOffsetX, 0, this.background!.width as number, this.background!.height as number, 0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
  }

}

export namespace Direction {
  export type LEFT = 1;
  export const LEFT: number | LEFT = 1;

  export type RIGHT = 0;
  export const RIGHT: number | RIGHT = 0;
}
