// Pegando os elementos
const player = document.querySelector(".player");
const scoreDisplay = document.querySelector(".score");
const highscoreDisplay = document.querySelector(".highscore");
const gameContainer = document.querySelector(".game-container");

let playerX = 50;
let playerY = 350;
let playerSpeed = 5;
let score = 0;
let highscore = localStorage.getItem('highscore') || 0; // Recupera a melhor pontuação do localStorage
let gameInterval;
let obstacleInterval;

// Atualiza a exibição da melhor pontuação
highscoreDisplay.textContent = `Melhor Pontuação: ${highscore}`;

// Função para atualizar a posição do jogador
function movePlayer(event) {
    if (event.key === "ArrowUp" && playerY > 0) {
        playerY -= playerSpeed;
    } else if (event.key === "ArrowDown" && playerY < gameContainer.clientHeight - player.clientHeight) {
        playerY += playerSpeed;
    } else if (event.key === "ArrowLeft" && playerX > 0) {
        playerX -= playerSpeed;
    } else if (event.key === "ArrowRight" && playerX < gameContainer.clientWidth - player.clientWidth) {
        playerX += playerSpeed;
    }
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

// Função para gerar obstáculos
function createObstacle() {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.left = `${gameContainer.clientWidth}px`; // Começa fora da tela
    obstacle.style.top = `${Math.floor(Math.random() * (gameContainer.clientHeight - 50))}px`; // Posição aleatória no eixo Y
    gameContainer.appendChild(obstacle);

    let obstacleX = gameContainer.clientWidth;

    // Movendo os obstáculos para a esquerda
    const moveObstacle = setInterval(() => {
        obstacleX -= 7; // Velocidade do obstáculo
        obstacle.style.left = `${obstacleX}px`;

        // Verificando se o obstáculo saiu da tela
        if (obstacleX <= -50) {
            clearInterval(moveObstacle);
            obstacle.remove();
            score++;
            scoreDisplay.textContent = `Pontuação: ${score}`;
        }

        // Verificar colisão com o jogador
        if (obstacleX < playerX + player.clientWidth &&
            obstacleX + obstacle.clientWidth > playerX &&
            parseInt(obstacle.style.top) < playerY + player.clientHeight &&
            parseInt(obstacle.style.top) + obstacle.clientHeight > playerY) {
            gameOver();
        }

    }, 20);
}

// Função de Game Over
function gameOver() {
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);

    // Verificar se a pontuação atual é maior que a melhor pontuação
    if (score > highscore) {
        highscore = score;
        localStorage.setItem('highscore', highscore); // Salva a melhor pontuação no localStorage
        highscoreDisplay.textContent = `Melhor Pontuação: ${highscore}`;
    }


    window.location.reload(); // Recarrega a página para reiniciar o jogo
}

// Função para iniciar o jogo
function startGame() {
    // Gerando obstáculos a cada 2 segundos
    obstacleInterval = setInterval(createObstacle, 1500);

    // Atualizando a posição do jogador
    window.addEventListener("keydown", movePlayer);
}

// Inicia o jogo
startGame();
