let layer = 0;
const maxLayers = 7;
let radius;
let angle = 0;
let numShape = 6;
let buffer;
let myFont;
let myFontBook;
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

// DOM elements for end screen
let endScreenTextEl;
let contextImageContainerEl;
let readYourDayTextEl;
let dateTextElement;
let descriptionTextContainerEl;
let questionTextDisplayEl;

function preload() {
  myFont = loadFont("assets/otf/Velvelyne-Regular.otf");
  myFontBook = loadFont("assets/otf/Velvelyne-Book.otf");
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
  
  // Cache DOM elements for end screen
  endScreenTextEl = document.getElementById('end-screen-text');
  contextImageContainerEl = document.getElementById('context-image-container');
  readYourDayTextEl = document.getElementById('read-your-day-text');
  dateTextElement = document.getElementById('date-text');
  descriptionTextContainerEl = document.getElementById('description-text-container');
  questionTextDisplayEl = document.getElementById('question-text-display');
  
  // Initialize date text if element exists
  if (dateTextElement) {
    dateTextElement.textContent = dateString;
  }
  
  // Initialize question text display if element exists
  if (questionTextDisplayEl && questionText) {
    questionTextDisplayEl.textContent = questionText;
    if (showQuestion) {
      questionTextDisplayEl.classList.add('show');
    }
  }
  
  // Create graphics buffer for all shapes
  buffer = createGraphics(width, height);
  buffer.angleMode(RADIANS);
  buffer.rectMode(CORNERS);
  buffer.noStroke();
  buffer.clear(); 

   
  // Automatically draw center circle at start
  drawCenterCircle();
  
  // Download pattern button (initially hidden)
  downloadPatternBtn = createButton("Save your day");
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
    
    // Generate filename with today's date in YYYY-MM-DD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const filename = `${year}-${month}-${day}-shape`;
    
    // Save the image
    save(patternImg, filename, 'png');
  });
  downloadPatternBtn.hide();

  // Add to Collection button (initially hidden)
  addToCollectionBtn = createButton("Gather to compare");
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
  const buttonSpacing = 40;

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
  
  // Show/hide question text HTML element
  if (questionTextDisplayEl) {
    if (showQuestion && questionText) {
      questionTextDisplayEl.textContent = questionText;
      questionTextDisplayEl.classList.add('show');
    } else {
      questionTextDisplayEl.classList.remove('show');
      questionTextDisplayEl.textContent = '';
    }
  }
  
  // Show/hide end screen HTML elements if all questions are answered
  if (allQuestionsAnswered) {
    // Update date text
    if (dateTextElement) {
      dateTextElement.textContent = dateString;
    }
    // Show HTML elements
    if (endScreenTextEl) {
      endScreenTextEl.classList.add('show');
    }
    if (contextImageContainerEl) {
      contextImageContainerEl.classList.add('show');
    }
    if (readYourDayTextEl) {
      readYourDayTextEl.classList.add('show');
    }
    if (descriptionTextContainerEl) {
      descriptionTextContainerEl.classList.add('show');
    }
  } else {
    // Hide HTML elements
    if (endScreenTextEl) {
      endScreenTextEl.classList.remove('show');
    }
    if (contextImageContainerEl) {
      contextImageContainerEl.classList.remove('show');
    }
    if (readYourDayTextEl) {
      readYourDayTextEl.classList.remove('show');
    }
    if (descriptionTextContainerEl) {
      descriptionTextContainerEl.classList.remove('show');
    }
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
      // Update question text display when showing question
      if (questionTextDisplayEl && questionText) {
        questionTextDisplayEl.textContent = questionText;
        questionTextDisplayEl.classList.add('show');
      }
    }, 400);
  } else {
    // End screen
    allQuestionsAnswered = true;
    // Position buttons below description text
    // Calculate button position based on actual height of description text container
    const buttonX = 206; // Align with description text and image
    
    // Use setTimeout to ensure description text is rendered and we can get its actual height
    setTimeout(() => {
      if (descriptionTextContainerEl) {
        // Get the actual bottom position of the description text container
        const containerRect = descriptionTextContainerEl.getBoundingClientRect();
        const containerBottom = containerRect.bottom;
        // Add 24px gap below the description text
        const buttonY = containerBottom + 24;
        
        downloadPatternBtn.show();
        downloadPatternBtn.position(buttonX, buttonY);
        
        // Get width of first button and position second button next to it with 24px gap
        const firstButtonWidth = downloadPatternBtn.elt.offsetWidth || 150; // fallback width
        addToCollectionBtn.show();
        addToCollectionBtn.position(buttonX + firstButtonWidth + 24, buttonY);
      } else {
        // Fallback if element not found - use estimated position
        const buttonY = 555;
        downloadPatternBtn.show();
        downloadPatternBtn.position(buttonX, buttonY);
        setTimeout(() => {
          const firstButtonWidth = downloadPatternBtn.elt.offsetWidth || 150;
          addToCollectionBtn.show();
          addToCollectionBtn.position(buttonX + firstButtonWidth + 24, buttonY);
        }, 0);
      }
    }, 0);
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
  // Update button positions (below description text, side by side)
  const buttonX = 206;
  if (downloadPatternBtn && allQuestionsAnswered && descriptionTextContainerEl) {
    // Calculate button position based on actual height of description text container
    setTimeout(() => {
      const containerRect = descriptionTextContainerEl.getBoundingClientRect();
      const containerBottom = containerRect.bottom;
      const buttonY = containerBottom + 24; // 24px gap below description text
      
      downloadPatternBtn.position(buttonX, buttonY);
      // Position second button next to first with 24px gap
      if (addToCollectionBtn) {
        const firstButtonWidth = downloadPatternBtn.elt.offsetWidth || 150;
        addToCollectionBtn.position(buttonX + firstButtonWidth + 24, buttonY);
      }
    }, 0);
  }
}