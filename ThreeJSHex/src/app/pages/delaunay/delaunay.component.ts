import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  WebGLRenderer,
  ACESFilmicToneMapping,
  sRGBEncoding,
  BufferGeometry,
  Color,
  CylinderGeometry,
  RepeatWrapping,
  DoubleSide,
  BoxGeometry,
  Mesh,
  PointLight,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  MathUtils,
  Scene,
  PMREMGenerator,
  PCFSoftShadowMap,
  Points,
  PointsMaterial,
  MeshLambertMaterial,
  Vector2,
  TextureLoader,
  SphereGeometry,
  MeshStandardMaterial,
  WebGLRenderTarget,
  Texture,
  Vector3,
} from "three";
import { OrbitControls } from "@three-ts/orbit-controls";
import { createNoise3D, NoiseFunction3D } from "simplex-noise";
import Delaunator from "delaunator";
import { GUI } from "dat.gui";

@Component({
  selector: "app-delaunay",
  templateUrl: "./delaunay.component.html",
  styleUrls: ["./delaunay.component.scss"],
})
export class DelaunayComponent implements AfterViewInit, OnInit {
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

  polygons: number = 0;

  STONE_HEIGHT = this.MAX_HEIGHT * 0.8;
  DIRT_HEIGHT = this.MAX_HEIGHT * 0.7;
  GRASS_HEIGHT = this.MAX_HEIGHT * 0.5;
  SAND_HEIGHT = this.MAX_HEIGHT * 0.3;
  DIRT2_HEIGHT = this.MAX_HEIGHT * 0;

  textures: any;

  constructor() {}

  async ngOnInit(): Promise<void> {}

  async ngAfterViewInit() {
    await this.initScene();
    await this.loadAssets();
    await this.addObjects();
  }

  async initScene(): Promise<void> {
    this.scene.background = new Color("#FFEECC");
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
  }

  async loadAssets(): Promise<void> {
    this.textures = {
      dirt: await new TextureLoader().loadAsync("assets/dirt.png"),
      dirt2: await new TextureLoader().loadAsync("assets/dirt2.jpg"),
      grass: await new TextureLoader().loadAsync("assets/grass.jpg"),
      sand: await new TextureLoader().loadAsync("assets/sand.jpg"),
      water: await new TextureLoader().loadAsync("assets/water.jpg"),
      stone: await new TextureLoader().loadAsync("assets/stone.png"),
    };

    console.log("Textures loaded.");
  }

  async addObjects(): Promise<void> {
    var canvas2d: HTMLCanvasElement = this.canvas2DRef
      ?.nativeElement as HTMLCanvasElement;

    canvas2d.width = 40;
    canvas2d.height = 40;
    // Again, set dimensions to fit the screen.
    this.context = canvas2d.getContext("2d")!;
    this.context.imageSmoothingEnabled = false;
    const myImageData = this.context.createImageData(40, 40);

    const noise3D: NoiseFunction3D = createNoise3D(() => this.SEED); // noise2D returns between -1 and 1

    for (let i = -20; i <= 20; i++) {
      for (let j = -20; j <= 20; j++) {
        let position: Vector2 = new Vector2(j, i);
        let noise: number = (noise3D(i * 0.075, j * 0.075, 1) + 1) * 0.5;
        noise = Math.pow(noise, 1.5);

        let data: Uint8ClampedArray = myImageData.data;
        data[0] = noise * 255; // red
        data[1] = noise * 255; // green
        data[2] = noise * 255; // blue
        data[3] = 255; // alpha
        this.context.putImageData(myImageData, i + 20, j + 20);
      }
    }

    console.log(myImageData.data);

    const size: { x: number; z: number } = { x: 1, z: 1 };
    const scale: number = 10;
    const pointsCount: number = 41;
    const points3d: Vector3[] = [];

    for (let i = 0; i < pointsCount; i++) {
      for (let j = 0; j < pointsCount; j++) {
        const sectionSize: number = Math.floor(pointsCount / 2);
        let x = (j - sectionSize) * 2 * (1 / (pointsCount - 1));
        let z = (i - sectionSize) * 2 * (1 / (pointsCount - 1));
        let y = 1;
        // let y = noise2D(x / size.x * 1.25, z / size.z * 1.25) * 50;
        const vec: Vector3 = new Vector3(x, y, z);

        // const noise: number = 1 + noise3D(x / size.x * 2.25, z / size.z * 2.25, 1) * 0.5;

        // vec.normalize();
        // vec.x *= scale;
        // vec.y *= scale;
        // vec.z *= scale;

        // vec.x *= .2;
        // vec.y *= .2;
        // vec.z *= .2;

        // vec.x *= noise;
        // vec.y *= noise;
        // vec.z *= noise;
        points3d.push(vec);
      }
    }

    const randPoints: number = 100;
    for (let i = 0; i < randPoints; i++) {
      const x: number = Math.random() * 1.9 - 0.95;
      const z: number = Math.random() * 1.9 - 0.95;
      const vec: Vector3 = new Vector3(x, 1, z);
      points3d.push(vec);
    }

    // triangulate x, z
    var indexDelaunay = Delaunator.from(
      points3d.map((v) => {
        return [v.x, v.z];
      })
    );

    for (let i = 0; i < pointsCount; i++) {
      for (let j = 0; j < pointsCount; j++) {
        const sectionSize: number = Math.floor(pointsCount / 2);
        let x = (j - sectionSize) * 2 * (1 / (pointsCount - 1));
        let z = (i - sectionSize) * 2 * (1 / (pointsCount - 1));
        let y = 1;
        const ind: number = i * pointsCount + j;
        const vec: Vector3 = points3d[ind];

        const noise: number = 1; // 1 + noise3D(x / size.x * 2.25, z / size.z * 2.25, 1) * 0.05;

        vec.normalize();
        vec.x *= noise * scale;
        vec.y *= noise * scale;
        vec.z *= noise * scale;
      }
    }

    const startingIndex: number = pointsCount * pointsCount;
    for (let i = 0; i < randPoints; i++) {
      const noise: number = 1.025; // 1 + noise3D(x / size.x * 2.25, z / size.z * 2.25, 1) * 0.05;
      const vec: Vector3 = points3d[startingIndex + i];
      vec.normalize();
      vec.x *= noise * scale;
      vec.y *= noise * scale;
      vec.z *= noise * scale;
    }

    // for (let i = 0; i < pointsCount; i++) {
    //   let x = MathUtils.randFloatSpread(size.x);
    //   let z = MathUtils.randFloatSpread(size.z);
    //   let y = 1;
    //   console.log(x);
    //   // let y = noise2D(x / size.x * 1.25, z / size.z * 1.25) * 50;
    //   const vec: Vector3 = new Vector3(x, y, z);
    //   vec.normalize();
    //   vec.x *= scale;
    //   vec.y *= scale;
    //   vec.z *= scale;
    //   points3d.push(vec);
    // }

    var geom: BufferGeometry = new BufferGeometry().setFromPoints(points3d);
    var cloud = new Points(
      geom,
      new PointsMaterial({ color: 0x99ccff, size: 2 })
    );
    // this.scene.add(cloud);

    var meshIndex = []; // delaunay index => three.js index
    for (let i = 0; i < indexDelaunay.triangles.length; i++) {
      meshIndex.push(indexDelaunay.triangles[i]);
    }
    console.log(indexDelaunay.triangles.length);

    geom.setIndex(meshIndex); // add three.js index to the existing geometry
    geom.computeVertexNormals();
    var mesh = new Mesh(
      geom, // re-use the existing geometry
      new MeshLambertMaterial({ color: "purple", wireframe: false })
    );
    this.scene.add(mesh);

    // mesh = mesh.clone();
    // mesh.rotateX(Math.PI * 90 / 180);
    // this.scene.add(mesh);

    // mesh = mesh.clone();
    // mesh.rotateX(Math.PI * 180 / 180);
    // this.scene.add(mesh);

    var gui = new GUI();
    gui.add(mesh.material, "wireframe");

    this.renderer!.setAnimationLoop(() => {
      this.controls!.update();
      this.renderer!.render(this.scene, this.camera);

      this.polygons = this.renderer!.info.render.triangles;
    });
  }
}
