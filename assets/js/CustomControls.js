function CustomControls(camera, canvas, raycaster) {
  this.mouseDown = false;
  this.moving = false;
  this.touchStart = false;
  let scope = this;
  // FOR DESKTOP
  let timer = null;
  let counter = 0;

  this.onMouseDown = function(evt) {
    counter = 0;

    this.mouseDown = true;

    document.getElementsByTagName("body")[0].style.cursor = "grab";

    timer = setInterval(() => {
      counter += 1;
    }, 50);
  };

  this.onMouseUp = function(evt) {
    this.mouseDown = false;

    clearInterval(timer);

    document.getElementsByTagName("body")[0].style.cursor = "default";
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

    let objects = sceneSubjects[2].getObjects();

    var intersects = raycaster.intersectObjects(objects);

    if (
      intersects.length <= 2 &&
      (intersects[intersects.length - 1].object.name == "floor" ||
        intersects[intersects.length - 1].object.name == "carpet")
    ) {
      let intersect = intersects[0];

      if (moving == false && counter <= 1) {
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
    }

    mouse.set(
      (x / window.innerWidth) * 2 - 1,
      -(y / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouse, camera);
    let floor = sceneSubjects[2].getFloor();

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
      camera.rotation.y -= -slideX / 3000;
      camera.rotation.x -= -slideY / 3000;
    }
  };
}
