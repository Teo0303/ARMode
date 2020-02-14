function RoomModel(scene, sphereCamera) {
  let loadingManager = new LoadingManager();
  const loader = new THREE.GLTFLoader(loadingManager);
  var urls = [
    "assets/CubeMap/SanFrancisco/posx.jpg",
    "assets/CubeMap/SanFrancisco/negx.jpg",
    "assets/CubeMap/SanFrancisco/posy.jpg",
    "assets/CubeMap/SanFrancisco/negy.jpg",
    "assets/CubeMap/SanFrancisco/posz.jpg",
    "assets/CubeMap/SanFrancisco/negz.jpg"
  ];

  var urls2 = [
    "assets/CubeMap/Yokohama/posx.jpg",
    "assets/CubeMap/Yokohama/negx.jpg",
    "assets/CubeMap/Yokohama/posy.jpg",
    "assets/CubeMap/Yokohama/negy.jpg",
    "assets/CubeMap/Yokohama/posz.jpg",
    "assets/CubeMap/Yokohama/negz.jpg"
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
  let manager = new THREE.LoadingManager();

  manager.onLoad = function() {
    const loadingScreen = document.querySelector(".intro-page");
    const border = document.querySelector(".border");
    const wrapper = document.querySelector(".wrapper");
    const progress = document.querySelector(".progress");
    const start = document.querySelector(".start");

    progress.style.display = "none";
    start.style.display = "block";

    start.addEventListener("click", () => {
      wrapper.classList.add("hidden");
      wrapper.addEventListener("transitionend", (e) => {
        border.classList.add("hidden");
      });

      border.addEventListener("transitionend", () => {
        loadingScreen.style.display = "none";
      });
    });
  };

  manager.onProgress = function(url, itemsLoaded, itemsTotal) {
    let progressBar = document.querySelector(".progress__active");
    let progressNum = document.querySelector(".progress__number");
    let progress = Math.floor((itemsLoaded / itemsTotal) * 100);
    progressBar.style.width = progress + "%";
    progressNum.innerHTML = progress + "%";
  };

  manager.onError = function(url) {
    console.log("There was an error loading " + url);
  };

  return manager;
}
