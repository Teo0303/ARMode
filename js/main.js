const canvas = document.getElementById("canvas");
const sceneManager = new SceneManager(canvas);

let stats = createStats();
document.body.appendChild(stats.domElement);

bindEventListeners();
render();

function bindEventListeners() {
  window.onresize = resizeCanvas;
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousemove", onMouseMove, false);
  canvas.addEventListener("touchmove", onTouchMove, false);
  canvas.addEventListener("touchstart", onTouchStart, false);
  canvas.addEventListener("touchend", onTouchEnd, false);
  resizeCanvas();
}

function resizeCanvas() {
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  sceneManager.onWindowResize();
}

function onMouseDown(e) {
  sceneManager.onMouseDown(e);
}

function onMouseUp(e) {
  sceneManager.onMouseUp(e);
}

function onMouseMove(e) {
  sceneManager.onMouseMove(e);
}

function onTouchMove(e) {
  sceneManager.onTouchMove(e);
}

function onTouchStart(e) {
  sceneManager.onTouchStart(e);
}

function onTouchEnd(e) {
  sceneManager.onTouchEnd(e);
}

function createStats() {
  var stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = "absolute";
  stats.domElement.style.left = "0";
  stats.domElement.style.top = "0";

  return stats;
}

function render() {
  requestAnimationFrame(render);
  stats.update();
  sceneManager.update();
}
