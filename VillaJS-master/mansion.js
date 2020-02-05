var HEIGHT = window.innerHeight;
var WIDTH = window.innerWidth;

var BACKGROUND_COLOR = new THREE.Color(0xf0f0f0);

// PARAMETERS
var scene = new THREE.Scene();
scene.background = new THREE.Color(BACKGROUND_COLOR);

var camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 0.1, 10000);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);

renderer.shadowMap.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.Uncharted2ToneMapping;
// renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.05;
document.body.append(renderer.domElement);

var ambient_light = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambient_light);

var sphereCamera = new THREE.CubeCamera(1, 10000, 500);
sphereCamera.position.set(0, 0, 100);
scene.add(sphereCamera);

var cubeMap = new THREE.BoxGeometry(10000, 10000, 10000);

var urls = [
  "model/CubeMap/SanFrancisco/posx.jpg",
  "model/CubeMap/SanFrancisco/negx.jpg",
  "model/CubeMap/SanFrancisco/posy.jpg",
  "model/CubeMap/SanFrancisco/negy.jpg",
  "model/CubeMap/SanFrancisco/posz.jpg",
  "model/CubeMap/SanFrancisco/negz.jpg"
];

var loader = new THREE.CubeTextureLoader();
scene.background = loader.load(urls);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  sphereCamera.updateCubeMap(renderer, scene);
}

var loader = new THREE.GLTFLoader();
var model;

loader.load("model/mansion_02.02.20.gltf", function(gltf) {
  model = gltf.scene;

  model.traverse((o) => {
    if (o.isMesh) {
      if (o.material.name == "windows_mat") {
        o.material.color = new THREE.Color(0x181818);
        o.material.transparent = true;
        o.material.opacity = 0.3;
        o.material.side = THREE.DoubleSide;
        o.material.metalness = 1;
        o.material.roughness = 0;
        o.material.envMap = sphereCamera.renderTarget;
      }
      if (o.material.name == "outdoorFloor_mat") {
        o.material.metalness = 0;
        o.material.roughness = 0.67;
        o.material.envMap = sphereCamera.renderTarget;
      }
      if (o.material.name == "floor_mat") {
        o.material.metalness = 0;
        o.material.roughness = 0.9;
        o.material.envMap = sphereCamera.renderTarget;
      }
      if (o.material.name == "table_mat") {
        o.material.metalness = 0;
        o.material.roughness = 0.71;
        o.material.envMap = sphereCamera.renderTarget;
      }
      if (o.material.name == "tableLegs_mat") {
        o.material.metalness = 1;
        o.material.roughness = 0;
        o.material.envMap = sphereCamera.renderTarget;
      }
      if (o.material.name == "chairs_mat") {
        o.material.metalness = 0;
        o.material.roughness = 0.67;
        o.material.envMap = sphereCamera.renderTarget;
      }
      if (o.material.name == "sofa_mat") {
        o.material.metalness = 0;
        o.material.roughness = 0.79;
        o.material.envMap = sphereCamera.renderTarget;
      }
      if (o.material.name == "lamps_mat") {
        o.material.metalness = 0;
        o.material.roughness = 0.3;
        o.material.envMap = sphereCamera.renderTarget;
      }
      if (o.material.name == "vaze_mat") {
        o.material.metalness = 0;
        o.material.roughness = 0.3;
        o.material.envMap = sphereCamera.renderTarget;
      }
      if (o.material.name == "vaze_mat") {
        o.material.metalness = 0;
        o.material.roughness = 0.3;
        o.material.envMap = sphereCamera.renderTarget;
      }
      if (o.material.name.includes("windowsFrame_mat")) {
        o.material.metalness = 0.41;
        o.material.roughness = 0;
        o.material.envMap = sphereCamera.renderTarget;
      }
      if (o.material.name.includes("image")) {
        o.material.metalness = 0.6;
        o.material.roughness = 0.8;
        o.material.envMap = sphereCamera.renderTarget;
      } else {
        o.material.metalness = 0;
      }
    }
  });

  scene.add(model);
});

var controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.z = 10;

animate();
