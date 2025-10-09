let myTri, mySquare, myPenta, myCircle, myElipse;
let radius = 40;
let numPolygon = 7;
let numShape = 4;

function preload() {
  myTri = loadImage("assets/triangle.svg");
  mySquare = loadImage("assets/square.svg");
  myCircle = loadImage("assets/circle.svg");
  myPenta = loadImage("assets/pentagon.svg");
  myElipse = loadImage("assets/fragment-circle.svg");
}

function setup() {
  createCanvas(400,400);
}


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


function shape2() {
  
}

function draw() {
  background(0);
  tint(255, 100);


  scale(0.5);
  shape1();




  noLoop();

}
