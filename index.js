// Константи для кількості рядків і стовпців у грі
const rows = 4;
const columns = 4;

// Змінні для зберігання стану гри та рахунку
let board;
let score = 0;

// Ініціалізація гри при завантаженні сторінки
window.onload = function() {
    setGame();
}

// Функція для налаштування гри
function setGame() {
    // Створення пустої дошки розміром rows x columns
    board = Array.from({ length: rows }, () => Array(columns).fill(0));

    updateDisplay();
    setRandomTile();
    setRandomTile();
}

// Функція для оновлення відображення гри на сторінці
function updateDisplay() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";

    // Проходимося по кожній комірці дошки та створюємо відповідний елемент плитки
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const tile = createTileElement(board[r][c]);
            boardElement.appendChild(tile);
        }
    }

    // Оновлення відображення рахунку
    document.getElementById("score").innerText = "Score: " + score;
}

// Функція для створення елемента плитки з відповідним числовим значенням
function createTileElement(num) {
    const tile = document.createElement("div");
    tile.className = "tile x" + num;
    tile.textContent = num > 0 ? num : "";
    return tile;
}

// Функція для розміщення випадкової плитки на порожньому місці на дошці
function setRandomTile() {
    const emptyTiles = [];

    // Знаходимо всі порожні комірки на дошці
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                emptyTiles.push({ r: r, c: c }); // Додаємо координати порожньої комірки в масив
            }
        }
    }

    if (emptyTiles.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const tile = emptyTiles[randomIndex];
    board[tile.r][tile.c] = Math.random() < 0.9 ? 2 : 4;
    updateDisplay();
}

// Додавання прослуховувача подій клавіш для обробки руху гри
document.addEventListener('keyup', function(e) {
    if (e.key === "ArrowUp") {
        moveUp();
    } else if (e.key === "ArrowDown") {
        moveDown();
    } else if (e.key === "ArrowLeft") {
        moveLeft();
    } else if (e.key === "ArrowRight") {
        moveRight();
    }
});