function SceneManager(canvas) {
  const clock = new THREE.Clock();

  this.mouseDown = false;
  var moving = false;
  var prevTime = performance.now();
  this.touchStart = false;

  const screenDimensions = {
    width: canvas.width,
    height: canvas.height
  };

  let stats = createStats();
  document.body.appendChild(stats.domElement);

  const scene = buildScene();
  const renderer = buildRender(screenDimensions);
  const raycaster = buildRaycaster();
  const mouse = buildMouse();
  const camera = buildCamera(screenDimensions);
  const sphereCamera = buildSphereCamera();
  const sceneSubjects = createSceneSubjects(scene);

  function buildScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#eee");

    return scene;
  }

  function buildSphereCamera() {
    var sphereCamera = new THREE.CubeCamera(1, 10000, 500);
    sphereCamera.position.set(0, 0, 100);
    scene.add(sphereCamera);

    return sphereCamera;
  }

  function buildRender({ width, height }) {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
    });
    // const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
    const DPR = 1;
    renderer.setPixelRatio(DPR);
    renderer.setSize(width, height);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.Uncharted2ToneMapping;
    // renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.05;

    return renderer;
  }

  function buildCamera({ width, height }) {
    const aspectRatio = width / height;
    const fieldOfView = 52;
    const nearPlane = 0.1;
    const farPlane = 100;
    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    camera.rotation.order = "YXZ";
    camera.position.y = 1.7;
    camera.position.x = -6.5;
    camera.position.z = 3;
    camera.lookAt(0, 1, -3);
    camera.updateProjectionMatrix();
    return camera;
  }

  function createSceneSubjects(scene) {
    const sceneSubjects = [
      new GeneralLights(scene),
      new RoomModel(scene, sphereCamera),
      new FloorCircle(scene)
    ];

    return sceneSubjects;
  }

  function buildRaycaster() {
    const raycaster = new THREE.Raycaster();

    return raycaster;
  }

  function buildMouse() {
    const mouse = new THREE.Vector2();

    return mouse;
  }

  // FOR DESKTOP

  let timer = null;
  let counter = 0;

  var euler = new THREE.Euler(0, 0, 0, "YXZ");
  var PI_2 = Math.PI / 2;
  var vec = new THREE.Vector3();

  this.onMouseDown = function(evt) {
    this.mouseDown = true;
    document.getElementsByTagName("body")[0].style.cursor = "grab";

    let x = evt.clientX
      ? evt.clientX
      : evt.targetTouches[0]
      ? evt.targetTouches[0].pageX
      : evt.changedTouches[evt.changedTouches.length - 1].pageX;
    let y = evt.clientY
      ? evt.clientY
      : evt.targetTouches[0]
      ? evt.targetTouches[0].pageY
      : evt.changedTouches[evt.changedTouches.length - 1].pageY;

    event.preventDefault();

    mouse.set(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouse, camera);

    let objects = sceneSubjects[1].getObjects();

    var intersects = raycaster.intersectObjects(objects);

    if (
      intersects.length <= 2 &&
      (intersects[intersects.length - 1].object.name == "floor" ||
        intersects[intersects.length - 1].object.name == "carpet")
    ) {
      let intersect = intersects[0];

      if (moving == false) {
        //move camera
        moving = true;
        gsap.to(camera.position, 1.5, {
          x: intersect.point.x,
          z: intersect.point.z,
          ease: Power1.easeInOut,
          onUpdate: () => {
            camera.updateProjectionMatrix();
          },
          onComplete: () => {
            moving = false;
          }
        });
      }
    }
  };

  this.onMouseUp = function(evt) {
    this.mouseDown = false;

    document.getElementsByTagName("body")[0].style.cursor = "default";

    console.log(counter);
  };

  this.onMouseMove = function(evt) {
    evt.preventDefault();

    let x = evt.clientX
      ? evt.clientX
      : evt.targetTouches[0]
      ? evt.targetTouches[0].pageX
      : evt.changedTouches[evt.changedTouches.length - 1].pageX;
    let y = evt.clientY
      ? evt.clientY
      : evt.targetTouches[0]
      ? evt.targetTouches[0].pageY
      : evt.changedTouches[evt.changedTouches.length - 1].pageY;

    let movementX =
      evt.movementX || evt.mozMovementX || evt.webkitMovementX || 0;
    let movementY =
      evt.movementY || evt.mozMovementY || evt.webkitMovementY || 0;

    if (this.mouseDown) {
      document.getElementsByTagName("body")[0].style.cursor = "grabbing";

      camera.rotation.y -= -movementX / 600;
      camera.rotation.x -= -movementY / 600;

      camera.rotation.x = Math.max(-PI_2, Math.min(PI_2, camera.rotation.x));

      // euler.setFromQuaternion(camera.quaternion);

      // euler.y = -movementX * 6000;
      // euler.x = -movementY * 6000;

      // euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));
      // camera.quaternion.setFromEuler(euler);
    }

    mouse.set(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouse, camera);
    let floor = sceneSubjects[1].getFloor();

    var intersects = raycaster.intersectObjects(floor);

    if (intersects.length > 0) {
      var intersect = intersects[0];

      rollOverMesh.position.copy(intersect.point).add({ x: 0, y: 0.001, z: 0 });
    }
  };

  // FOR TABLETS

  let tsX, tsY;

  this.onTouchStart = function(evt) {
    this.touchStart = true;
    tsX = evt.touches[0].clientX;
    tsY = evt.touches[0].clientY;
  };

  this.onTouchEnd = function(evt) {
    this.touchStart = false;
  };

  this.onTouchMove = function(evt) {
    evt.preventDefault();

    let tmX = evt.touches[0].clientX;
    let tmY = evt.touches[0].clientY;
    let slideX = tmX - tsX,
      slideY = tmY - tsY;
    if (this.touchStart) {
      camera.rotation.y -= -slideX / 10000;
      camera.rotation.x -= -slideY / 10000;

      camera.rotation.x = Math.max(-PI_2, Math.min(PI_2, camera.rotation.x));
    }
  };

  function moveCamera() {}

  renderer.setAnimationLoop(function() {
    camera.updateProjectionMatrix();

    sphereCamera.update(renderer, scene);
    renderer.render(scene, camera);
    stats.update();
  });

  // this.update = function() {
  //   const elapsedTime = clock.getElapsedTime();

  //   for (let i = 0; i < sceneSubjects.length; i++)
  //     sceneSubjects[i].update(elapsedTime);

  //   camera.updateProjectionMatrix();
  //   renderer.render(scene, camera);

  //   sphereCamera.update(renderer, scene);
  // };

  this.onWindowResize = function() {
    const { width, height } = canvas;

    screenDimensions.width = width;
    screenDimensions.height = height;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  };

  function createStats() {
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = "absolute";
    stats.domElement.style.left = "0";
    stats.domElement.style.top = "0";

    return stats;
  }
}
