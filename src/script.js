import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import {
  EXRLoader,
  GLTFLoader,
  GroundedSkybox,
  RGBELoader,
} from "three/examples/jsm/Addons.js";

/**
 * LOADER
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const rgbeLoader = new RGBELoader();

/**
 * Load Models
 */

gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  //   gltf.scene.scale(1, 1, 1);
  scene.add(gltf.scene);
});

// rgbeLoader.load("/enviromentMaps/BEDROOM.glb", (environmentMap) => {
//   environmentMap.mapping = THREE.EquirectangularRefractionMapping();
//   scene.background = environmentMap;
//   scene.environment = environmentMap;
// });

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const exrLoader = new EXRLoader();

// exrLoader.load("/environmentMaps/nvidiaCanvas-4k.exr", (environmentMap) => {
//   console.log(environmentMap);

//   environmentMap.mapping = THREE.EquirectangularReflectionMapping;

//   scene.background = environmentMap;
//   scene.environment = environmentMap;
// });

// rgbeLoader.load("/environmentMaps/2/2k.hdr", (environmentMap) => {
//   // ...
//   environmentMap.mapping = THREE.EquirectangularRefractionMapping;
//   scene.environment = environmentMap;
//   // Skybox
//   const skybox = new GroundedSkybox(environmentMap, 15, 70);
//   //skybox.material.wireframe = true;
//   skybox.position.y = 15;
//   scene.add(skybox);
//});

// const environmentMap = cubeTextureLoader.load([
//   "/environmentMaps/0/px.png",
//   "/environmentMaps/0/nx.png",
//   "/environmentMaps/0/py.png",
//   "/environmentMaps/0/ny.png",
//   "/environmentMaps/0/pz.png",
//   "/environmentMaps/0/nz.png",
// ]);

// scene.environment = environmentMap;
// scene.background = environmentMap;
// scene.environmentIntensity = 4;
// scene.backgroundBlurriness = 0.2;
// scene.backgroundIntensity = 0.2;

// gui.add(scene, "environmentIntensity").min(0).max(10).step(0.1);
// gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.1);
// gui.add(scene, "backgroundIntensity").min(0).max(1).step(0.1);

const textureLoader = new THREE.TextureLoader();

const environmentMap = textureLoader.load(
  "/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg"
);

environmentMap.mapping = THREE.EquirectangularReflectionMapping;
environmentMap.colorSpace = THREE.SRGBColorSpace;

scene.background = environmentMap;

const holyDonut = new THREE.Mesh(
  new THREE.TorusGeometry(5, 0.01),
  new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 4, 2) })
);

holyDonut.position.y = 3.5;
holyDonut.layers.enable(1);
scene.add(holyDonut);

/**
 * Cube render target
 */

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  type: THREE.FloatType,
});

scene.environment = cubeRenderTarget.texture;

//Cube Camera
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
cubeCamera.layers.set(1);
/**
 * Torus Knot
 */
const torusMaterial = new THREE.MeshStandardMaterial({
  roughness: 0,
  metalness: 0.95,
  color: "#AA33B3",
  //envMap: environmentMap,
});

const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  torusMaterial
);
torusKnot.position.y = 4;
scene.add(torusKnot);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime();

  if (holyDonut) {
    holyDonut.rotation.x = Math.sin(elapsedTime) * 2;

    cubeCamera.update(renderer, scene);
  }
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
