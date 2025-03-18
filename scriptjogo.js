const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajuste do tamanho do canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let score = 0;
let gameOver = false;
let playerSpeed = 5;
let speed = 3; // Velocidade dos obstáculos
let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    color: '#00FF00',
    dx: 0
};

let obstacles = [];
let bullets = [];

// Função para desenhar o jogador
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Função para desenhar os obstáculos
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Função para desenhar as balas
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Função para gerar obstáculos (inimigos)
function generateObstacles() {
    const obstacleWidth = 50;
    const obstacleHeight = 50;
    const x = Math.random() * (canvas.width - obstacleWidth);
    obstacles.push({
        x: x,
        y: -obstacleHeight,
        width: obstacleWidth,
        height: obstacleHeight
    });
}

// Função para atualizar obstáculos (movimento para baixo)
function updateObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.y += speed;

        // Verificar colisão com o jogador
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

    // Impede que o jogador saia da tela
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Função para atualizar as balas
function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;

        // Verificar colisão com obstáculos
        obstacles.forEach((obstacle, obstacleIndex) => {
            if (
                bullet.x < obstacle.x + obstacle.width &&
                bullet.x + bullet.width > obstacle.x &&
                bullet.y < obstacle.y + obstacle.height &&
                bullet.y + bullet.height > obstacle.y
            ) {
                // Explosão e remoção do obstáculo e da bala
                obstacles.splice(obstacleIndex, 1);
                bullets.splice(index, 1);
                score += 10;
                document.getElementById('score').textContent = score;
            }
        });

        // Remover balas que saem da tela
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

// Função para atualizar o jogo
function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar jogador, obstáculos e balas
    drawPlayer();
    drawObstacles();
    drawBullets();

    // Atualizar obstáculos e balas
    updateObstacles();
    updateBullets();
    movePlayer();

    // Gerar novos obstáculos a cada 50 quadros
    if (Math.random() < 0.02) {
        generateObstacles();
    }

    requestAnimationFrame(updateGame);
}

// Evento de controle do movimento do jogador
document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') player.dx = -playerSpeed;
    if (e.key === 'ArrowRight') player.dx = playerSpeed;
    if (e.key === ' ') {
        // Tecla de espaço dispara uma bala
        bullets.push({
            x: player.x + player.width / 2 - 5, // Disparo no centro do jogador
            y: player.y,
            width: 10,
            height: 20,
            speed: 5
        });
    }
});

document.addEventListener('keyup', function () {
    player.dx = 0;
});

// **Botões Móveis**

let touchMoveLeft = false;
let touchMoveRight = false;

// Botão da Esquerda
document.getElementById('leftBtn').addEventListener('touchstart', function (e) {
    e.preventDefault(); // Impede o comportamento padrão de rolagem
    player.dx = -playerSpeed;
    touchMoveLeft = true;
});

document.getElementById('leftBtn').addEventListener('touchend', function (e) {
    e.preventDefault(); // Impede o comportamento padrão de rolagem
    player.dx = 0;
    touchMoveLeft = false;
});

// Botão da Direita
document.getElementById('rightBtn').addEventListener('touchstart', function (e) {
    e.preventDefault(); // Impede o comportamento padrão de rolagem
    player.dx = playerSpeed;
    touchMoveRight = true;
});

document.getElementById('rightBtn').addEventListener('touchend', function (e) {
    e.preventDefault(); // Impede o comportamento padrão de rolagem
    player.dx = 0;
    touchMoveRight = false;
});

// Evento para disparar balas com o botão de disparo
document.getElementById('shootBtn').addEventListener('click', function () {
    bullets.push({
        x: player.x + player.width / 2 - 5, // Disparo no centro do jogador
        y: player.y,
        width: 10,
        height: 20,
        speed: 5
    });
});

// Evento de reinício do jogo
document.getElementById('restartButton').addEventListener('click', function () {
    score = 0;
    obstacles = [];
    bullets = [];
    gameOver = false;
    player.x = canvas.width / 2 - 25;
    document.getElementById('score').textContent = score;
    document.querySelector('.game-over').style.display = 'none';
    updateGame();
});

// Iniciar o jogo
updateGame();
