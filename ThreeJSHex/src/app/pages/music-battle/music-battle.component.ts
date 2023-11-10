import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  WebGLRenderer,
  ACESFilmicToneMapping,
  sRGBEncoding,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  CubicBezierCurve3,
  CylinderGeometry,
  RepeatWrapping,
  DoubleSide,
  BoxGeometry,
  Mesh,
  PointLight,
  LineBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Scene,
  PMREMGenerator,
  PCFSoftShadowMap,
  ReinhardToneMapping,
  ShaderMaterial,
  Vector2,
  TextureLoader,
  SphereGeometry,
  MeshStandardMaterial,
  WebGLRenderTarget,
  Texture,
  Vector3,
  CircleGeometry,
  Line,
} from "three";
import { OrbitControls } from "@three-ts/orbit-controls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import * as geometryUtils from "three/examples/jsm/utils/GeometryUtils.js"; // 'three/addons/utils/GeometryUtils.js';
import { Line2 } from "three/examples/jsm/lines/Line2"; // 'three/addons/lines/Line2.js';
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
// import { OutputPass } from "three/examples/jsm/postprocessing/Ou";

@Component({
  selector: "app-music-battle",
  templateUrl: "./music-battle.component.html",
  styleUrls: ["./music-battle.component.scss"],
})
export class MusicBattleComponent implements OnInit {
  @ViewChild("canvas", { read: ElementRef, static: true })
  public canvasRef: ElementRef | null = null;
  @ViewChild("canvasParent", { read: ElementRef, static: true })
  public canvasParentRef: ElementRef | null = null;
  @ViewChild("canvas2d", { read: ElementRef, static: true })
  public canvas2DRef: ElementRef | null = null;

  canvas: HTMLCanvasElement | null = null;
  context: CanvasRenderingContext2D | null = null;
  scene: Scene = new Scene();
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
  renderer: WebGLRenderer | null = null;
  light: PointLight | null = null;
  controls: OrbitControls | null = null;
  pmrem: PMREMGenerator | null = null;
  MAX_HEIGHT = 10;
  envmap: Texture | null = null;
  SEED: number = Math.random();
  finalComposer: EffectComposer | undefined;

  polygons: number = 0;

  textures: any;

  line: Line2 | undefined = undefined;
  lineMaterial = new LineMaterial({
    color: 0xffffff,
    vertexColors: true,
    linewidth: 0.5,
    worldUnits: true,
    alphaToCoverage: true,
    dashed: false,
  });

  LANE_WIDTH: number = 5;
  NUM_OF_LANES: number = 3; //3;

  constructor() {}

  ngOnInit(): void {}

  async ngAfterViewInit() {
    this.initScene();
    await this.loadAssets();
    await this.addObjects();
  }

  initScene(): void {
    this.scene.background = new Color("#000000");
    this.camera.position.set(-17, 31, 33);

    this.canvas = this.canvasRef!.nativeElement as HTMLCanvasElement;
    this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: true });

    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    this.light = new PointLight(
      new Color("#FFCB8E").convertSRGBToLinear().convertSRGBToLinear(),
      80,
      200
    );
    this.light.position.set(10, 20, 10);
    this.light.castShadow = true;
    this.light.shadow.mapSize.width = 512;
    this.light.shadow.mapSize.height = 512;
    this.light.shadow.camera.near = 0.5;
    this.light.shadow.camera.far = 500;
    this.scene.add(this.light);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.dampingFactor = 0.05;
    this.controls.enableDamping = true;

    this.pmrem = new PMREMGenerator(this.renderer);
    this.pmrem.compileEquirectangularShader();

    // const renderScene = new RenderPass(this.scene, this.camera);

    // const params = {
    //   threshold: 0,
    //   strength: 3,
    //   radius: 0.5,
    //   exposure: 1,
    // };

    // const bloomPass = new UnrealBloomPass(
    //   new Vector2(window.innerWidth, window.innerHeight),
    //   1.5,
    //   0.4,
    //   0.85
    // );
    // bloomPass.threshold = params.threshold;
    // bloomPass.strength = params.strength;
    // bloomPass.radius = params.radius;

    // const bloomComposer = new EffectComposer(this.renderer);
    // bloomComposer.renderToScreen = false;
    // bloomComposer.addPass(renderScene);
    // bloomComposer.addPass(bloomPass);

    // const mixPass = new ShaderPass(
    //   new ShaderMaterial({
    //     uniforms: {
    //       baseTexture: { value: null },
    //       bloomTexture: { value: bloomComposer.renderTarget2.texture },
    //     },
    //     vertexShader: document.getElementById("vertexshader")!.textContent as
    //       | string
    //       | undefined,
    //     fragmentShader: document.getElementById("fragmentshader")!
    //       .textContent as string | undefined,
    //     defines: {},
    //   }),
    //   "baseTexture"
    // );
    // mixPass.needsSwap = true;

    // const outputPass = new OutputPass(ReinhardToneMapping);

    // this.finalComposer = new EffectComposer(this.renderer);
    // this.finalComposer.addPass(renderScene);
    // this.finalComposer.addPass(mixPass);
    // this.finalComposer.addPass(outputPass);

    console.log("Scene initialized.");
  }

  async loadAssets(): Promise<void> {
    let envmapTexture = await new RGBELoader().loadAsync("assets/envmap.hdr");
    let rt: WebGLRenderTarget = this.pmrem!.fromEquirectangular(envmapTexture);
    this.envmap = rt.texture;

    this.textures = {};

    console.log("Textures loaded.");
  }

  async addObjects(): Promise<void> {
    var canvas2d: HTMLCanvasElement = this.canvas2DRef
      ?.nativeElement as HTMLCanvasElement;

    canvas2d.width = 40;
    canvas2d.height = 40;
    // Again, set dimensions to fit the screen.
    this.context = canvas2d.getContext("2d")!;

    for (let i = 0; i <= this.NUM_OF_LANES; i++) {
      const lanePosition: number = i; //  (2 * i) / this.NUM_OF_LANES - 1;
      let geometry: LineGeometry = this.getLaneGeometry(lanePosition);

      this.line = new Line2(geometry, this.lineMaterial);
      this.line.computeLineDistances();
      this.line.scale.set(1, 1, 1);
      this.scene.add(this.line);
    }

    // geometry = this.getLaneGeometry(-1);

    // this.line = new Line2(geometry, this.lineMaterial);
    // this.line.computeLineDistances();
    // this.line.scale.set(1, 1, 1);
    // this.scene.add(this.line);

    // geometry = this.getLaneGeometry(1);

    // this.line = new Line2(geometry, this.lineMaterial);
    // this.line.computeLineDistances();
    // this.line.scale.set(1, 1, 1);
    // this.scene.add(this.line);

    this.renderer!.setAnimationLoop((timeStamp) => {
      this.controls!.update();
      this.renderer!.render(this.scene, this.camera);
      // this.finalComposer!.render();

      // console.log(Math.sin(timeStamp / 1000));
      const lineGlowScale: number = Math.sin(timeStamp / 100);
      this.lineMaterial.linewidth = 0.25 * (lineGlowScale * 0.25 + 2);

      this.polygons = this.renderer!.info.render.triangles;
    });
  }

  getLaneGeometry(laneNumber: number = 0): LineGeometry {
    const positions = [];
    const colors = [];

    const laneTranslation: number = this.LANE_WIDTH * laneNumber;

    const curve = new CubicBezierCurve3(
      new Vector3(0 + laneTranslation, 0, 0),
      new Vector3(0 + laneTranslation, 0, 0),
      new Vector3(0 + laneTranslation, 10 + laneTranslation, 0),
      new Vector3(-10, 10 + laneTranslation, 0)
    );
    const points = curve.getPoints(10);

    const divisions = Math.round(12 * points.length);
    const point = new Vector3();
    const color = new Color();
    const spline = new CatmullRomCurve3(points);

    for (let i = 0, l = divisions; i < l; i++) {
      const t = i / l;
      // console.log(Math.sin(t));

      spline.getPoint(t, point);
      positions.push(point.x, point.y, point.z);
      color.setRGB(0.0, 1.0, t);
      // color.setHSL(l, 1.0, 0.5);
      colors.push(color.r, color.g, color.b);
    }

    console.log(positions);
    console.log("\n");
    const geometry = new LineGeometry();
    geometry.setPositions(positions);
    geometry.setColors(colors);

    return geometry;
  }
}
