// New Game Over with Integrated High Score Implementation
// Copy and paste these functions into your index.html file

// Updated gameOver function
function gameOver() {
    try {
        console.log("Game over!");
        gameState.isGameOver = true;
        
        // Clear game loop
        if (gameLoopInterval) {
            clearInterval(gameLoopInterval);
            gameLoopInterval = null;
        }
        
        // Play game over sound
        if (soundEnabled) {
            // Make sure to stop all other sounds first
            soundManager.stopBackgroundMusic();
            if (sounds.background) {
                sounds.background.pause();
            }
            
            // Play game over sound after a short delay
            setTimeout(() => {
                soundManager.playSound('gameOver', { volume: 0.7 });
                if (sounds.gameOver) {
                    sounds.gameOver.currentTime = 0;
                    sounds.gameOver.play().catch(e => console.log("Error playing legacy game over sound:", e));
                }
            }, 200);
        } else {
            soundManager.stopBackgroundMusic();
            if (sounds.background) {
                sounds.background.pause();
            }
        }
        
        // Hide game UI elements
        document.getElementById('exit-game-container').style.display = 'none';
        document.getElementById('level-complete-screen').style.display = 'none';
        document.getElementById('name-input-container').style.display = 'none'; // Hide old name input
        
        // Show game over screen first
        showGameOverScreen();
        
        // Then check for high score and update the game over screen if needed
        checkForHighScore();
    } catch (err) {
        console.error("Error in gameOver:", err);
        showMainMenu();
    }
}

// Updated showGameOverScreen function
function showGameOverScreen() {
    const gameOverScreen = document.getElementById('game-over-screen');
    document.getElementById('final-score').textContent = `SCORE: ${gameState.score}`;
    document.getElementById('final-level').textContent = `LEVEL: ${gameState.level}`;
    gameOverScreen.style.display = 'flex';
    
    // Hide high score section by default (will be shown by checkForHighScore if needed)
    document.getElementById('game-over-high-score').style.display = 'none';
    
    // Reset high scores button styling
    const highScoreButton = document.getElementById('view-highscores-button');
    highScoreButton.classList.remove('high-score-button-highlight');
    highScoreButton.style.borderColor = '';
    highScoreButton.style.boxShadow = '';
    highScoreButton.innerHTML = 'VIEW HIGH SCORES <span class="key-hint">H</span>';
    
    // Set up button listeners
    document.getElementById('restart-button').onclick = function() {
        gameOverScreen.style.display = 'none';
        if (soundEnabled) {
            soundManager.playSound('buttonClick');
        }
        restartGame();
    };
    
    document.getElementById('return-menu-button').onclick = function() {
        gameOverScreen.style.display = 'none';
        if (soundEnabled) {
            soundManager.playSound('buttonClick');
        }
        exitGame();
    };
    
    // Set up high scores button handler - make sure it works!
    highScoreButton.onclick = function() {
        console.log("High scores button clicked from game over screen");
        
        // Hide the game over screen first
        gameOverScreen.style.display = 'none';
        
        if (soundEnabled) {
            soundManager.playSound('buttonClick');
        }
        
        // Call the showHighScores function directly
        showHighScores();
    };
}

// Updated checkForHighScore function - now directly updates the game over screen
function checkForHighScore() {
    // Only check if we have a valid operator selected
    if (!selectedOperator) return false;
    
    // Load high scores
    loadHighScores();
    
    // Check if this score qualifies
    if (isHighScore(selectedOperator, gameState.score)) {
        pendingHighScore = {
            score: gameState.score,
            level: gameState.level,
            operator: selectedOperator,
            alienDifficulty: selectedAlienDifficulty,
            mathDifficulty: selectedMathDifficulty
        };
        
        // Show the high score section on the game over screen
        const highScoreSection = document.getElementById('game-over-high-score');
        highScoreSection.style.display = 'block';
        
        // Clear any previous name input
        const nameInput = document.getElementById('game-over-player-name');
        nameInput.value = '';
        
        // Play high score sound if enabled
        if (soundEnabled) {
            soundManager.playSound('highScore', { volume: 0.7 });
        }
        
        // Focus on the name input
        setTimeout(() => nameInput.focus(), 100);
        
        // Add event listener to the submit button
        document.getElementById('game-over-submit-name').onclick = submitGameOverHighScore;
        
        // Update the high scores button to show a highlight
        const highScoreButton = document.getElementById('view-highscores-button');
        highScoreButton.classList.add('high-score-button-highlight');
        highScoreButton.innerHTML = 'VIEW YOUR HIGH SCORE <span class="key-hint">H</span>';
        
        // Handle submit on Enter key
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitGameOverHighScore();
            }
        });
        
        return true;
    }
    
    return false;
}

// New function to handle high score submission from game over screen
function submitGameOverHighScore() {
    const playerName = document.getElementById('game-over-player-name').value.trim();
    
    if (pendingHighScore) {
        // Add the high score
        addHighScore(
            playerName || "Unknown Player",
            pendingHighScore.score,
            pendingHighScore.level,
            pendingHighScore.operator,
            pendingHighScore.alienDifficulty,
            pendingHighScore.mathDifficulty
        );
        
        // Store the operator for when they view high scores
        currentHighScoreOperator = pendingHighScore.operator;
        
        // Clear the pending high score
        pendingHighScore = null;
        
        // Hide the high score input section
        document.getElementById('game-over-high-score').style.display = 'none';
        
        // Play confirmation sound
        if (soundEnabled) {
            soundManager.playSound('buttonClick');
        }
        
        // Show a confirmation message
        const confirmMessage = document.createElement('div');
        confirmMessage.textContent = 'HIGH SCORE SAVED!';
        confirmMessage.style.fontSize = '2em';
        confirmMessage.style.color = '#00ff00';
        confirmMessage.style.textShadow = '0 0 10px #00ff00';
        confirmMessage.style.position = 'absolute';
        confirmMessage.style.top = '50%';
        confirmMessage.style.left = '50%';
        confirmMessage.style.transform = 'translate(-50%, -50%)';
        confirmMessage.style.zIndex = '2000';
        document.body.appendChild(confirmMessage);
        
        // Update the high scores button to indicate high score was saved
        const highScoreButton = document.getElementById('view-highscores-button');
        highScoreButton.classList.add('high-score-button-highlight');
        highScoreButton.innerHTML = 'VIEW YOUR HIGH SCORE <span class="key-hint">H</span>';
        
        // Remove the message after a short delay
        setTimeout(() => {
            document.body.removeChild(confirmMessage);
        }, 1500);
    }
}
