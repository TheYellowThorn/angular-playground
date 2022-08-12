import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { 
  WebGLRenderer, ACESFilmicToneMapping, sRGBEncoding, 
  BufferGeometry, Color, CylinderGeometry, 
  RepeatWrapping, DoubleSide, BoxGeometry, Mesh, PointLight, MeshPhysicalMaterial, PerspectiveCamera,
  Scene, PMREMGenerator, PCFSoftShadowMap,
  Vector2, TextureLoader, SphereGeometry, MeshStandardMaterial, WebGLRenderTarget, Texture, CircleGeometry
} from 'three';
import { OrbitControls } from '@three-ts/orbit-controls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { createNoise2D, NoiseFunction2D } from 'simplex-noise';

@Component({
  selector: 'app-hex-globe',
  templateUrl: './hex-globe.component.html',
  styleUrls: ['./hex-globe.component.scss']
})
export class HexGlobeComponent implements OnInit {

  @ViewChild('canvas', {read: ElementRef, static: true}) public canvasRef: ElementRef | null = null;
  @ViewChild('canvasParent', {read: ElementRef, static: true}) public canvasParentRef: ElementRef | null = null;
  @ViewChild('canvas2d', {read: ElementRef, static: true}) public canvas2DRef: ElementRef | null = null;

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

  stoneGeo: BufferGeometry = new BoxGeometry(0,0,0);
  dirtGeo: BufferGeometry = new BoxGeometry(0,0,0);
  dirt2Geo: BufferGeometry = new BoxGeometry(0,0,0);
  sandGeo: BufferGeometry = new BoxGeometry(0,0,0);
  grassGeo: BufferGeometry = new BoxGeometry(0,0,0);

  textures: any;

  constructor() { }

  ngOnInit(): void {
    
  }
  async ngAfterViewInit() {
    this.initScene();
    await this.loadAssets();
    await this.addObjects();

  }

  initScene(): void {
    
    this.scene.background = new Color("#FFEECC");
    this.camera.position.set(-17,31,33);

    this.canvas = this.canvasRef!.nativeElement as HTMLCanvasElement;
    this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: true });

    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    this.light = new PointLight( new Color("#FFCB8E").convertSRGBToLinear().convertSRGBToLinear(), 80, 200 );
    this.light.position.set(10, 20, 10);
    this.light.castShadow = true; 
    this.light.shadow.mapSize.width = 512; 
    this.light.shadow.mapSize.height = 512; 
    this.light.shadow.camera.near = 0.5; 
    this.light.shadow.camera.far = 500; 
    this.scene.add( this.light );


    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0,0,0);
    this.controls.dampingFactor = 0.05;
    this.controls.enableDamping = true;
    
    this.pmrem = new PMREMGenerator(this.renderer);
    this.pmrem.compileEquirectangularShader(); 
    console.log('Scene initialized.');
  }

  async loadAssets(): Promise<void> {
    let envmapTexture = await new RGBELoader().loadAsync('assets/envmap.hdr');
    let rt: WebGLRenderTarget = this.pmrem!.fromEquirectangular(envmapTexture);
    this.envmap = rt.texture;

    this.textures = {
      dirt: await new TextureLoader().loadAsync('assets/dirt.png'),
      dirt2: await new TextureLoader().loadAsync('assets/dirt2.jpg'),
      grass: await new TextureLoader().loadAsync('assets/grass.jpg'),
      sand: await new TextureLoader().loadAsync('assets/sand.jpg'),
      water: await new TextureLoader().loadAsync('assets/water.jpg'),
      stone: await new TextureLoader().loadAsync('assets/stone.png'),
    };

    console.log('Textures loaded.');
  }

  async addObjects(): Promise<void> {

    var canvas2d: HTMLCanvasElement = this.canvas2DRef?.nativeElement as HTMLCanvasElement;

    canvas2d.width = 40;
    canvas2d.height = 40;
    // Again, set dimensions to fit the screen.
    this.context = canvas2d.getContext('2d')!;
    this.context.imageSmoothingEnabled = false;
    const myImageData = this.context.createImageData(40, 40);

    const noise2D: NoiseFunction2D = createNoise2D(() => this.SEED); // noise2D returns between -1 and 1

    for(let i = -20; i <= 20; i++) {
      for(let j = -20; j <= 20; j++) {
        let position: Vector2 = this.tileToPosition(i, j);
  
        // if (position.length() > 16) continue;
        if (position.length() > 6) continue;
        
        let noise: number = (noise2D(i * 0.075, j * 0.075) + 1) * 0.5;
        noise = Math.pow(noise, 1.5);
        noise = Math.floor(noise * 10) / 10; // make terraces
  
        this.pie(noise * this.MAX_HEIGHT, position);
        // this.hex(noise * this.MAX_HEIGHT, position);


        let data: Uint8ClampedArray = myImageData.data;
        data[0] = noise * 255; // red
        data[1] = noise * 255; // green
        data[2] = noise * 255; // blue
        data[3] = 255; // alpha
        this.context.putImageData( myImageData, i + 20, j + 20 ); 
      } 
    }

    let stoneMesh = this.hexMesh(this.stoneGeo, this.textures.stone);
    let grassMesh = this.hexMesh(this.grassGeo, this.textures.grass);
    let dirt2Mesh = this.hexMesh(this.dirt2Geo, this.textures.dirt2);
    let dirtMesh  = this.hexMesh(this.dirtGeo, this.textures.dirt);
    let sandMesh  = this.hexMesh(this.sandGeo, this.textures.sand);
    this.scene.add(stoneMesh, dirtMesh, dirt2Mesh, sandMesh, grassMesh);


    // let seaTexture = this.textures.water;
    // seaTexture.repeat = new Vector2(1, 1);
    // seaTexture.wrapS = RepeatWrapping;
    // seaTexture.wrapT = RepeatWrapping;

    // let seaMesh = new Mesh(
    //   new CylinderGeometry(17, 17, this.MAX_HEIGHT * 0.2, 50),
    //   new MeshPhysicalMaterial({
    //     envMap: this.envmap,
    //     color: new Color("#55aaff").convertSRGBToLinear().multiplyScalar(3),
    //     ior: 1.4,
    //     transmission: 1,
    //     transparent: true,
    //     envMapIntensity: 0.2, 
    //     roughness: 1,
    //     metalness: 0.025,
    //     roughnessMap: seaTexture,
    //     metalnessMap: seaTexture,
    //   })
    // );
    // seaMesh.receiveShadow = true;
    // seaMesh.rotation.y = -Math.PI * 0.333 * 0.5;
    // seaMesh.position.set(0, this.MAX_HEIGHT * 0.1, 0);
    // this.scene.add(seaMesh);


    // let mapContainer = new Mesh(
    //   new CylinderGeometry(17.1, 17.1, this.MAX_HEIGHT * 0.25, 50, 1, true),
    //   new MeshPhysicalMaterial({
    //     envMap: this.envmap,
    //     map: this.textures.dirt,
    //     envMapIntensity: 0.2, 
    //     side: DoubleSide,
    //   })
    // );
    // mapContainer.receiveShadow = true;
    // mapContainer.rotation.y = -Math.PI * 0.333 * 0.5;
    // mapContainer.position.set(0, this.MAX_HEIGHT * 0.125, 0);
    // this.scene.add(mapContainer);

    // let mapFloor = new Mesh(
    //   new CylinderGeometry(18.5, 18.5, this.MAX_HEIGHT * 0.1, 50),
    //   new MeshPhysicalMaterial({
    //     envMap: this.envmap,
    //     map: this.textures.dirt2,
    //     envMapIntensity: 0.1, 
    //     side: DoubleSide,
    //   })
    // );
    // mapFloor.receiveShadow = true;
    // mapFloor.position.set(0, -this.MAX_HEIGHT * 0.05, 0);
    // this.scene.add(mapFloor);

    // this.clouds();

    this.renderer!.setAnimationLoop(() => {
      this.controls!.update();
      this.renderer!.render(this.scene, this.camera);

      this.polygons = this.renderer!.info.render.triangles;
    });
    
  }

  tileToPosition(tileX: number, tileY: number): Vector2 {
    return new Vector2((tileX + (tileY % 2) * 0.5) * Math.sqrt(3), tileY * 1.5);
    // return new Vector2((tileX + (tileY % 2) * 0.5) * 1.77, tileY * 1.535);
  }
  
  hexGeometry(height: number, position: Vector2): CylinderGeometry {
    let geo: CylinderGeometry  = new CylinderGeometry(1, 1, height, 6, 1, false);
    geo.translate(position.x, height * 0.5, position.y);
  
    return geo;
  }

  pieGeometry(height: number, position: Vector2): BufferGeometry {
    let mainGeo: BufferGeometry = new BufferGeometry();
    
    let startingGeo: CylinderGeometry  = new CylinderGeometry(1, 1, height, 3, 1, false);
    startingGeo.scale(0.5, 1, 0.5);
    startingGeo.translate(0, 0, -0.5);
    startingGeo.rotateY(30 * Math.PI / 180);
    startingGeo.scale(1.2, 1, 1.2);

    mainGeo = startingGeo; //
    
    let geo: CylinderGeometry;

    for (let i = 1; i < 6; i++) {
      geo = startingGeo.clone() as CylinderGeometry;
      geo.rotateY(60 * i * Math.PI / 180);
      mainGeo = BufferGeometryUtils.mergeBufferGeometries([geo, mainGeo]);
    }
    



    mainGeo.translate(position.x, height * 0.5, position.y);
    
    return mainGeo; // geo;f
  }

  pie(height: number, position: Vector2) {
    // let geo: CylinderGeometry = this.hexGeometry(height, position);
    let geo: BufferGeometry = this.pieGeometry(height, position); 
  
    if(height > this.STONE_HEIGHT) {
      this.stoneGeo = BufferGeometryUtils.mergeBufferGeometries([geo, this.stoneGeo]);
  
      if(Math.random() > 0.8) {
        this.stoneGeo = BufferGeometryUtils.mergeBufferGeometries([this.stoneGeo, this.stone(height, position)]);
      }
    } else if(height > this.DIRT_HEIGHT) {
      this.dirtGeo = BufferGeometryUtils.mergeBufferGeometries([geo, this.dirtGeo]);
  
      if(Math.random() > 0.8) {
        this.grassGeo = BufferGeometryUtils.mergeBufferGeometries([this.grassGeo, this.tree(height, position)]);
      }
    } else if(height > this.GRASS_HEIGHT) {
      this.grassGeo = BufferGeometryUtils.mergeBufferGeometries([geo, this.grassGeo]);
    } else if(height > this.SAND_HEIGHT) { 
      this.sandGeo = BufferGeometryUtils.mergeBufferGeometries([geo, this.sandGeo]);
  
      if(Math.random() > 0.8 && this.stoneGeo) {
        this.stoneGeo = BufferGeometryUtils.mergeBufferGeometries([this.stoneGeo, this.stone(height, position)]);
      }
    } else if(height > this.DIRT2_HEIGHT) {
      this.dirt2Geo = BufferGeometryUtils.mergeBufferGeometries([geo, this.dirt2Geo]);
    } 
  }

  hex(height: number, position: Vector2) {
    let geo: CylinderGeometry = this.hexGeometry(height, position);
  
    if(height > this.STONE_HEIGHT) {
      this.stoneGeo = BufferGeometryUtils.mergeBufferGeometries([geo, this.stoneGeo]);
  
      if(Math.random() > 0.8) {
        this.stoneGeo = BufferGeometryUtils.mergeBufferGeometries([this.stoneGeo, this.stone(height, position)]);
      }
    } else if(height > this.DIRT_HEIGHT) {
      this.dirtGeo = BufferGeometryUtils.mergeBufferGeometries([geo, this.dirtGeo]);
  
      if(Math.random() > 0.8) {
        this.grassGeo = BufferGeometryUtils.mergeBufferGeometries([this.grassGeo, this.tree(height, position)]);
      }
    } else if(height > this.GRASS_HEIGHT) {
      this.grassGeo = BufferGeometryUtils.mergeBufferGeometries([geo, this.grassGeo]);
    } else if(height > this.SAND_HEIGHT) { 
      this.sandGeo = BufferGeometryUtils.mergeBufferGeometries([geo, this.sandGeo]);
  
      if(Math.random() > 0.8 && this.stoneGeo) {
        this.stoneGeo = BufferGeometryUtils.mergeBufferGeometries([this.stoneGeo, this.stone(height, position)]);
      }
    } else if(height > this.DIRT2_HEIGHT) {
      this.dirt2Geo = BufferGeometryUtils.mergeBufferGeometries([geo, this.dirt2Geo]);
    } 
  }

  hexMesh(geo: BufferGeometry, map: Texture) {
    let mat = new MeshPhysicalMaterial({ 
      envMap: this.envmap, 
      envMapIntensity: 0.135, 
      flatShading: true,
      map
    });

    let mesh = new Mesh(geo, mat);
    mesh.castShadow = true; //default is false
    mesh.receiveShadow = true; //default

    return mesh;
  }

  tree(height: number, position: Vector2) {
    const treeHeight = Math.random() * 1 + 1.25;
  
    const geo = new CylinderGeometry(0, 1.5, treeHeight, 3);
    geo.translate(position.x, height + treeHeight * 0 + 1, position.y);
    
    const geo2 = new CylinderGeometry(0, 1.15, treeHeight, 3);
    geo2.translate(position.x, height + treeHeight * 0.6 + 1, position.y);
    
    const geo3 = new CylinderGeometry(0, 0.8, treeHeight, 3);
    geo3.translate(position.x, height + treeHeight * 1.25 + 1, position.y);
  
    return BufferGeometryUtils.mergeBufferGeometries([geo, geo2, geo3]);
  }
  
  stone(height: number, position: Vector2) {
    const px = Math.random() * 0.4;
    const pz = Math.random() * 0.4;
  
    const geo: BufferGeometry = new SphereGeometry(Math.random() * 0.3 + 0.1, 7, 7);
    geo.translate(position.x + px, height, position.y + pz);
  
    return geo;
  }
  
  clouds() {
    let geo: BufferGeometry = new SphereGeometry(0, 0, 0); 
    let count = Math.floor(Math.pow(Math.random(), 0.45) * 4);
  
    for(let i = 0; i < count; i++) {
      const puff1 = new SphereGeometry(1.2, 7, 7);
      const puff2 = new SphereGeometry(1.5, 7, 7);
      const puff3 = new SphereGeometry(0.9, 7, 7);
     
      puff1.translate(-1.85, Math.random() * 0.3, 0);
      puff2.translate(0,     Math.random() * 0.3, 0);
      puff3.translate(1.85,  Math.random() * 0.3, 0);
  
      const cloudGeo = BufferGeometryUtils.mergeBufferGeometries([puff1, puff2, puff3]);
      cloudGeo.translate( 
        Math.random() * 20 - 10, 
        Math.random() * 7 + 7, 
        Math.random() * 20 - 10
      );
      cloudGeo.rotateY(Math.random() * Math.PI * 2);
  
      geo = BufferGeometryUtils.mergeBufferGeometries([geo, cloudGeo]);
    }
    
    const mesh = new Mesh(
      geo,
      new MeshStandardMaterial({
        envMap: this.envmap, 
        envMapIntensity: 0.75, 
        flatShading: true,
        // transparent: true,
        // opacity: 0.85,
      })
    );
  
    this.scene.add(mesh);
  }

}
