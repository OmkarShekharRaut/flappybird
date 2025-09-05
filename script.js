const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Bird properties
let bird = {
    x: 50,
    y: 250,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: 0.5,
    jump: -8
};

// Pipe properties
let pipes = [];
let pipeWidth = 50;
let pipeGap = 140;
let pipeSpeed = 2;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0; // Load high score from local storage
let gameOver = false;

// Load bird image
const birdImg = new Image();
birdImg.src = "https://i.imgur.com/jw8f27k.png"; // Placeholder bird image

// Jump function
document.addEventListener("keydown", () => {
    if (!gameOver) {
        bird.velocity = bird.jump;
    } else {
        resetGame();
    }
});

// Game loop
function updateGame() {
    if (gameOver) return;

    // Move bird
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Add new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        let pipeY = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
        pipes.push({ x: canvas.width, y: pipeY });
    }

    // Move pipes
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;

        // Collision detection
        if (
            bird.x < pipes[i].x + pipeWidth &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].y || bird.y + bird.height > pipes[i].y + pipeGap)
        ) {
            gameOver = true;
            updateHighScore();
        }

        // Remove passed pipes & update score
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            score++;
        }
    }

    // Check if bird hits the ground or ceiling
    if (bird.y + bird.height >= canvas.height || bird.y < 0) {
        gameOver = true;
        updateHighScore();
    }

    drawGame();
    requestAnimationFrame(updateGame);
}

// Draw everything
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Draw pipes
    ctx.fillStyle = "green";
    for (let i = 0; i < pipes.length; i++) {
        ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].y); // Top pipe
        ctx.fillRect(pipes[i].x, pipes[i].y + pipeGap, pipeWidth, canvas.height - pipes[i].y - pipeGap); // Bottom pipe
    }

    // Draw score & high score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25);
    ctx.fillText("High Score: " + highScore, 10, 50);

    // Draw game over message
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over!", canvas.width / 2 - 70, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText("Press any key to restart", canvas.width / 2 - 90, canvas.height / 2 + 40);
    }
}

// Update high score
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore); // Save high score
    }
}

// Reset game
function resetGame() {
    bird.y = 250;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    updateGame();
}

// Start the game
updateGame();
