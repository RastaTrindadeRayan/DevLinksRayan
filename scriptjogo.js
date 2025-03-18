const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let gameOver = false;
let playerSpeed = 5;
let speed = 3;
let obstacles = [];
let bullets = [];
let particles = [];  // Array para armazenar as partículas
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

// Função para gerar inimigos
function generateObstacles() {
    const obstacleWidth = 50;
    const obstacleHeight = 50;
    const x = Math.random() * (canvas.width - obstacleWidth);
    obstacles.push({ x: x, y: -obstacleHeight, width: obstacleWidth, height: obstacleHeight });
}

// Função para desenhar os inimigos
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Função para desenhar as partículas
function drawParticles() {
    particles.forEach((particle, index) => {
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        // Atualiza a posição da partícula
        particle.x += particle.dx;
        particle.y += particle.dy;

        // Desvanece a partícula
        particle.alpha -= 0.05;

        // Remove partículas que saem de cena
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        }
    });
}

// Função para atualizar a posição dos inimigos
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
            updateHighScore(score);
        }

        // Remover inimigos que saíram da tela
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
        }
    });
}

// Função para desenhar os tiros
function drawBullets() {
    bullets.forEach((bullet, index) => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Atualiza a posição do tiro
        bullet.y -= 5;

        // Verifica colisão entre tiros e inimigos
        obstacles.forEach((obstacle, obstacleIndex) => {
            if (
                bullet.x < obstacle.x + obstacle.width &&
                bullet.x + bullet.width > obstacle.x &&
                bullet.y < obstacle.y + obstacle.height &&
                bullet.y + bullet.height > obstacle.y
            ) {
                obstacles.splice(obstacleIndex, 1); // Remover o inimigo
                bullets.splice(index, 1); // Remover o tiro
                score += 10; // Adicionar pontos
                document.getElementById('score').textContent = score;

                // Criar animação de partículas
                createExplosion(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
            }
        });

        // Verifica se o tiro saiu da tela
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

// Função para criar a animação de partículas
function createExplosion(x, y) {
    const particleCount = 10; // Número de partículas a serem criadas
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * 2 * Math.PI; // Direção aleatória
        const speed = Math.random() * 4 + 2; // Velocidade aleatória
        const particle = {
            x: x,
            y: y,
            radius: Math.random() * 5 + 3, // Tamanho aleatório
            dx: Math.cos(angle) * speed, // Deslocamento no eixo X
            dy: Math.sin(angle) * speed, // Deslocamento no eixo Y
            alpha: 1 // Opacidade inicial
        };
        particles.push(particle);
    }
}

// Função para disparar um tiro
function shootBullet() {
    if (gameOver) return;

    const bullet = {
        x: player.x + player.width / 2 - 5, // Posição do tiro no centro do jogador
        y: player.y,
        width: 10,
        height: 20
    };
    bullets.push(bullet);
}

// Função para mover o jogador
function movePlayer() {
    player.x += player.dx;

    // Impedir que o jogador saia da tela
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Função para reiniciar o jogo
function restartGame() {
    score = 0;
    obstacles = [];
    bullets = [];
    particles = [];  // Limpar partículas
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

    // Desenhar jogador, obstáculos, tiros e partículas
    drawPlayer();
    drawObstacles();
    drawBullets();
    drawParticles();
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
document.getElementById('leftBtn').addEventListener('touchstart', function () {
    player.dx = -playerSpeed;
});
document.getElementById('rightBtn').addEventListener('touchstart', function () {
    player.dx = playerSpeed;
});
document.getElementById('shootBtn').addEventListener('touchstart', shootBullet);

document.getElementById('leftBtn').addEventListener('touchend', function () {
    player.dx = 0;
});
document.getElementById('rightBtn').addEventListener('touchend', function () {
    player.dx = 0;
});

// Garantir que o movimento funcione em dispositivos móveis
document.getElementById('leftBtn').addEventListener('mousedown', function () {
    player.dx = -playerSpeed;
});
document.getElementById('rightBtn').addEventListener('mousedown', function () {
    player.dx = playerSpeed;
});
document.getElementById('shootBtn').addEventListener('mousedown', shootBullet);

document.getElementById('leftBtn').addEventListener('mouseup', function () {
    player.dx = 0;
});
document.getElementById('rightBtn').addEventListener('mouseup', function () {
    player.dx = 0;
});

// Eventos de controle para desktop (teclado)
document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') player.dx = -playerSpeed;
    if (e.key === 'ArrowRight') player.dx = playerSpeed;
    if (e.key === ' ') shootBullet(); // Atira com a barra de espaço
});

document.addEventListener('keyup', function () {
    player.dx = 0;
});

// Reiniciar o jogo
document.getElementById('restartButton').addEventListener('click', restartGame);

// Iniciar o jogo
loadHighScore();
updateGame();
