function FloorCircle(scene) {
  var rollOverGeo = new THREE.CircleBufferGeometry(0.25, 20);
  rollOverMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    opacity: 0.2,
    transparent: true,
    side: THREE.DoubleSide
  });
  rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);

  rollOverMesh.rotation.x = -Math.PI / 2;
  scene.add(rollOverMesh);

  this.update = (time) => {};
}
