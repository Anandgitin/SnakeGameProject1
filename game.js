let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let snake;
let food;
let gameInterval;
let playerName = "";
let difficulty = "easy";
let score = 0;
let foodCollected = 0;

const tileSize = 20;
const canvasSize = 400;

// Set difficulty speed
const setDifficulty = (level) => {
    switch(level) {
        case 'easy': return 150;  // Slow speed
        case 'medium': return 100; // Medium speed
        case 'hard': return 50;  // Fast speed
        default: return 150;
    }
};

// Function to start the game
const startGame = () => {
    // Reset game state
    snake = [{ x: 9 * tileSize, y: 9 * tileSize }];
    food = generateFood();
    score = 0;
    foodCollected = 0;
    playerName = document.getElementById("playerName").value || "Player";
    difficulty = document.getElementById("level").value;

    let gameSpeed = setDifficulty(difficulty);

    // Set up game interval
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
};

// Generate food at random location
const generateFood = () => {
    return {
        x: Math.floor(Math.random() * (canvasSize / tileSize)) * tileSize,
        y: Math.floor(Math.random() * (canvasSize / tileSize)) * tileSize,
    };
};

// Function to draw the snake
const drawSnake = () => {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "green" : (index % 5 === 0 ? "lime" : "lightgreen");  // Make larger every 5th piece
        ctx.fillRect(segment.x, segment.y, tileSize, tileSize);
    });
};

// Function to draw food
const drawFood = () => {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, tileSize, tileSize);
};

// Game loop
const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSnake();
    drawFood();

    // Snake movement logic
    let head = { ...snake[0] };
    switch (direction) {
        case "up": head.y -= tileSize; break;
        case "down": head.y += tileSize; break;
        case "left": head.x -= tileSize; break;
        case "right": head.x += tileSize; break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        foodCollected++;
        food = generateFood();

        // Every 5th food collection, make the snake grow
        if (foodCollected % 5 === 0) {
            // Increase the size of the snake segment
            snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
        }
    } else {
        snake.pop();
    }

    // Check for collision with wall
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameOver();
    }

    // Check for collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
};

// End the game and check for high scores
const gameOver = () => {
    clearInterval(gameInterval);

    // Check and store high score
    let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    if (score > Math.min(...highScores.map(s => s.score), 0)) {
        highScores.push({ name: playerName, score });
        highScores.sort((a, b) => b.score - a.score); // Sort by score in descending order
        highScores = highScores.slice(0, 3); // Keep top 3 scores
        localStorage.setItem("highScores", JSON.stringify(highScores));
    }

    displayHighScores();
    alert("Game Over! Your score: " + score);
};

// Display high scores
const displayHighScores = () => {
    const scoreList = document.getElementById("scoreList");
    let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

    scoreList.innerHTML = highScores.map(s => `<li>${s.name}: ${s.score}</li>`).join("");
};

// Handle keyboard input for snake direction
let direction = "right";
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp": if (direction !== "down") direction = "up"; break;
        case "ArrowDown": if (direction !== "up") direction = "down"; break;
        case "ArrowLeft": if (direction !== "right") direction = "left"; break;
        case "ArrowRight": if (direction !== "left") direction = "right"; break;
    }
});

// Start the game when the button is clicked
document.getElementById("startGame").addEventListener("click", startGame);

// Display the high scores on initial page load
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
displayHighScores();
