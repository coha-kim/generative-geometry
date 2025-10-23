let layer = 0;
const maxLayers = 5;
let radius;
let angle = 0;
let numShape = 6;

function setup() {
  createCanvas(1080, 800);
  background("#a9e7afff");
  angleMode(RADIANS);
  rectMode(CORNERS);
  noStroke();
}

function radiusIndex(radius, angle) {
  for (i = maxLayers; i < 0; i--) {
    radius = i * 200;
    angle += 2 / PI;
  }
}

function drawTriangle() {
  push();
  // fill removed
  polarTriangles(numShape, 50, radius);
  pop();
}

function drawCircle() {
  push();
  polarEllipses(numShape, 50, 50, radius);
  pop();
}

function drawPetal() {
  push();
  polarEllipses(numShape, 30, 50, radius);
  pop();
}

function drawPolygon() {
  push();
  polarPolygons(numShape, 4, 65, radius);
  pop();
}

function keyPressed() {
  const keyMap = {
    1: { func: drawCircle, color: "#0576BD", sizeOffset: [2, 2] }, // width, height
    2: { func: drawPetal, color: "#C23040", sizeOffset: [2, 2] },
    3: { func: drawTriangle, color: "#FACF33", sizeOffset: [2] }, // side length offset
    4: { func: drawPolygon, color: "#1D813B", sizeOffset: [2] }, // side length offset
  };

  if (keyMap[key] && layer < maxLayers) {
    const baseRadius = (maxLayers - layer) * 20;

    push();
    translate(width / 2, height / 2);
    rotate((layer * TWO_PI) / (numShape * 2));

    // Draw white underlayer
    // Draw white underlayer
    push();
    radius = baseRadius;
    fill("#ffffff");
    if (key == 2) {
      // ellipses/petals
      polarEllipses(
        numShape,
        30 + keyMap[key].sizeOffset[0],
        50 + keyMap[key].sizeOffset[1],
        radius
      );
    } else if (key == 1) {
         polarEllipses(
        numShape,
        50 + keyMap[key].sizeOffset[0],
        50 + keyMap[key].sizeOffset[1],
        radius
      );
    } else if (key == 3) {
      // triangle
      polarTriangles(numShape, 50 + keyMap[key].sizeOffset[0], radius);
    } else if (key == 4) {
      // polygon
      polarPolygons(numShape, 4, 65 + keyMap[key].sizeOffset[0], radius);
    }
    pop();

    // Draw main colored shape22
    push();
    radius = baseRadius;
    fill(keyMap[key].color);
    keyMap[key].func();
    pop();

    pop();
    layer++;
  }
}
