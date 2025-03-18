const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let gameOver = false;
let playerSpeed = 5;
let speed = 3;
let obstacles = [];
let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    color: '#00FF00',
    dx: 0
};

// Função para desenhar o jogador
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Função para gerar obstáculos
function generateObstacles() {
    const obstacleWidth = 50;
    const obstacleHeight = 50;
    const x = Math.random() * (canvas.width - obstacleWidth);
    obstacles.push({ x: x, y: -obstacleHeight, width: obstacleWidth, height: obstacleHeight });
}

// Função para desenhar os obstáculos
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Função para atualizar a posição dos obstáculos
function updateObstacles() {
    if (gameOver) return;

    obstacles.forEach((obstacle, index) => {
        obstacle.y += speed;

        // Verificar colisão
        if (
            obstacle.x < player.x + player.width &&
            obstacle.x + obstacle.width > player.x &&
            obstacle.y < player.y + player.height &&
            obstacle.y + obstacle.height > player.y
        ) {
            gameOver = true;
            document.getElementById('final-score').textContent = score;
            document.querySelector('.game-over').style.display = 'block';
        }

        // Remover obstáculos que saíram da tela
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
            score++;
            document.getElementById('score').textContent = score;
        }
    });
}

// Função para mover o jogador
function movePlayer() {
    player.x += player.dx;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Função para reiniciar o jogo
function restartGame() {
    score = 0;
    obstacles = [];
    gameOver = false;
    player.x = canvas.width / 2 - 25;
    document.getElementById('score').textContent = score;
    document.querySelector('.game-over').style.display = 'none';
    updateGame();
}

// Função para atualizar o jogo
function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar jogador e obstáculos
    drawPlayer();
    drawObstacles();
    updateObstacles();
    movePlayer();

    if (Math.random() < 0.02) {
        generateObstacles();
    }

    requestAnimationFrame(updateGame);
}

// Eventos de controle para dispositivos móveis (botões)
document.getElementById('leftBtn').addEventListener('mousedown', function () {
    player.dx = -playerSpeed;
});
document.getElementById('rightBtn').addEventListener('mousedown', function () {
    player.dx = playerSpeed;
});

// Parar movimento quando o clique é liberado (com mouse)
document.getElementById('leftBtn').addEventListener('mouseup', function () {
    player.dx = 0;
});
document.getElementById('rightBtn').addEventListener('mouseup', function () {
    player.dx = 0;
});

// Garantir que o movimento pare quando o botão for solto em dispositivos móveis
document.getElementById('leftBtn').addEventListener('touchstart', function () {
    player.dx = -playerSpeed;
});
document.getElementById('rightBtn').addEventListener('touchstart', function () {
    player.dx = playerSpeed;
});

document.getElementById('leftBtn').addEventListener('touchend', function () {
    player.dx = 0;
});
document.getElementById('rightBtn').addEventListener('touchend', function () {
    player.dx = 0;
});

// Eventos de controle para desktop (teclado)
document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') player.dx = -playerSpeed;
    if (e.key === 'ArrowRight') player.dx = playerSpeed;
});

document.addEventListener('keyup', function () {
    player.dx = 0;
});

// Botão de reinício
document.getElementById('restartButton').addEventListener('click', restartGame);

// Iniciar o jogo
updateGame();
