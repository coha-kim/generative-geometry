let layer = 0;
const maxLayers = 7;
let radius;
let angle = 0;
let numShape = 6;

function setup() {
  createCanvas(1080, 800);
  background("#4ba554ff");
  angleMode(RADIANS);
  rectMode(CORNERS);
  noStroke();

// background circle 
  centerButton = createButton("Add Center Circle");
  centerButton.position(20, 20);
  centerButton.mousePressed(drawCenterCircle);

// alpha slider for transparency
  alphaSlider = createSlider(0, 255, 255); 
  alphaSlider.position(20, 60);

  //   myPicker = createColorPicker("white");
  //   myPicker.position(0, 100);
}

// function drawBackgrounds() {
//   let c = myPicker.color();
//   background(c);
// }


function drawCenterCircle() {
  push();
  fill("#000000"); // color of center circle
  noStroke();
  circle(width / 2, height / 2, 360); 
  pop();
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
    1: { func: drawCircle, color: "#0576bd", sizeOffset: [2, 2] },
    2: { func: drawPetal, color: "#e9363a", sizeOffset: [2, 2] },
    3: { func: drawTriangle, color: "#1d813b", sizeOffset: [2] },
    4: { func: drawPolygon, color: "#639843ff", sizeOffset: [2] },
  };

  if (keyMap[key] && layer < maxLayers) {
    const baseRadius = (maxLayers - layer) * 20;
    const alphaVal = alphaSlider.value(); // get slider value

    push();
    translate(width / 2, height / 2);
    rotate((layer * TWO_PI) / (numShape * 2));

    // Draw white underlayer with transparency
    push();
    radius = baseRadius;
    fill(255, 255, 255, alphaVal); 
    if (key == 2) {
      polarEllipses(numShape, 30 + keyMap[key].sizeOffset[0], 50 + keyMap[key].sizeOffset[1], radius);
    } else if (key == 1) {
      polarEllipses(numShape, 50 + keyMap[key].sizeOffset[0], 50 + keyMap[key].sizeOffset[1], radius);
    } else if (key == 3) {
      polarTriangles(numShape, 50 + keyMap[key].sizeOffset[0], radius);
    } else if (key == 4) {
      polarPolygons(numShape, 4, 65 + keyMap[key].sizeOffset[0], radius);
    }
    pop();

    // Draw main colored shape with transparency
    push();
    radius = baseRadius;
    let c = color(keyMap[key].color);
    c.setAlpha(alphaVal); 
    fill(c);
    keyMap[key].func();
    pop();

    pop();
    layer++;

    // small center circle (unaffected by slider)
    push();
    fill("#fdf35f");
    noStroke();
    circle(width / 2, height / 2, 50);
    pop();
  }
}