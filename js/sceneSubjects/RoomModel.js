function RoomModel(scene, sphereCamera) {
  let loadingManager = new LoadingManager();
  const loader = new THREE.GLTFLoader(loadingManager);
  let floor;
  let objects = [];
  var texture = new THREE.TextureLoader(loadingManager).load(
    "https://marketplace.canva.com/MAC2ik6BwYQ/1/thumbnail_large-1/canva-seamless-wood-floor-texture-MAC2ik6BwYQ.jpg"
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.flipY = false;

  var carpet = new THREE.TextureLoader(loadingManager).load(
    "https://static.turbosquid.com/Preview/2016/04/06__11_17_10/Carpit_Gray_Brown_Yellow_Lack_COLOR.png71f3153b-3cca-4abf-a9ab-69d170b219b7Large.jpg"
  );
  carpet.wrapS = THREE.RepeatWrapping;
  carpet.wrapT = THREE.RepeatWrapping;
  carpet.repeat.set(2, 2);
  carpet.flipY = false;

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
    // console.log(document.querySelec);
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
