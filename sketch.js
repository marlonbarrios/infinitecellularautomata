// Define global variables
let cells = []; // Array to store the current state of each cell
let history = []; // Array to store the history of cell states for scrolling effect
let ruleSet; // Variable to store the current rule set in binary format
let w = 4; // Width of each cell in pixels
let startRule = 90; // Initial rule number to start with
let showRule = false; // Flag to toggle rule display
let pauseGeneration = false; // Flag to toggle the generation process

// A predefined collection of rules to choose from
let ruleCollection = [235, 30, 110, 57, 62, 75, 22];

// Function to set the rules based on a given rule number
function setRules(ruleValue) {
  ruleSet = ruleValue.toString(2); // Convert rule number to binary string
  // Pad the ruleSet with leading zeros to ensure it is 8 digits long
  while (ruleSet.length < 8) {
    ruleSet = "0" + ruleSet;
  }
}

// P5.js setup function, runs once at the beginning
function setup() {
  createCanvas(windowWidth, windowHeight); // Create a canvas that fills the window
  setRules(startRule); // Initialize the rule set

  let total = width / w; // Calculate the total number of cells
  // Initialize all cells to 0 (dead)
  for (let i = 0; i < total; i++) {
    cells[i] = 0;
  }
  // Set the middle cell to 1 (alive)
  cells[floor(total / 2)] = 1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// P5.js keyPressed function, triggered when any key is pressed
function keyPressed() {
  // Toggle rule display on pressing 'R'
  if (key === 'r' || key === 'R') {
    showRule = !showRule;
  }
  
  // Toggle generation on/off on pressing spacebar
  if (key === ' ') {
    pauseGeneration = !pauseGeneration;
  }

  if (key === 's' || key === 'S') {
    saveCanvas('rule' + parseInt(ruleSet, 2), 'png'); 
  }
}

// P5.js draw function, runs continuously
function draw() {
  if (!pauseGeneration) {
    history.push(cells.slice()); // Only add to history if not paused

    // Randomly change the rule set occasionally
    if (random(1) < 0.01) {
      let nextRule = random(ruleCollection);
      setRules(nextRule);
      cells[floor(cells.length / 2)] = 1;
    }

    let cols = height / w; // Calculate the number of columns
    // Remove the oldest history if it exceeds the canvas height
    if (history.length > cols + 1) {
      history.splice(0, 1);
    }
  }

  let y = 0; // Y position for drawing cells
  background(255); // Set background to white
  // Loop through the history and draw each generation of cells
  for (let cells of history) {
    for (let i = 0; i < cells.length; i++) {
      let x = i * w; // X position for each cell
      // Draw a black square for each alive cell
      if (cells[i] == 1) {
        noStroke();
        fill(0);
        square(x, y - w, w);
      }
    }
    y += w; // Move down for the next generation
    }
    
    // Calculate the next state for each cell
    let nextCells = [];
    let len = cells.length;
    for (let i = 0; i < len; i++) {
    let left = cells[(i - 1 + len) % len]; // Left neighbor
    let right = cells[(i + 1) % len]; // Right neighbor
    let state = cells[i]; // Current cell state
    // Determine the next state based on neighbors and the rule set
    nextCells[i] = calculateState(left, state, right);
    }
    
    if (!pauseGeneration) {
    cells = nextCells; // Update cells only if not paused
    }
    
    // Display the rule if showRule is true
    if (showRule) {
    fill(0); // Black text
    noStroke(); // No border
    rect(0, height - 40, width, 40); // Draw a rectangle for the rule display
    fill(255); // White text
    textSize(30); // Text size of 30 pixels
    textAlign(CENTER, BOTTOM); // Align text to the bottom right
    text("Rule: " + parseInt(ruleSet, 2), width/2, height - 5); // Display rule
    }
    }
    
    // Function to calculate the next state of a cell
    function calculateState(a, b, c) {
    let neighborhood = "" + a + b + c; // Create a string representing the neighborhood
    let value = 7 - parseInt(neighborhood, 2); // Convert to binary and find rule index
    return parseInt(ruleSet[value]); // Return the new state based on the rule set
    }
    
    