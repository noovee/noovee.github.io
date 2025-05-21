
let squareSize = 8;
let numSquares = 2400;
let maxSquares = 10000;
let controlHeight = 50;
let sliderX, sliderY, sliderW;
let isDragging = false;
let currentMode = 'prng';

function setup() {
  createCanvas(600, 600 + controlHeight);
  noStroke();

  sliderX = 50;
  sliderY = height - controlHeight / 2;
  sliderW = width - 100;

  background(255);
  generateCurrentMode();
}

function draw() {
  drawControlBar();
}

function keyPressed() {
  if (key === '1') {
    currentMode = 'prng';
    background(255);
    generateCurrentMode();
  } else if (key === '2') {
    currentMode = 'trng';
    background(255);
    generateCurrentMode();
  }
}

function mousePressed() {
  if (dist(mouseX, sliderY, constrain(mouseX, sliderX, sliderX + sliderW), sliderY) < 10) {
    isDragging = true;
    updateSlider(mouseX);
  }
}

function mouseDragged() {
  if (isDragging) {
    updateSlider(mouseX);
  }
}

function mouseReleased() {
  isDragging = false;
}

function updateSlider(x) {
  let percent = constrain((x - sliderX) / sliderW, 0, 1);
  numSquares = floor(100 + percent * (maxSquares - 100));
  background(255);
  generateCurrentMode();
}

function generateCurrentMode() {
  if (currentMode === 'prng') {
    generateSymmetricPRNG();
  } else {
    generateTRNG();
  }
}

// PRNG con forte simmetria e ripetizione, ma senza griglia
function generateSymmetricPRNG() {
  randomSeed(millis());

  let squares = [];

  for (let i = 0; i < numSquares / 2; i++) {
    let x = random(width / 2);
    let y = random(height - controlHeight);

    // Piccolo jitter per non sembrare allineati
    let jitterX = random(-2, 2);
    let jitterY = random(-2, 2);

    squares.push({ x: x + jitterX, y: y + jitterY });
    // Simmetrico a specchio
    squares.push({ x: width - x + jitterX, y: y + jitterY });
  }

  // Shuffle per renderli più dispersi
  shuffle(squares, true);

  for (let i = 0; i < min(numSquares, squares.length); i++) {
    let s = squares[i];
    fill(0);
    rect(s.x, s.y, squareSize, squareSize);
  }
}

// TRNG – completamente casuale con crypto
function generateTRNG() {
  let randArray = new Uint32Array(numSquares * 2);
  crypto.getRandomValues(randArray);

  for (let i = 0; i < numSquares; i++) {
    let x = randArray[i] % width;
    let y = randArray[i + numSquares] % (height - controlHeight);
    fill(0);
    rect(x, y, squareSize, squareSize);
  }
}

// Slider e barra di controllo
function drawControlBar() {
  fill(240);
  rect(0, height - controlHeight, width, controlHeight);

  stroke(180);
  strokeWeight(2);
  line(sliderX, sliderY, sliderX + sliderW, sliderY);

  noStroke();
  let percent = (numSquares - 100) / (maxSquares - 100);
  let handleX = sliderX + percent * sliderW;
  fill(0);
  circle(handleX, sliderY, 12);

  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);
  text(`Quadratini: ${numSquares} | Modalità: ${currentMode.toUpperCase()}`, width / 2, height - controlHeight + 15);
}
