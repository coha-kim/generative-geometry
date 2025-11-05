let layer = 0;
const maxLayers = 7;
let radius;
let angle = 0;
let numShape = 6;
let buffer;
let myFont;
let saveBtn;
let downloadPatternBtn;
let addToCollectionBtn;

let buttons = [];
let questionText = "";
let showQuestion = true;
let allQuestionsAnswered = false;

let questions = [];
let questionOptions = [];
let currentQuestionIndex = 0;
let userAnswers = []; // Track user's answers for each layer
let dateString = ""; // Will store formatted date

function preload() {
  myFont = loadFont("assets/otf/Velvelyne-Regular.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#F2F0F3");
  angleMode(RADIANS);
  rectMode(CORNERS);
  noStroke();

  textFont(myFont);
  textSize(30);
  fill(0);
  
  // Load questions and their options from HTML
  const questionElements = document.querySelectorAll('#questions-container .question');
  questions = Array.from(questionElements).map(el => el.textContent.trim());
  questionOptions = Array.from(questionElements).map(el => {
    const optionsData = el.getAttribute('data-options');
    return optionsData ? JSON.parse(optionsData) : [];
  });
  questionText = questions[currentQuestionIndex] || "";
  
  // Generate date string for today
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  dateString = today.toLocaleDateString('en-US', options);
  
  // Create graphics buffer for all shapes
  buffer = createGraphics(width, height);
  buffer.angleMode(RADIANS);
  buffer.rectMode(CORNERS);
  buffer.noStroke();
  buffer.clear(); 

   
  // Automatically draw center circle at start
  drawCenterCircle();
  
  // Download pattern button (initially hidden)
  downloadPatternBtn = createButton("Download Pattern");
  downloadPatternBtn.position(120, height / 2 + 60); // 40px (textSize) + 20px gap
  downloadPatternBtn.addClass("download-btn");
  downloadPatternBtn.mousePressed(() => {
    // Calculate the center coordinates
    const centerX = width * 0.75;
    const centerY = height / 2;
    
    // Calculate the radius that encompasses all layers
    // The largest circle has radius 420/2 = 210
    // The outermost layer shapes extend beyond this 
    const maxShapeRadius = (maxLayers - 0) * 20; // 140
    const totalRadius = 100 + maxShapeRadius;
    
    const cropSize = totalRadius * 2 - 40; 
    
    // Calculate crop region (center minus half the size)
    const cropX = centerX - (cropSize / 2);
    const cropY = centerY - (cropSize / 2);
    
    // Create a new graphics buffer with exact crop size
    const patternBuffer = createGraphics(cropSize, cropSize);
    patternBuffer.angleMode(RADIANS);
    patternBuffer.rectMode(CORNERS);
    patternBuffer.noStroke();
    
    // Copy the cropped region from main buffer to pattern buffer
    patternBuffer.image(buffer, -cropX, -cropY);
    
    // Get the pattern image from the pattern buffer
    const patternImg = patternBuffer.get(0, 0, cropSize, cropSize);
    
    // Save the image
    save(patternImg, 'myPattern', 'png');
  });
  downloadPatternBtn.hide();

  // Add to Collection button (initially hidden)
  addToCollectionBtn = createButton("Add to Collection");
  addToCollectionBtn.position(120, height / 2 + 120); // Below download button
  addToCollectionBtn.addClass("download-btn");
  addToCollectionBtn.mousePressed(() => {
    // Calculate the center coordinates (same as download button)
    const centerX = width * 0.75;
    const centerY = height / 2;
    
    // Calculate the radius that encompasses all layers
    const maxShapeRadius = (maxLayers - 0) * 20;
    const totalRadius = 100 + maxShapeRadius;
    const cropSize = totalRadius * 2 - 40;
    
    // Calculate crop region
    const cropX = centerX - (cropSize / 2);
    const cropY = centerY - (cropSize / 2);
    
    // Create a new graphics buffer with exact crop size
    const patternBuffer = createGraphics(cropSize, cropSize);
    patternBuffer.angleMode(RADIANS);
    patternBuffer.rectMode(CORNERS);
    patternBuffer.noStroke();
    
    // Copy the cropped region from main buffer to pattern buffer
    patternBuffer.image(buffer, -cropX, -cropY);
    
    // Get PNG data URL directly from the pattern buffer's canvas
    const imageDataUrl = patternBuffer.canvas.toDataURL('image/png');
    
    // Save to localStorage
    const savedPatterns = localStorage.getItem('shapeOfDaysPatterns');
    const patterns = savedPatterns ? JSON.parse(savedPatterns) : [];
    
    patterns.push({
      imageData: imageDataUrl,
      date: dateString,
      timestamp: Date.now()
    });
    
    localStorage.setItem('shapeOfDaysPatterns', JSON.stringify(patterns));
    
    // Redirect to stats page
    window.location.href = 'stats.html';
  });
  addToCollectionBtn.hide();

  // Create answer buttons (will be updated for each question)
  createAnswerButtons();
}

function createAnswerButtons() {
  // Clear existing buttons
  buttons.forEach(btn => btn.remove());
  buttons = [];
  
  // Get options for current question
  const options = questionOptions[currentQuestionIndex] || [];
  
  // Create buttons for current question's options
  const startX = 140;
  const startY = height / 2 - 30;
  const buttonSpacing = 60;

  for (let i = 0; i < options.length; i++) {
    let btn = createButton(options[i].label);
    btn.addClass("answer-btn");
    btn.position(startX, startY + i * buttonSpacing);
    btn.mousePressed(() => handleAnswer(options[i].value));
    buttons.push(btn);
  }
}

function draw() {
  // Clear main canvas
  background("#F2F0F3");
  
  // Draw the graphics buffer to the main canvas
  image(buffer, 0, 0);
  
  const textX = 160;
  const textY = height / 2 - 150;
  const maxTextWidth = width / 2 - 260;
  const padding = 20;

  // Clear previous question area
  push();
  noStroke();
  fill("#F2F0F3");
  rect(
    textX - padding,
    textY - 40,
    textX + maxTextWidth + padding,
    textY + 120
  );
  pop();

  // Draw question text if visible
  if (showQuestion) {
    push();
    fill(0);
    textSize(40);
    textAlign(LEFT, TOP);
    textWrap(WORD);
    text(questionText, textX, textY, maxTextWidth, 200);
    pop();
  }
  
  // Draw end screen text if all questions are answered
  if (allQuestionsAnswered) {
    push();
    fill(0);
    textSize(40);
    textAlign(LEFT);
    text("Shape of " + dateString, 120, height / 2);
    pop();
  }
}

function drawCenterCircle() {
  const centerX = width * 0.75;
  const centerY = height / 2;
  buffer.push();
  buffer.fill("#000000");
  buffer.noStroke();
  buffer.circle(centerX, centerY, 420);
  buffer.pop();
}

function radiusIndex(radius, angle) {
  for (i = maxLayers; i < 0; i--) {
    radius = i * 200;
    angle += 2 / PI;
  }
}

function drawTriangle() {
  buffer.push();
  buffer.polarTriangles(numShape, 50, radius);
  buffer.pop();
}

function drawCircle() {
  buffer.push();
  buffer.polarEllipses(numShape, 50, 50, radius);
  buffer.pop();
}

function drawPetal() {
  buffer.push();
  buffer.polarEllipses(numShape, 30, 50, radius);
  buffer.pop();
}

function drawPolygon() {
  buffer.push();
  buffer.polarPolygons(numShape, 4, 65, radius);
  buffer.pop();
}

function handleAnswer(value) {
  showQuestion = false;
  buttons.forEach((btn) => btn.hide());

  // Store the answer and process it
  userAnswers.push(value);
  processInput(value);

  // Move to next question if available
  if (layer < 6 && currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    questionText = questions[currentQuestionIndex];
    
    // Update buttons for the new question
    createAnswerButtons();

    setTimeout(() => {
      showQuestion = true;
      buttons.forEach((btn) => btn.show());
    }, 400);
  } else {
    // End screen
    allQuestionsAnswered = true;
    downloadPatternBtn.show();
    downloadPatternBtn.position(120, height / 2 + 60);
    addToCollectionBtn.show();
    addToCollectionBtn.position(120, height / 2 + 120);
  }
}



function processInput(key) {
  const centerX = width * 0.75;
  const centerY = height / 2;
  const keyMap = {
    1: { func: drawCircle, color: "#EF4328", sizeOffset: [2, 2] },
    2: { func: drawPetal, color: "#F6A4A7", sizeOffset: [2, 2] },
    3: { func: drawTriangle, color: "#3661AC", sizeOffset: [2] },
    4: { func: drawPolygon, color: "#B8B99A", sizeOffset: [2] },
  };

  if (keyMap[key] && layer < maxLayers) {
    const baseRadius = (maxLayers - layer) * 20;
    const alphaVal = 255;

    buffer.push();
    buffer.translate(centerX, centerY);
    buffer.rotate((layer * TWO_PI) / (numShape * 2));

    // Draw white underlayer with transparency
    buffer.push();
    radius = baseRadius;
    buffer.fill(255, 255, 255, alphaVal);
    if (key == 2) {
      buffer.polarEllipses(
        numShape,
        30 + keyMap[key].sizeOffset[0],
        50 + keyMap[key].sizeOffset[1],
        radius
      );
    } else if (key == 1) {
      buffer.polarEllipses(
        numShape,
        50 + keyMap[key].sizeOffset[0],
        50 + keyMap[key].sizeOffset[1],
        radius
      );
    } else if (key == 3) {
      buffer.polarTriangles(numShape, 50 + keyMap[key].sizeOffset[0], radius);
    } else if (key == 4) {
      buffer.polarPolygons(numShape, 4, 65 + keyMap[key].sizeOffset[0], radius);
    }
    buffer.pop();

    // Draw main colored shape with transparency
    buffer.push();
    radius = baseRadius;
    let c = color(keyMap[key].color);
    c.setAlpha(alphaVal);
    buffer.fill(c);
    keyMap[key].func();
    buffer.pop();

    buffer.pop();
    layer++;

    // small center circle (unaffected by slider)
    buffer.push();
    buffer.fill("#e7c936ff");
    buffer.noStroke();
    buffer.circle(centerX, centerY, 50);
    buffer.pop();
  }
}

function keyPressed() {
  // Keep keyboard functionality as backup
  if (!showQuestion && (key == "1" || key == "2" || key == "3" || key == "4")) {
    processInput(parseInt(key));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Recreate buffer with new dimensions
  buffer = createGraphics(width, height);
  buffer.angleMode(RADIANS);
  buffer.rectMode(CORNERS);
  buffer.noStroke();
  buffer.clear();
  // Redraw center circle
  drawCenterCircle();
  // Update button positions
  if (downloadPatternBtn) {
    downloadPatternBtn.position(120, height / 2 + 60);
  }
  if (addToCollectionBtn) {
    addToCollectionBtn.position(120, height / 2 + 120);
  }
}