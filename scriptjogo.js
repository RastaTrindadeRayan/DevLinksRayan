const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ajustar o tamanho do canvas para ocupar 100% da largura e altura da tela
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let score = 0;
let gameOver = false;
let playerSpeed = 5;
let speed = 3;
let obstacles = [];
let bullets = [];
let particles = [];
let player = {
    x: canvas.width / 2 - 15, // Ajuste para deixar o jogador centralizado
    y: canvas.height - 80, // Posicionando o jogador um pouco mais acima
    width: 30, // Jogador mais estreito
    height: 80, // Aumentando a altura do jogador
    color: '#00FF00',
    dx: 0
};

// Função para desenhar o jogador
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Função para desenhar obstáculos
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Função para desenhar balas
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Função para desenhar partículas de explosão
function drawParticles() {
    particles.forEach((particle, index) => {
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);

        // Atualiza as partículas
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.size *= 0.95; // Diminuindo o tamanho da partícula

        if (particle.size < 0.1) {
            particles.splice(index, 1); // Remove partículas pequenas
        }
    });
}

// Função para gerar obstáculos
function generateObstacles() {
    const obstacleWidth = 50;
    const obstacleHeight = 50;
    const x = Math.random() * (canvas.width - obstacleWidth);
    obstacles.push({ x: x, y: -obstacleHeight, width: obstacleWidth, height: obstacleHeight });
}

// Função para atualizar obstáculos
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

            // Atualiza a melhor pontuação
            updateHighScore(score);
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
                // Explosão
                createExplosion(obstacle.x, obstacle.y);
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

// Função para criar partículas de explosão
function createExplosion(x, y) {
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        const size = Math.random() * 5 + 2;
        const color = 'orange';

        particles.push({ x, y, dx, dy, size, color });
    }
}

// Função para atualizar o jogo
function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar jogador e elementos
    drawPlayer();
    drawObstacles();
    drawBullets();
    drawParticles();
    updateObstacles();
    updateBullets();
    movePlayer();

    // Gerar obstáculos a cada 30 quadros
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

// Função para carregar a melhor pontuação
function loadHighScore() {
    const highScore = localStorage.getItem('highScore');
    if (highScore !== null) {
        document.getElementById('high-score').textContent = highScore;
    } else {
        document.getElementById('high-score').textContent = 0;
    }
}

// Eventos para os controles de movimento (teclado)
document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft' || event.key === 'a') {
        player.dx = -playerSpeed;
    }
    if (event.key === 'ArrowRight' || event.key === 'd') {
        player.dx = playerSpeed;
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'a' || event.key === 'd') {
        player.dx = 0;
    }
});

// Eventos para os controles móveis
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

// Evento para atirar
document.getElementById('shootBtn').addEventListener('click', function () {
    bullets.push({
        x: player.x + player.width / 2 - 5,
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
    particles = [];
    gameOver = false;
    player.x = canvas.width / 2 - 15; // Garantir que o jogador reinicie centralizado
    player.y = canvas.height - 80; // Atualizando a posição do jogador após o reinício
    document.getElementById('score').textContent = score;
    document.querySelector('.game-over').style.display = 'none';
    updateGame();
});

// Carregar a melhor pontuação
loadHighScore();

// Iniciar o jogo
updateGame();
