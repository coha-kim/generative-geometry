let layer = 0;
const maxLayers = 5;
let radius;
let angle = 0;
let numShape = 6;

function setup() {
  createCanvas(400,400);
  background("#e0f8e2ff");
  angleMode(RADIANS);
  rectMode(CORNERS);
  noStroke();
}

function radiusIndex(radius, angle) {
  for(i=maxLayers; i<0; i--) {
    radius = i*200;
    angle += (2 / PI);
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
  polarEllipses(numShape,30,50,radius);
  pop();
}

function drawPolygon() {
  push();
  polarPolygons(numShape,4,65, radius);
  pop();
}

function keyPressed() {
  const keyMap = {
    1: {func: drawCircle, color: "#0576BD"},
    2: {func: drawPetal, color: "#C23040"},
    3: {func: drawTriangle, color: "#FACF33"},
    4: {func: drawPolygon, color: "#1D813B"},
  };
  
  if (keyMap[key] && layer < maxLayers) {
    const baseRadius = (maxLayers - layer) * 20;
    
    push();                
    translate(width/2, height/2); 
    rotate(layer*TWO_PI/(numShape*2)); 
    
    // Draw white stroke shape underneath
    push();
    radius = baseRadius + 2; 
    fill("#ffffff");
    keyMap[key].func();
    pop();
    
    // Draw main colored shape
    radius = baseRadius;
    fill(keyMap[key].color);
    keyMap[key].func();
    pop();                
    layer++;
  }
  
}

setCenter(width/2, height/2);
polarEllipse(0, 50, 50, 0);

