const rows = 4;
const columns = 4;

let board;
let score = 0;
let bestScore = 0;
let swipeStartX, swipeStartY, swipeEndX, swipeEndY;

window.onload = function() {
    loadGameState();
    updateBoard();
    setRandomTileToBoard();
    setRandomTileToBoard();
}

function saveGameState() {
    localStorage.setItem('gameState', JSON.stringify({ board, score, mergedTiles, bestScore }));
}

function loadGameState() {
    const savedState = localStorage.getItem('gameState');

    if (savedState) {
        const { board: savedBoard, score: savedScore, mergedTiles: savedMergedTiles, bestScore: savedBestScore } = JSON.parse(savedState);
        board = savedBoard;
        score = savedScore;
        mergedTiles = savedMergedTiles;
        bestScore = savedBestScore;
        updateBoard();
    }
}

function startGame() {
    board = Array.from({ length: rows }, () => Array(columns).fill(0));

    updateBoard();
    setRandomTileToBoard();
    setRandomTileToBoard();
}

function updateBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const tileValue = board[row][column];
            const tile = createTileElement(tileValue);
            boardElement.appendChild(tile);
        }
    }

    const scoreDisplay = document.getElementsByClassName('tab-score')[0];
    scoreDisplay.innerText = score;

    const bestScoreDisplay = document.getElementsByClassName('best-score')[0];
    bestScoreDisplay.innerText = bestScore;
}

function generateTileColor(value) {
    const hueStart = 0; 
    const hueEnd = 120;  
    const hueStep = (hueEnd - hueStart) / 11;
    const hue = (Math.log2(value) % 12) * hueStep + hueStart;
    const saturation = 50;  
    const lightness = 50; 

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function createTileElement(num) {
    const tile = document.createElement("div");

    tile.className = "tile x" + num;
    tile.textContent = num > 0 ? num : "";

    tile.style.backgroundColor = generateTileColor(num);
    
    return tile;
}

function setRandomTileToBoard() {
    const emptyTiles = [];

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            if (board[row][column] === 0) {
                emptyTiles.push({ row: row, column: column });
            }
        }
    }

    if (emptyTiles.length === 0) return;
    
    const randomNumber = Math.floor(Math.random() * emptyTiles.length);
    const tile = emptyTiles[randomNumber];
    board[tile.row][tile.column] = Math.random() < 0.9 ? 2 : 4;
    updateBoard();
}

function resetMergeState() {
    mergedTiles = Array.from({ length: rows }, () => Array(columns).fill(false));
}

function markTileAsMerged(row, column) {
    mergedTiles[row][column] = true;
}

function isTileMerged(row, column) {
    return mergedTiles[row][column];
}

function moveTiles(direction) {
    if (!isCanMove()) {
        showGameOverAlert();
        return;
    }

    let isMoved = false;

    for (let primary = 0; primary < rows; primary++) {
        for (let secondary = 0; secondary < columns; secondary++) {
            const row = direction === "up" ? primary : direction === "down" ? rows - 1 - primary : secondary;
            const column = direction === "left" ? primary : direction === "right" ? columns - 1 - primary : secondary;

            if (board[row][column] !== 0) {
                let newRow = row;
                let newColumn = column;

                while (true) {
                    let nextRow = newRow + (direction === "down" ? 1 : direction === "up" ? -1 : 0);
                    let nextColumn = newColumn + (direction === "right" ? 1 : direction === "left" ? -1 : 0);

                    if (nextRow < 0 || nextRow >= rows || nextColumn < 0 || nextColumn >= columns) {
                        break; // The edge of the board has been reached
                    }

                    if (board[nextRow][nextColumn] === 0) {
                        // Move the tile to an empty cell
                        board[nextRow][nextColumn] = board[newRow][newColumn];
                        board[newRow][newColumn] = 0;
                        newRow = nextRow;
                        newColumn = nextColumn;
                        isMoved = true;
                    } else if (board[nextRow][nextColumn] === board[newRow][newColumn]) {
                        // Merge tiles if they have the same value
                        if (!isTileMerged(nextRow, nextColumn) && !isTileMerged(newRow, newColumn)) {
                            board[nextRow][nextColumn] *= 2;
                            score += board[nextRow][nextColumn];
                            if (score > bestScore) {
                                bestScore = score; // Update bestScore only if score surpasses it
                            }
                            board[newRow][newColumn] = 0;
                            markTileAsMerged(nextRow, nextColumn);
                            isMoved = true;
                        }
                        break;
                    } else {
                        break; //  Unable to move or merge further
                    }
                }
            }
        }
    }

    if (isMoved) {
        saveGameState();
        resetMergeState();
        setRandomTileToBoard();
        updateBoard();
    }
}

function moveLeft() {
    moveTiles("left");
}

function moveRight() {
    moveTiles("right");
}

function moveUp() {
    moveTiles("up");
}

function moveDown() {
    moveTiles("down");
}

function isCanMove() {
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            if (board[row][column] === 0) {
                return true; 
            }
            
            if (column > 0 
                && board[row][column] === board[row][column - 1]) {
                return true;
            }

            if (row > 0 
                && board[row][column] === board[row - 1][column]) {
                return true;
            }
        }
    }
    
    return false;
}

function showGameOverAlert() {
    alert("Game over, you lost");
    location.reload();
}

document.addEventListener('keyup', (e) => {
    const key = e.key;
    if (key === 'ArrowUp' 
        || key === 'ArrowDown' 
        || key === 'ArrowLeft' 
        || key === 'ArrowRight') {
        moveTiles(key.substring(5).toLowerCase());
        saveGameState();
    }
});

document.addEventListener('touchstart', (e) => {
    swipeStartX = e.touches[0].clientX;
    swipeStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    swipeEndX = e.changedTouches[0].clientX;
    swipeEndY = e.changedTouches[0].clientY;

    saveGameState();
    handleSwipe();
});

function handleSwipe() {
    const deltaX = swipeEndX - swipeStartX;
    const deltaY = swipeEndY - swipeStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            moveRight();
        } else {
            moveLeft();
        }
    } else {
        if (deltaY > 0) {
            moveDown();
        } else {
            moveUp();
        }
    }
}

function resetGame() {
    localStorage.removeItem('gameState');
    board = Array.from({ length: rows }, () => Array(columns).fill(0));
    score = 0;
    mergedTiles = Array.from({ length: rows }, () => Array(columns).fill(false)); 

    updateBoard();
    setRandomTileToBoard();
    setRandomTileToBoard();
}

function askToRestoreProgress() {
    const restore = confirm('Do you want to restore your progress?');
    
    if (restore) {
        loadGameState();
    } else {
        resetGame();
    }
}

window.onload = function() {
    askToRestoreProgress();
}
