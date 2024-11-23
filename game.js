const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 30; // Kare boyutu
const playerSize = 20; // Oyuncu boyutu
let level = 1; // Başlangıç seviyesi
let score = 0; // Skor
let player = { x: 1, y: 1 }; // Oyuncu pozisyonu
let exit = { x: 0, y: 0 }; // Çıkış noktası
let maze = generateMaze(level); // İlk labirent
resizeCanvas();

// Canvas boyutlarını ayarla
function resizeCanvas() {
    canvas.width = maze[0].length * tileSize;
    canvas.height = maze.length * tileSize;
}

// Labirent oluşturma
function generateMaze(level) {
    const size = 10 + level * 2; // Labirent boyutu seviyeye göre artıyor
    let maze = Array.from({ length: size }, () => Array(size).fill(1));

    function carve(x, y) {
        const directions = ["up", "down", "left", "right"].sort(() => Math.random() - 0.5);

        for (let dir of directions) {
            let nx = x, ny = y;
            if (dir === "up") ny -= 2;
            if (dir === "down") ny += 2;
            if (dir === "left") nx -= 2;
            if (dir === "right") nx += 2;

            if (ny > 0 && ny < size - 1 && nx > 0 && nx < size - 1 && maze[ny][nx] === 1) {
                maze[ny][nx] = 0;
                maze[y + (ny - y) / 2][x + (nx - x) / 2] = 0;
                carve(nx, ny);
            }
        }
    }

    maze[1][1] = 0; // Oyuncu başlangıç pozisyonu
    carve(1, 1);

    // Çıkış noktasını rastgele belirle
    do {
        exit.x = Math.floor(Math.random() * size);
        exit.y = Math.floor(Math.random() * size);
    } while (maze[exit.y][exit.x] !== 0); // Çıkış noktası sadece açık bir hücre olabilir

    maze[exit.y][exit.x] = 2; // Çıkış noktası işaretle
    console.log(`Yeni çıkış noktası: (${exit.x}, ${exit.y})`); // Kontrol için log
    return maze;
}

// Labirenti çiz
function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    maze.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === 1) {
                ctx.fillStyle = "#555";
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            } else if (cell === 2) {
                ctx.fillStyle = "gold";
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        });
    });

    // Oyuncuyu çiz
    ctx.fillStyle = "blue";
    ctx.fillRect(
        player.x * tileSize + (tileSize - playerSize) / 2,
        player.y * tileSize + (tileSize - playerSize) / 2,
        playerSize,
        playerSize
    );

    // Skor ve seviye göster
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText(`Seviye: ${level}`, 10, canvas.height - 30);
    ctx.fillText(`Puan: ${score}`, 10, canvas.height - 10);
}

// Oyuncuyu hareket ettir
function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;

    if (maze[newY]?.[newX] !== 1) {
        player.x = newX;
        player.y = newY;

        // Çıkış noktasına ulaştı mı?
        if (player.x === exit.x && player.y === exit.y) {
            level++;
            score += 100;
            maze = generateMaze(level);
            player = { x: 1, y: 1 }; // Oyuncu başlangıç noktasına dönüyor
            resizeCanvas();
        }
    }

    drawMaze();
}

// Klavye kontrolleri
document.addEventListener("keydown", (e) => {
    if (e.key === "w") movePlayer(0, -1); // yukarı
    if (e.key === "s") movePlayer(0, 1);  // aşağı
    if (e.key === "a") movePlayer(-1, 0); // sola
    if (e.key === "d") movePlayer(1, 0);  // sağa
});

// Oyunu başlat
function startGame() {
    maze = generateMaze(level);
    player = { x: 1, y: 1 };
    resizeCanvas();
    drawMaze();
}

startGame();
