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
  var rotateStart = new THREE.Vector2();
  var rotateEnd = new THREE.Vector2();
  var rotateDelta = new THREE.Vector2();
  var rotateSpeed = 0.25;

  var PI_2 = Math.PI / 2;

  this.onMouseDown = function(evt) {
    this.mouseDown = true;
    evt.preventDefault();
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

    rotateStart.set(event.clientX, event.clientY);

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

    if (this.mouseDown) {
      document.getElementsByTagName("body")[0].style.cursor = "grabbing";

      rotateEnd.set(evt.clientX, evt.clientY);
      rotateDelta
        .subVectors(rotateEnd, rotateStart)
        .multiplyScalar(rotateSpeed);

      camera.rotation.y -= -(2 * Math.PI * rotateDelta.x) / canvas.clientHeight;
      camera.rotation.x -= -(2 * Math.PI * rotateDelta.y) / canvas.clientHeight;

      rotateStart.copy(rotateEnd);

      camera.rotation.x = Math.max(-PI_2, Math.min(PI_2, camera.rotation.x));
    }

    mouse.set(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouse, camera);
    let floor = sceneSubjects[1].getFloor();

    var intersects = raycaster.intersectObjects(floor);

    if (intersects.length > 0 && moving == false) {
      var intersect = intersects[0];

      rollOverMesh.position.copy(intersect.point).add({ x: 0, y: 0.001, z: 0 });
    }
  };

  // FOR TABLETS

  this.onTouchStart = function(evt) {
    if (evt.touches.length == 1) {
      rotateStart.set(evt.touches[0].pageX, evt.touches[0].pageY);
    } else {
      var x = 0.5 * (evt.touches[0].pageX + evt.touches[1].pageX);
      var y = 0.5 * (evt.touches[0].pageY + evt.touches[1].pageY);

      rotateStart.set(x, y);
    }
  };

  this.onTouchEnd = function(evt) {};

  this.onTouchMove = function(evt) {
    if (evt.touches.length == 1) {
      rotateEnd.set(evt.touches[0].pageX, evt.touches[0].pageY);
    } else {
      var xx = 0.5 * (evt.touches[0].pageX + evt.touches[1].pageX);
      var yy = 0.5 * (evt.touches[0].pageY + evt.touches[1].pageY);

      rotateEnd.set(xx, yy);
    }

    rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(rotateSpeed);

    camera.rotation.y -= -(2 * Math.PI * rotateDelta.x) / canvas.clientHeight;

    camera.rotation.x -= -(2 * Math.PI * rotateDelta.y) / canvas.clientHeight;

    rotateStart.copy(rotateEnd);

    camera.rotation.x = Math.max(-PI_2, Math.min(PI_2, camera.rotation.x));
  };

  renderer.setAnimationLoop(function() {
    camera.updateProjectionMatrix();

    const elapsedTime = clock.getElapsedTime();

    for (let i = 0; i < sceneSubjects.length; i++)
      sceneSubjects[i].update(elapsedTime);

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
