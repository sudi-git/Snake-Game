
const GRID_SIZE = 20;
const SQUARE_SIZE = 20;
const MOVE_INTERVAL = 300;
const APPLE_COUNT = 3;
const APPLE_POINTS = 10;
const APPLE_LENGTH_INCREASE = 5;


let snake = [];
let obstacles = [];
let apples = [];
let direction = "right";
let score = 0;
let currentLength = 1;
let targetLength = 5;
let gameLoop;

// DOM Elements
const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const currentLengthDisplay = document.getElementById("current-length");
const targetLengthDisplay = document.getElementById("target-length");
const restartBtn = document.getElementById("restart-btn");

// Initialize the game
function initializeGame() {
  createGrid();
  createSnake();
  createObstacles();
  createApples();
  startGameLoop();
}

// Create the grid
function createGrid() {
  gameContainer.style.gridTemplateColumns = `repeat(${GRID_SIZE}, ${SQUARE_SIZE}px)`;
  gameContainer.style.gridTemplateRows = `repeat(${GRID_SIZE}, ${SQUARE_SIZE}px)`;

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    gameContainer.appendChild(square);
  }
}

// Create the snake and place it in the initial position
function createSnake() {
  const initialPosition = 0; // Upper left corner
  snake.push(initialPosition);
  displaySnake();
}

// Create obstacles and place them in predefined positions
function createObstacles() {
  const obstacleRows = [6, 12, 13, 18];

  obstacleRows.forEach((row) => {
    const middle = Math.floor(GRID_SIZE / 2);
    const start = middle - 2;
    const end = middle + 2;

    for (let col = start; col <= end; col++) {
      const position = row * GRID_SIZE + col;
      obstacles.push(position);
      gameContainer.children[position].classList.add("obstacle");
    }
  });
}

// Check if a position collides with an obstacle
function isObstacleCollision(position) {
  return obstacles.includes(position);
}

// Create apples and place them in random positions, avoiding the snake and obstacles
function createApples() {
  while (apples.length < APPLE_COUNT) {
    let position = getRandomPosition();
    if (
      !snake.includes(position) &&
      !apples.includes(position) &&
      !isObstacleCollision(position)
    ) {
      apples.push(position);
      gameContainer.children[position].classList.add("apple");
    }
  }
}

// Generate a random position on the grid
function getRandomPosition() {
  return Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
}

// Start the game loop
function startGameLoop() {
  gameLoop = setInterval(moveSnake, MOVE_INTERVAL);
}

// Move the snake
function moveSnake() {
  const head = snake[0];
  let newHead;

  // Determine the position of the new head based on the current direction
  switch (direction) {
    case "up":
      newHead = head - GRID_SIZE;
      break;
    case "down":
      newHead = head + GRID_SIZE;
      break;
    case "left":
      newHead = head % GRID_SIZE === 0 ? -1 : head - 1;
      break;
    case "right":
      newHead = (head + 1) % GRID_SIZE === 0 ? -1 : head + 1;
      break;
  }

  // Check for collisions
  if (isCollision(newHead)) {
    stopGame();
    return;
  }

  // Check for collision with apples
  const appleIndex = apples.indexOf(newHead);
  if (appleIndex !== -1) {
    apples.splice(appleIndex, 1);
    gameContainer.children[newHead].classList.remove("apple");
    score += APPLE_POINTS;
    scoreDisplay.textContent = score;
    targetLength += APPLE_LENGTH_INCREASE;
    targetLengthDisplay.textContent = targetLength;
    respawnApple();
  }

  // Update snake's position
  snake.unshift(newHead);
  displaySnake();
  currentLength = snake.length;
  currentLengthDisplay.textContent = currentLength;

  // Remove the tail if the snake exceeds the target length
  if (snake.length > targetLength) {
    removeTail();
  }
}

// collisions with walls, obstacles, or itself
function isCollision(position) {
  const col = position % GRID_SIZE;
  return (
    position < 0 ||
    position >= GRID_SIZE * GRID_SIZE ||
    col < 0 ||
    col >= GRID_SIZE ||
    snake.includes(position) ||
    isObstacleCollision(position)
  );
}

// Remove the tail of the snake
function removeTail() {
  const removedTail = snake.pop();
  gameContainer.children[removedTail].classList.remove("snake");
}

// Display the snake on the grid
function displaySnake() {
  gameContainer.querySelectorAll(".snake").forEach((square) => {
    square.classList.remove("snake");
  });

  snake.forEach((index) => {
    gameContainer.children[index].classList.add("snake");
  });
}

// Respawn an apple in a new random position
function respawnApple() {
  let position = getRandomPosition();
  while (
    snake.includes(position) ||
    apples.includes(position) ||
    isObstacleCollision(position)
  ) {
    position = getRandomPosition();
  }
  apples.push(position);
  gameContainer.children[position].classList.add("apple");
}

// Stop the game
function stopGame() {
  clearInterval(gameLoop);
  alert("!!! GAME OVER !!! YOUR SCORE IS " + score);
}

// Event listener for arrow key presses to change the direction of the snake

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (direction !== "down") direction = "up";
      break;
    case "ArrowDown":
      if (direction !== "up") direction = "down";
      break;
    case "ArrowLeft":
      if (direction !== "right") direction = "left";
      break;
    case "ArrowRight":
      if (direction !== "left") direction = "right";
      break;
  }
});

// Restart button event listener
restartBtn.addEventListener("click", () => {
  clearInterval(gameLoop);
  snake = [];
  apples = [];
  obstacles = [];
  direction = "right";
  score = 0;
  currentLength = 1;
  targetLength = 5;
  scoreDisplay.textContent = score;
  currentLengthDisplay.textContent = currentLength;
  targetLengthDisplay.textContent = targetLength;
  gameContainer
    .querySelectorAll(".snake, .apple, .obstacle")
    .forEach((square) => {
      square.classList.remove("snake", "apple", "obstacle");
    });
  createSnake();
  createObstacles();
  createApples();
  startGameLoop();
});

// Start the game
initializeGame();
