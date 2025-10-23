let layerShapes = []; 
let numPolygon = 6;
let layer = 0;
let maxLayers = 5;

function setup() {
  createCanvas(600, 600);
  angleMode(RADIANS);
  rectMode(CENTER);
  noLoop();
  background(0);
}

function draw() {
  background(0);
  translate(width / 2, height / 2);

  for (let i = 0; i < layer; i++) {
    drawLayer(i, layerShapes[i]);
  }
}

// Shape drawer functions (no switch needed)
const shapeDrawers = {
  circle: (size) => ellipse(0, 0, size, size),
  petal: (size) => ellipse(0, 0, size * 0.8, size * 1.1),
  triangle: (size) => triangle(-size * 0.5, size * 0.5, size * 0.5, size * 0.5, 0, -size * 0.2),
  rect: (size) => {
    rotate(PI / 4);
    rect(0, 0, size, size);
  }
};

// Color palette for each shape type
const shapeColors = {
  circle: "#FFE200",
  petal: "#1B619F",
  triangle: "#7D0401",
  rect: "#A13132"
};

function drawLayer(layerIndex, shapeType) {
  let radius = 200 - layerIndex * 15;
  let angleStep = TWO_PI / numPolygon;
  let angleOffset = angleStep / 2;

  for (let i = 0; i < numPolygon; i++) {
    let angle = i * angleStep + angleOffset * layerIndex;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    push();
    translate(x, y);
    rotate(angle + HALF_PI);

    // draw white outline first
    fill("#FFFFFF");
    shapeDrawers ; // slightly larger (e.g. +2px)

    // draw colored fill on top
    fill(shapeColors[shapeType]);
    shapeDrawers ;

    pop();
  }
}

// Choose shape with number keys 1–4
function keyPressed() {
  const keyMap = { '1': 'circle', '2': 'petal', '3': 'triangle', '4': 'rect' };

  if (keyMap[key] && layer < maxLayers) {
    layerShapes.push(keyMap[key]);
    layer++;
    redraw();
  }
}