// snake.js

let direction = { x: 0, y: 0 }; // Initial movement direction
let speed = 5;
let lastPaintTime = 0;
let snakeArr = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let score = 0;  // Initialize score
let board = document.querySelector('.board');
let scoreDisplay = document.querySelector('.score'); // Element to display score
let gridSize = 20; // Adjust grid size

// Detect cursor movement
document.addEventListener("mousemove", (event) => {
    let boardRect = board.getBoundingClientRect();
    let cursorX = event.clientX - boardRect.left;
    let cursorY = event.clientY - boardRect.top;

    // Convert cursor position to grid coordinates
    let gridX = Math.floor(cursorX / gridSize) + 1;
    let gridY = Math.floor(cursorY / gridSize) + 1;

    // Change direction based on cursor position (Prevent reverse movement)
    if (gridX > snakeArr[0].x && direction.x !== -1) {
        direction = { x: 1, y: 0 };
    } else if (gridX < snakeArr[0].x && direction.x !== 1) {
        direction = { x: -1, y: 0 };
    } else if (gridY > snakeArr[0].y && direction.y !== -1) {
        direction = { x: 0, y: 1 };
    } else if (gridY < snakeArr[0].y && direction.y !== 1) {
        direction = { x: 0, y: -1 };
    }
});

// Detect keyboard input (Arrow keys)
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (event.key === "ArrowDown" && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (event.key === "ArrowLeft" && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (event.key === "ArrowRight" && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
});

function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function gameEngine() {
    board.innerHTML = ""; // Clear board before rendering

    // Move the snake
    let newHead = { x: snakeArr[0].x + direction.x, y: snakeArr[0].y + direction.y };

    // Check for collision with walls
    if (newHead.x < 1 || newHead.x > 20 || newHead.y < 1 || newHead.y > 20) {
        alert("Game Over! You hit the wall.");
        resetGame();
        return;
    }

    // Check for collision with itself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snakeArr[i].x === newHead.x && snakeArr[i].y === newHead.y) {
            alert("Game Over! You hit yourself.");
            resetGame();
            return;
        }
    }

    // Check if snake eats food
    if (newHead.x === food.x && newHead.y === food.y) {
        snakeArr.unshift(food); // Grow snake
        food = { 
            x: Math.floor(Math.random() * 20) + 1, 
            y: Math.floor(Math.random() * 20) + 1 
        }; // New food position
        score++; // Increase score
    } else {
        snakeArr.unshift(newHead);
        snakeArr.pop(); // Remove the tail
    }

    // Render the snake
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y.toString();
        snakeElement.style.gridColumnStart = e.x.toString();
        snakeElement.classList.add('snake');
        if (index === 0) {
            snakeElement.classList.add('head');
        }
        board.appendChild(snakeElement);
    });

    // Render the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y.toString();
    foodElement.style.gridColumnStart = food.x.toString();
    foodElement.classList.add('food');
    board.appendChild(foodElement);

    // Update score display
    scoreDisplay.textContent = `Score: ${score}`;
}

function resetGame() {
    direction = { x: 0, y: 0 };
    snakeArr = [{ x: 10, y: 10 }];
    food = { x: Math.floor(Math.random() * 20) + 1, y: Math.floor(Math.random() * 20) + 1 };
    score = 0; // Reset score
    scoreDisplay.textContent = `Score: ${score}`; // Reset score display
}

// Start the game loop
window.requestAnimationFrame(main);
