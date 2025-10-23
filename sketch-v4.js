let layerShapes = []; 
let numPolygon = 6;
let layer = 0;
let maxLayers = 5;

// Shape-drawing functions (centered at 0,0)
const shapeDrawers = {
  circle: (size) => ellipse(0, 0, size, size),
  petal: (size) => ellipse(0, 0, size * 0.6, size * 1.1),
  triangle: (size) => triangle(-size * 0.5, size * 0.5, size * 0.5, size * 0.5, 0, -size * 0.2),
  rect: (size) => {
    push();
    rotate(PI / 4);
    rect(0, 0, size * 0.9, size * 0.9);
    pop();
  }
};

// Colors for each shape type
const shapeColors = {
  circle: "#FFE200",
  petal: "#1B619F",
  triangle: "#7D0401",
  rect: "#A13132"
};

function setup() {
  createCanvas(700, 700);
  angleMode(RADIANS);
  rectMode(CENTER);
  noStroke();
  noLoop();
}

function draw() {
  background("#286815ff");
  translate(width / 2, height / 2);

  // Draw all selected layers
  for (let i = 0; i < layer; i++) {
    drawLayer(i, layerShapes[i]);
  }
}

// Draw a single layer of shapes around a circle
function drawLayer(layerIndex, shapeType) {
  let radius = 180 - layerIndex * 15;       // distance from center
  let angleStep = TWO_PI / numPolygon;      // divide circle evenly
  let angleOffset = angleStep / 2;          // offset to sit between previous layer

  for (let i = 0; i < numPolygon; i++) {
    let angle = i * angleStep + angleOffset * layerIndex;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    push();
    translate(x, y);
    rotate(angle + HALF_PI); 

    // Draw white outline slightly larger
    fill("#FFFFFF");
    shapeDrawers[shapeType](radius + 4);

    // Draw colored shape on top
    fill(shapeColors[shapeType]);
    shapeDrawers[shapeType](radius);

    pop();
  }
}

// Select shape type with number keys 1–4
function keyPressed() {
  const keyMap = { '1': 'circle', '2': 'petal', '3': 'triangle', '4': 'rect' };

  if (keyMap[key] && layer < maxLayers) {
    layerShapes.push(keyMap[key]);
    layer++;
    redraw();
  }
}