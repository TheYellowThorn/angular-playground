import { Component, ElementRef, EventEmitter, Injectable, Output } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from '@three-ts/orbit-controls';

@Injectable({
  providedIn: 'root'
})
export class SceneBuilderService {

  @Output() onRenderFrame: EventEmitter<any> = new EventEmitter<any>();
  public cameraZ: number = 600;
  public fieldOfView: number = 1;
  public nearClippingPlane: number = 1;
  public farClippingPlane: number = 1000;

  public controls: OrbitControls | undefined;

  public ambientLight: THREE.AmbientLight | undefined;
  public directionalLight: THREE.DirectionalLight | undefined;
  public hemisphereLight: THREE.HemisphereLight | undefined;
  public spotLight: THREE.SpotLight | undefined;

  public camera: THREE.PerspectiveCamera | undefined;
  public textureLoader: THREE.TextureLoader | undefined;
  private _canvas: HTMLCanvasElement | undefined;
  private _canvasParent: HTMLElement | undefined;
  public get canvas(): HTMLCanvasElement {
    return this._canvas!;
  }
  public renderer: THREE.WebGLRenderer | undefined;
  public scene: THREE.Scene | undefined;

  public paused: boolean = false;

  private _frameCount: number = 0;
  private _sceneCreationStartTime: number = 0;
  private _renderStartTime: number = 0;
  private _timeStamp: number = 0;

  public get fps(): number {
    return this._fps;
  }
  private _fps: number = 0;
  private _fpsCount: number = 0;

  public get averageFps(): number {
    return this._averageFps;
  }
  private _averageFps: number = 0;
  private _lastLoop: number = 0;

  public get sceneToFirstRenderTime(): number {
    return this._renderStartTime - this._sceneCreationStartTime;
  }

  constructor() { }

  createScene(canvasRef: ElementRef): void {
    this._sceneCreationStartTime = Date.now();
    this._canvas = canvasRef.nativeElement;
    this._canvasParent = this._canvas!.parentElement as HTMLElement;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    // this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xddFF00, 1);
    this.directionalLight.position.set(-1, -1, 1);
    // this.scene.add(this.directionalLight);

    this.hemisphereLight = new THREE.HemisphereLight( 0xffeeb1, 0x080820, 4);
    this.hemisphereLight.position.set(-1, -1, 1);
    this.scene.add(this.hemisphereLight);

    this.spotLight = new THREE.SpotLight(0xffa95c, 4);
    this.spotLight.castShadow = true;
    this.spotLight.shadow.bias = -0.0001;
    this.spotLight.shadow.mapSize.width = 1024 * 4;
    this.spotLight.shadow.mapSize.height = 1024 * 4;
    this.spotLight.shadow.camera.near = this.nearClippingPlane; // default
    this.spotLight.shadow.camera.far = this.farClippingPlane; // default


    // this.render.ton

    let aspectRatio: number = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );

    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = this.cameraZ;

    this.controls = new OrbitControls(this.camera, this.canvas);

    window.addEventListener('resize', () => { this.resizeCanvasToDisplaySize() }, false);
  }

  onWindowResize(){

    // camera.aspect = window.innerWidth / window.innerHeight;
    // camera.updateProjectionMatrix();

    this.renderer!.setPixelRatio(devicePixelRatio);
    this.renderer!.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

  }

  resizeCanvasToDisplaySize() {
    const canvas = this.renderer!.domElement;
    // look up the size the canvas is being displayed
    const width = this._canvasParent!.clientWidth;
    const height = this._canvasParent!.clientHeight;

    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
      // you must pass false here or three.js sadly fights the browser
      this.renderer!.setPixelRatio(devicePixelRatio);
      this.renderer!.setSize(width, height, false);
      this.camera!.aspect = width / height;
      this.camera!.updateProjectionMatrix();
  
      // update any render target sizes here
    }
  }

  initRender(): void {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 2.3;

    // shadows
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // this.directionalLight.castShadow = true;
    // this.directionalLight.shadow.mapSize.width = 512; // default
    // this.directionalLight.shadow.mapSize.height = 512; // default
    // this.directionalLight.shadow.camera.near = this.nearClippingPlane; // default
    // this.directionalLight.shadow.camera.far = this.farClippingPlane; // default

    this._renderStartTime = Date.now();
    this.render();
  }

  public render(): void {
    this.spotLight!.position.set(
      this.camera!.position.x + .10,
      this.camera!.position.y + .10,
      this.camera!.position.z + .10
    )
    if (!this.paused) {
      if (this._frameCount === 0) {
        this._lastLoop = Date.now();
      } else {
        const thisLoop: number = Date.now();
        this._fps = Math.round(1000 / (thisLoop - this._lastLoop));
        this._fpsCount += this._fps;
        this._averageFps = this._fpsCount / this._frameCount;
        this._lastLoop = thisLoop;
      }
      this._frameCount++;
      this._timeStamp = Date.now();
      this.onRenderFrame.emit({
        fps: this._fps,
        averageFps: this.averageFps,
        frameCount: this._frameCount,
        sceneToFirstRenderTime: this.sceneToFirstRenderTime,
        startTime: this._renderStartTime,
        timeStamp: this._timeStamp
      });
      this.renderer!.render(this.scene!, this.camera!);
    }
    requestAnimationFrame(() => { this.render() });
  }

  private getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }
}
