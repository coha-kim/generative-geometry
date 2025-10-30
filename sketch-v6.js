let layer = 0;
const maxLayers = 7;
let radius;
let angle = 0;
let numShape = 6;

let buttons = [];
let questionText = "How many in-person interactions have you had today?";
let showQuestion = true;

const questions = [
  "How many in-person interactions have you had today?",
  "How productive did you feel today?",
  "How balanced was your day between work and rest?",
  "How satisfied are you with your level of exercise today?",
  "How enjoyable were your social interactions today?",
  "How would you rate your overall mood today?",
];

let currentQuestionIndex = 0;
questionText = questions[currentQuestionIndex];

function setup() {
  createCanvas(1920, 1080);
  background("#D5D9CD");
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

  // Create 4 answer buttons
  const options = [
    { label: "1-2 times", value: 1 },
    { label: "10-20 times", value: 2 },
    { label: "20-30 times", value: 3 },
    { label: "30-40 times", value: 4 },
  ];

  // Position buttons in the center
  let startX = 80;
  let startY = height / 2 - 30;
  let buttonSpacing = 60;

for (let i = 0; i < options.length; i++) {
  let btn = createButton(options[i].label);
  btn.addClass("answer-btn"); // add CSS class
  btn.position(startX, startY + i * buttonSpacing);
  btn.mousePressed(() => handleAnswer(options[i].value));
  buttons.push(btn);
}
}

function draw() {
  const textX = 160;
  const textY = height / 2 - 150;
  const maxTextWidth = width / 2 - 260;
  const padding = 20;

  // Always clear a consistent text zone (enough for long questions)
  push();
  noStroke();
  fill("#D5D9CD"); // background color
  rect(textX - padding, textY - 40, textX + maxTextWidth + padding, textY + 120);
  pop();

  // Draw question text if visible
  if (showQuestion) {
    push();
    fill(255);
    textSize(24);
    textAlign(LEFT, TOP);
    textWrap(WORD);
    text(questionText, textX, textY, maxTextWidth, 200);
    pop();
  }
}

function drawCenterCircle() {
  const centerX = width * 0.75;
  const centerY = height / 2;
  push();
  fill("#000000");
  noStroke();
  circle(centerX, centerY, 420);
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

function handleAnswer(value) {
  showQuestion = false; // hide question right after answering
  buttons.forEach((btn) => btn.hide());

  processInput(value); // draw the shape layer (keeps all previous ones)

  // Move to next question if available
  if (layer < 6 && currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    questionText = questions[currentQuestionIndex];

    // Delay before showing next question (optional)
    setTimeout(() => {
      showQuestion = true;
      buttons.forEach((btn) => btn.show());
    }, 400);
    // } else {
    //   // End screen
    //   fill(255);
    //   textSize(28);
    //   textAlign(CENTER);
    //   text("Thank you for your responses!", width / 2, height / 2);
  }
}

function processInput(key) {
  const centerX = width * 0.75;
  const centerY = height / 2;
  const keyMap = {
    1: { func: drawCircle, color: "#BFE1E7", sizeOffset: [2, 2] },
    2: { func: drawPetal, color: "#EBD394", sizeOffset: [2, 2] },
    3: { func: drawTriangle, color: "#87A48D", sizeOffset: [2] },
    4: { func: drawPolygon, color: "#db938eff", sizeOffset: [2] },
  };

  if (keyMap[key] && layer < maxLayers) {
    const baseRadius = (maxLayers - layer) * 20;
    const alphaVal = alphaSlider.value(); // get slider value

    push();
    translate(centerX, centerY);
    rotate((layer * TWO_PI) / (numShape * 2));

    // Draw white underlayer with transparency
    push();
    radius = baseRadius;
    fill(255, 255, 255, alphaVal);
    if (key == 2) {
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
    fill("#E3D780");
    noStroke();
    circle(centerX, centerY, 50);
    pop();
  }
}

function keyPressed() {
  // Keep keyboard functionality as backup
  if (!showQuestion && (key == "1" || key == "2" || key == "3" || key == "4")) {
    processInput(parseInt(key));
  }
}
