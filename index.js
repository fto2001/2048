// Constants for the number of rows and columns in the game
const rows = 4;
const columns = 4;

// Variables to store game state and score
let board;
let score = 0;
let swipeStartX, swipeStartY, swipeEndX, swipeEndY;

// Initializing the game when the page is loaded
window.onload = function() {
    startGame();
}

// Function for setting up the game
function startGame() {
    // Creating an empty board with the size of rows x columns
    board = Array.from({ length: rows }, () => Array(columns).fill(0));

    updateBoard();
    setRandomTileToBoard();
    setRandomTileToBoard();
}

// A function to update the display of the game on the page
function updateBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";

    // We walk through each cell of the board and create the corresponding element of the tile
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const tile = createTileElement(board[row][column]);
            boardElement.appendChild(tile);
        }
    }

    // Update score display
    const scoreDisplay = document.getElementById('score');
    scoreDisplay.innerText = "Score: " + score;
}

// A function to create a tile element with the corresponding numeric value
function createTileElement(num) {
    const tile = document.createElement("div");

    tile.className = "tile x" + num;
    tile.textContent = num > 0 ? num : "";
    
    return tile;
}

// A function to place a random tile on an empty space on the board
function setRandomTileToBoard() {
    const emptyTiles = [];

    // We find all the empty cells on the board
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            if (board[row][column] === 0) {
                emptyTiles.push({ row: row, column: column }); // Add the coordinates of the empty cell to the array
            }
        }
    }

    if (emptyTiles.length === 0) return;
    
    const randomNumber = Math.floor(Math.random() * emptyTiles.length);
    const tile = emptyTiles[randomNumber];
    board[tile.row][tile.column] = Math.random() < 0.9 ? 2 : 4;
    updateBoard();
}

// Function for resetting the state of merged tiles
function resetMergeState() {
    mergedTiles = Array.from({ length: rows }, () => Array(columns).fill(false));
}

// Function to mark tiles as merged
function markTileAsMerged(row, column) {
    mergedTiles[row][column] = true;
}

// A function to check if a tile has been merged
function isTileMerged(row, column) {
    return mergedTiles[row][column];
}

// Move tiles in a given direction
function moveTiles(direction) {
    if (!isCanMove()) {
        showGameOverAlert();
    }

    let moved = false;

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            if (board[row][column] !== 0) {
                let newRow = row;
                let newColumn = column;

                while (true) {
                    let nextRow, nextColumn;

                    switch (direction) {
                        case "left":
                            nextRow = newRow;
                            nextColumn = newColumn - 1;
                            break;
                        case "right":
                            nextRow = newRow;
                            nextColumn = newColumn + 1;
                            break;
                        case "up":
                            nextRow = newRow - 1;
                            nextColumn = newColumn;
                            break;
                        case "down":
                            nextRow = newRow + 1;
                            nextColumn = newColumn;
                            break;
                    }

                    if (nextRow < 0 || nextRow >= rows || nextColumn < 0 || nextColumn >= columns) {
                        break; // Reached the edge of the board
                    }

                    if (board[nextRow][nextColumn] === 0) {
                        // Move the tile to the empty cell
                        board[nextRow][nextColumn] = board[newRow][newColumn];
                        board[newRow][newColumn] = 0;
                        newRow = nextRow;
                        newColumn = nextColumn;
                        moved = true;
                    } else if (board[nextRow][nextColumn] === board[newRow][newColumn]) {
                        // Merge tiles if they have the same value
                        if (!isTileMerged(nextRow, nextColumn) && !isTileMerged(newRow, newColumn)) {
                            board[nextRow][nextColumn] *= 2;
                            score += board[nextRow][nextColumn];
                            board[newRow][newColumn] = 0;
                            markTileAsMerged(nextRow, nextColumn);
                            moved = true;
                        }
                        break;
                    } else {
                        break; // Cannot move or merge further
                    }
                }
            }
        }
    }

    if (moved) {
        resetMergeState();
        setRandomTileToBoard();
        updateBoard();
    }
}

//  Move tiles left
function moveLeft() {
    moveTiles("left");
}

// Move tiles right
function moveRight() {
    moveTiles("right");
}

// Move tiles up
function moveUp() {
    moveTiles("up");
}

// Move tiles down
function moveDown() {
    moveTiles("down");
}

// A function to check if at least one move is possible
function isCanMove() {
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            if (board[row][column] === 0) {

                return true; // There is an empty cell
            }
            if (column > 0 && board[row][column] === board[row][column - 1]) {

                return true; // It is possible to connect to the left
            }
            if (row > 0 && board[row][column] === board[row - 1][column]) {
                
                return true; // It is possible to connect upwards
            }
        }
    }
    return false; // There is no way to make a move
}

function showGameOverAlert() {
    alert("Game over, you lost");
    location.reload();
}

// Adding a key event listener to handle game movement
document.addEventListener('keyup', (e) => {
    const key = e.key;
    
    if (key === "ArrowUp") {
        moveUp();
    } else if (key === "ArrowDown") {
        moveDown();
    } else if (key === "ArrowLeft") {
        moveLeft();
    } else if (key === "ArrowRight") {
        moveRight();
    }
});

// Adding touch event listeners
document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scrolling while swiping
});

document.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;

    handleSwipe();
});

function handleSwipe() {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    
    // Determine the direction of the swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
            moveRight();
        } else {
            moveLeft();
        }
    } else {
        // Vertical swipe
        if (deltaY > 0) {
            moveDown();
        } else {
            moveUp();
        }
    }
}
