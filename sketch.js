let myTri, mySquare, myPenta, myCircle, myElipse;
let radius = 40;
let numPolygon = 7;
let numShape = 4;
let shapeList = [];
let imgSize = 100;
let cols, rows;

function preload() {
  myTri = loadImage("assets/triangle.svg");
  mySquare = loadImage("assets/square.svg");
  myCircle = loadImage("assets/circle.svg");
  myPenta = loadImage("assets/pentagon.svg");
  myElipse = loadImage("assets/fragment-circle.svg");
}

function setup() {
  // slider = createSlider(0, 10, 0, 0);
  // slider.position(10, 10);
  // slider.size(100);

  createCanvas(400, 400);

  // Rotation angle slider
  angleSlider = createSlider(0, TWO_PI, 0, 0.01);
  angleSlider.position(10, 10);
  angleSlider.size(100);

  // Offset range slider
  offsetSlider = createSlider(0, imgSize / 2, imgSize / 4, 1);
  offsetSlider.position(10, 40);
  offsetSlider.size(100);

  cols = width / imgSize;
  rows = height / imgSize;

  imageMode(CENTER);
}


// organised, no control
function shape1() {
  translate(width / 2, height / 2);

  for (let i = 0; i < numPolygon; i++) {
    let angle = (TWO_PI / numPolygon) * i;

    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    let x1 = cos(angle) * (3 * radius);
    let y1 = sin(angle) * (3 * radius);

    push();
    translate(x, y);
    rotate(angle + 0.5 * PI);
    image(myTri, 0, 0);
    image(myCircle, 10, 10);
    pop();

    push();
    translate(x1, y1);
    rotate(angle + 0.5 * PI);
    image(myElipse, 0, 0);
    pop();
  }
}

// randomised # of sides of a polygon
function shape2() {
  let shapeList = [myCircle, myElipse, myTri, mySquare, myPenta];
  imageMode(CORNERS);

  push();
  translate(width / 2, height / 2);

  for (let i = 0; i < numPolygon; i++) {
    let angle = (TWO_PI / numPolygon) * i;

    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    let x1 = cos(angle) * (3 * radius);
    let y1 = sin(angle) * (3 * radius);
    let randomPolygon = shapeList[floor(random(0, 4))];

    push();

    translate(x, y);
    rotate(angle + 0.5 * PI);
    image(randomPolygon, 0, 0);
    image(randomPolygon, 10, 10);
    pop();

    push();
    translate(x1, y1);
    rotate(angle + 0.5 * PI);
    image(randomPolygon, 0, 0);
    pop();
  }
  pop();
}

// organised, user control for polygon angle
function shape3() {
  translate(width / 2, height / 2);
  let g = slider.value();

  for (let i = 0; i < numPolygon; i++) {
    let angle = (TWO_PI / numPolygon) * i;

    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    let x1 = cos(angle) * (3 * radius);
    let y1 = sin(angle) * (3 * radius);

    let x2 = cos(angle) * (4 * radius);
    let y2 = sin(angle) * (4 * radius);

    push();
    translate(x, y);
    rotate(angle + 0.5 * PI);
    image(myTri, 0, 0);
    image(myCircle, 10, 10);
    pop();

    push();
    translate(x1, y1);
    rotate(angle + g * PI);
    image(myElipse, 0, 0);
    pop();

    push();
    translate(x2, y2);
    rotate(angle + 0.75 * PI);
    image(mySquare, 0, 0);
    image(myCircle, 10, 10);
    pop();
    // push();
    // tint(200,100);
    // translate(x2, y2);
    // rotate(angle+PI*0.84);
    // image(myPenta, 0, 0);
    // pop();
  }
}

// grid - multiple polygons in each grid
function shape4() {
  let shapeList = [myCircle, myElipse, myTri, mySquare, myPenta];
  let angle = angleSlider.value();
  let maxOffset = offsetSlider.value();


  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      push();
      translate(x * imgSize + imgSize / 2, y * imgSize + imgSize / 2);

      // draw multiple shapes inside one grid
      let numShapesPerCell = int(random(2, 5)); // 2–4 shapes per cell

      for (let i = 0; i < numShapesPerCell; i++) {
        let shapeDraw = random(shapeList);
        let offsetX = random(-maxOffset, maxOffset);
        let offsetY = random(-maxOffset, maxOffset);
        let size = random(imgSize * 0.4, imgSize * 0.8);

        push();
        translate(offsetX, offsetY);
        rotate(angle + random(-0.5, 0.5));
        image(shapeDraw, 0, 0, size, size);
        pop();
      }

      pop();
    }
  }
}

function draw() {
  background(0);
  tint(255, 180);

  randomSeed(0);

  shape4();



}
