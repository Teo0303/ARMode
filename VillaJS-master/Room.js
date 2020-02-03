var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var BACKGROUND_COLOR = 0xf0f0f0;
var AMBIENT_LIGHT_COLOR = 0xffffff;
// var ROOM_SCALE = 0.0001;

//SCENE SETUP
var scene = new THREE.Scene();
scene.background = new THREE.Color(BACKGROUND_COLOR);

var camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 0.001, 100000);
camera.position.z = 10;
camera.position.y = 5;
camera.lookAt(0, 0, 0);


var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 4;


renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);
// SCENE SETUP END

var light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

var dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(-5, 5, 0);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
dirLight.shadow.radius = 100;
scene.add(dirLight);

var control = new THREE.OrbitControls(camera, renderer.domElement);






var loader = new THREE.GLTFLoader();
var interior;

var material = new THREE.MeshStandardMaterial(
    { 
        color: 0x0087E6, 
        metalness: 1,
        roughness: 1 
    });


loader.load("model/Villa.gltf", function (gltf) {
    interior = gltf.scene;
    interior.traverse((o) => 
    {
        if(o.name == "Frame")
        {
            o.material = material;
        }
    }) 
    scene.add(interior);
}, undefined, function (error) {
    console.error(error)
});



function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
