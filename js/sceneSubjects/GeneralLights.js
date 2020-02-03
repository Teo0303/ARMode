function GeneralLights(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
  const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.2);
  const spotLight = new THREE.SpotLight(0xffffff);

  spotLight.position.set(0, 5, -10);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 512; // default
  spotLight.shadow.mapSize.height = 512; // default
  spotLight.shadow.camera.near = 0.5; // default
  spotLight.shadow.camera.far = 500;

  const light = new THREE.PointLight("#fff", 0.2);
  // scene.add(light);
  scene.add(ambientLight);
  scene.add(hemisphereLight);
  // scene.add(spotLight);

  this.update = function(time) {
    // directionalLight.position.z = (Math.sin(time) + 1.5) / 1.5;
    // light.intensity = (Math.sin(time) + 1.5) / 1.5;
    // light.color.setHSL( Math.sin(time), 0.5, 0.5 );
  };
}
