let layer = 0;
const maxLayers = 5;
let layerShapes = [];
let radius;

function setup() {
  createCanvas(400,400);
  background("#e0f8e2ff");
  angleMode(radians);
  rectMode(CORNERS);
  noStroke();
}

function radiusIndex(radius) {
  for(i=maxLayers; i<0; i--) {
    radius = i;
  }
  
}


function drawTriangle() {
  push();
  fill(0, 255, 0, 100);
  setCenter(width / 2, height / 2);
  polarTriangles(6, 50, radius);
  pop();
}

function drawCircle() {
  push();
  fill(100, 100, 0, 100);  // green with %50 alpha
  setCenter(width / 2, height / 2);
  polarEllipses(6, 50, 50, radius);
  pop();
}

function drawPetal() {
  push();
  fill(0, 255, 0, 127);
  setCenter(width / 2, height / 2);
  polarEllipses(6,30,50,radius);
  pop();
}


function drawRect() {
  push();
  fill(200, 100, 100, 100);
  setCenter(width / 2, height / 2);
  polarSquares(6,50, radius);
  pop();
}

function drawPolygon() {
  push();
  fill(180, 80, 190, 127);
  setCenter(width / 2, height / 2);
  polarPolygons(6,4,50, radius);
  pop();
};

// function drawShapes() {
//   for (let fn of layerShapes) {
//     push(); 
//     fn();
//     pop();
//   }
// }

// function keyPressed() {
//   const keyMap = {
//     1: drawCircle,
//     2: drawPetal,
//     3: drawTriangle,
//     4: drawPolygon,
//   };
  
//   if (keyMap[key] && layer < maxLayers) {
//     layerShapes.push(keyMap[key]);
//     layer++;
    
//     // resetMatrix();
//     drawShapes(); // draw everything after adding
//   }
  
// }



function drawShapes() {
  
}



