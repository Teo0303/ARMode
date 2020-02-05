function RoomModel(scene, sphereCamera) {
  let loadingManager = new LoadingManager();
  const loader = new THREE.GLTFLoader(loadingManager);
  var urls = [
    "js/models/CubeMap/SanFrancisco/posx.jpg",
    "js/models/CubeMap/SanFrancisco/negx.jpg",
    "js/models/CubeMap/SanFrancisco/posy.jpg",
    "js/models/CubeMap/SanFrancisco/negy.jpg",
    "js/models/CubeMap/SanFrancisco/posz.jpg",
    "js/models/CubeMap/SanFrancisco/negz.jpg"
  ];

  var urls2 = [
    "js/models/CubeMap/Yokohama/posx.jpg",
    "js/models/CubeMap/Yokohama/negx.jpg",
    "js/models/CubeMap/Yokohama/posy.jpg",
    "js/models/CubeMap/Yokohama/negy.jpg",
    "js/models/CubeMap/Yokohama/posz.jpg",
    "js/models/CubeMap/Yokohama/negz.jpg"
  ];

  var BACKGROUND_COLOR = new THREE.Color(0xf0f0f0);
  scene.background = new THREE.Color(BACKGROUND_COLOR);
  var loader2 = new THREE.CubeTextureLoader(loadingManager);
  scene.background = loader2.load(urls2);

  let floor;
  let objects = [];

  loader.load(
    "js/models/mansion_02.02.20.gltf",
    function(gltf) {
      let model = gltf.scene;

      model.traverse((o, i) => {
        objects.push(o);

        if (o.isMesh) {
          if (o.material.name == "windows_mat") {
            o.material.color = new THREE.Color(0x181818);
            o.material.transparent = true;
            o.material.opacity = 0.3;
            o.material.side = THREE.DoubleSide;
            o.material.metalness = 1;
            o.material.roughness = 0;
            o.material.envMap = sphereCamera.renderTarget.texture;
          }
          if (o.material.name == "outdoorFloor_mat") {
            o.material.metalness = 0;
            o.material.roughness = 0.67;
            o.material.envMap = sphereCamera.renderTarget.texture;
          }
          if (o.material.name == "floor_mat") {
            o.material.metalness = 0;
            o.material.roughness = 0.9;
            o.material.envMap = sphereCamera.renderTarget.texture;
          }
          if (o.material.name == "table_mat") {
            o.material.metalness = 0;
            o.material.roughness = 0.71;
            o.material.envMap = sphereCamera.renderTarget.texture;
          }
          if (o.material.name == "tableLegs_mat") {
            o.material.metalness = 1;
            o.material.roughness = 0;
            o.material.envMap = sphereCamera.renderTarget.texture;
          }
          if (o.material.name == "chairs_mat") {
            o.material.metalness = 0;
            o.material.roughness = 0.67;
            o.material.envMap = sphereCamera.renderTarget.texture;
          }
          if (o.material.name == "sofa_mat") {
            o.material.metalness = 0;
            o.material.roughness = 0.79;
            o.material.envMap = sphereCamera.renderTarget.texture;
          }
          if (o.material.name == "lamps_mat") {
            o.material.metalness = 0;
            o.material.roughness = 0.3;
            o.material.envMap = sphereCamera.renderTarget.texture;
          }
          if (o.material.name == "vaze_mat") {
            o.material.metalness = 0;
            o.material.roughness = 0.3;
            o.material.envMap = sphereCamera.renderTarget.texture;
          }
          if (o.material.name == "vaze_mat") {
            o.material.metalness = 0;
            o.material.roughness = 0.3;
            o.material.envMap = sphereCamera.renderTarget.texture;
          }
          if (o.material.name.includes("windowsFrame_mat")) {
            o.material.metalness = 0.41;
            o.material.roughness = 0;
            o.material.envMap = sphereCamera.renderTarget.texture;
          }
          if (o.material.name.includes("image")) {
            o.material.metalness = 0.6;
            o.material.roughness = 0.8;
            o.material.envMap = sphereCamera.renderTarget.texture;
          } else {
            o.material.metalness = 0;
          }
        }
      });

      floor = model.children.filter((el) => {
        return el.name == "floor";
      });
      scene.add(model);
    },
    undefined,
    function(error) {
      console.log(error);
    }
  );

  this.update = function() {};

  this.getFloor = function() {
    return floor;
  };

  this.getObjects = function() {
    return objects;
  };
}

function LoadingManager() {
  let manager = new THREE.LoadingManager(() => {});

  manager.onLoad = function() {
    const loadingScreen = document.querySelector(".intro-page");

    loadingScreen.classList.add("is-loaded");

    loadingScreen.addEventListener("transitionend", function(e) {
      e.target.style.display = "none";
    });
  };

  manager.onProgress = function(url, itemsLoaded, itemsTotal) {
    let progressElement = document.querySelector(".percent");
    let progress = Math.floor((itemsLoaded / itemsTotal) * 100) + "%";
    progressElement.innerHTML = progress;
  };

  manager.onError = function(url) {
    console.log("There was an error loading " + url);
  };

  return manager;
}
