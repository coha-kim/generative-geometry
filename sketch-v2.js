let shapes = [];
let layerShapes = []; 
let numPolygon = 6;
let layer = 0;
let maxLayers = 5;
let angleOffset;

function preload() {
  shapes[0] = loadImage("assets/circle1.svg");
  shapes[1] = loadImage("assets/petal1.svg");
  shapes[2] = loadImage("assets/tri1.svg");
  shapes[3] = loadImage("assets/rect1.svg");
}

function setup() {
  createCanvas(600, 600);
  imageMode(CENTER);
  noLoop();
}

function draw() {
  background(0);
  translate(width / 2, height / 2);

  // draw all chosen layers
  for (let i = 0; i < layer; i++) {
    drawLayer(i, layerShapes[i]);
  }
}

function drawLayer(layerIndex, shape) {
  let radius = 200 - layerIndex * 15;
  let angleStep = TWO_PI / numPolygon;
  let angleOffset = angleStep / 2;


  for (let i = 0; i < numPolygon; i++) {
    let angle = i * angleStep + angleOffset * layerIndex;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    push();
    translate(x, y);
    rotate(angle + 0.5 * PI);
    image(shape, 0, 0, 180, 180);
    pop();
  }
}

function keyPressed() {
  if (key >= '1' && key <= '4') {
    let selectedShape = shapes[int(key) - 1];

    if (layer < maxLayers) {
      layerShapes.push(selectedShape); // store shape for this layer
      layer++;
      redraw();
    }
  }
}