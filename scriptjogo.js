const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let gameOver = false;
let playerSpeed = 5;
let speed = 3;
let obstacles = [];
let bullets = [];
let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    color: '#00FF00',
    dx: 0
};

const explosionParticles = [];

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

// Função para desenhar as balas
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Função para atualizar a posição dos obstáculos e verificar colisões
function updateObstacles() {
    if (gameOver) return;

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

            // Atualiza a melhor pontuação
            updateHighScore(score);
        }

        // Verificar colisão com as balas
        bullets.forEach((bullet, bIndex) => {
            if (
                bullet.x < obstacle.x + obstacle.width &&
                bullet.x + bullet.width > obstacle.x &&
                bullet.y < obstacle.y + obstacle.height &&
                bullet.y + bullet.height > obstacle.y
            ) {
                // Explosão ao acertar
                generateExplosion(obstacle.x, obstacle.y);
                obstacles.splice(index, 1);
                bullets.splice(bIndex, 1);
                score += 10;
                document.getElementById('score').textContent = score;
            }
        });

        // Remover obstáculos que saíram da tela
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
        }
    });
}

// Função para gerar uma explosão
function generateExplosion(x, y) {
    for (let i = 0; i < 30; i++) {
        explosionParticles.push({
            x: x,
            y: y,
            radius: Math.random() * 5 + 1,
            speedX: Math.random() * 4 - 2,
            speedY: Math.random() * 4 - 2,
            color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
        });
    }
}

// Função para desenhar a explosão
function drawExplosion() {
    explosionParticles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
        if (particle.y > canvas.height || particle.x < 0 || particle.x > canvas.width) {
            explosionParticles.splice(index, 1);
        }
    });
}

// Função para mover o jogador
function movePlayer() {
    player.x += player.dx;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Função para atirar
function shootBullet() {
    bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 15 });
}

// Função para atualizar o jogo
function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar jogador e obstáculos
    drawPlayer();
    drawObstacles();
    drawBullets();
    drawExplosion();
    updateObstacles();
    movePlayer();

    if (Math.random() < 0.02) {
        generateObstacles();
    }

    requestAnimationFrame(updateGame);
}

// Função para atualizar a melhor pontuação
function updateHighScore(currentScore) {
    const highScore = localStorage.getItem('highScore');
    if (highScore === null || currentScore > parseInt(highScore)) {
        localStorage.setItem('highScore', currentScore);
        document.getElementById('high-score').textContent = currentScore;
    } else {
        document.getElementById('high-score').textContent = highScore;
    }
}

// Carregar a melhor pontuação quando o jogo começa
function loadHighScore() {
    const highScore = localStorage.getItem('highScore');
    if (highScore !== null) {
        document.getElementById('high-score').textContent = highScore;
    } else {
        document.getElementById('high-score').textContent = 0;
    }
}

// Eventos de controle para dispositivos móveis (botões)
document.getElementById('leftBtn').addEventListener('touchstart', function (e) {
    e.preventDefault();
    player.dx = -playerSpeed;
});

document.getElementById('rightBtn').addEventListener('touchstart', function (e) {
    e.preventDefault();
    player.dx = playerSpeed;
});

document.getElementById('leftBtn').addEventListener('touchend', function (e) {
    e.preventDefault();
    player.dx = 0;
});

document.getElementById('rightBtn').addEventListener('touchend', function (e) {
    e.preventDefault();
    player.dx = 0;
});

document.getElementById('shootBtn').addEventListener('touchstart', function (e) {
    e.preventDefault();
    shootBullet();
});

// Reiniciar o jogo
document.getElementById('restartButton').addEventListener('click', function () {
    gameOver = false;
    score = 0;
    obstacles = [];
    bullets = [];
    player.x = canvas.width / 2 - 25;
    player.y = canvas.height - 50;
    document.querySelector('.game-over').style.display = 'none';
    updateGame();
});

// Inicializar o jogo
loadHighScore();
updateGame();
