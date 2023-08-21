// Constants for the number of rows and columns in the game
const rows = 4;
const columns = 4;

// Variables to store game state and score
let board;
let score = 0;

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

// Move tiles left
function moveLeft() {
    if (!isCanMove()) {
        showGameOverAlert();  // Notification of loss
    }

    let moved = false;

    for (let row = 0; row < rows; row++) {
        for (let column = 1; column < columns; column++) {
            if (board[row][column] !== 0) {
                let prevColumn = column - 1;

                // We check the cells on the left and move the tile if possible
                while (prevColumn >= 0) {
                    if (board[row][prevColumn] === 0) {
                        board[row][prevColumn] = board[row][column];
                        board[row][column] = 0;
                        column = prevColumn; // We remain on this column for further unification
                        moved = true;
                    } else if (board[row][prevColumn] === board[row][column]) {
                        // Combine two tiles if they have the same values
                        if (!isTileMerged(row, prevColumn)) {
                            board[row][prevColumn] *= 2;
                            board[row][column] = 0;
                            score += board[row][prevColumn];
                            markTileAsMerged(row, prevColumn);
                            moved = true;
                        }
                        break;
                    } else {
                        break;
                    }

                    prevColumn--;
                }
            }
        }
    }

    if (moved) {
        resetMergeState(); // Resetting the state of merged tiles
        setRandomTileToBoard(); // Adding a new tile
        updateBoard(); // Update game display
    }
}
// Move tiles right
function moveRight() {
    if (!isCanMove()) {
        showGameOverAlert();
    }

    let moved = false;

    for (let row = 0; row < rows; row++) {
        for (let column = columns - 2; column >= 0; column--) {
            if (board[row][column] !== 0) {
                let nextColumn = column + 1;

                while (nextColumn < columns) {
                    if (board[row][nextColumn] === 0) {
                        board[row][nextColumn] = board[row][column];
                        board[row][column] = 0;
                        column = nextColumn;
                        moved = true;
                    } else if (board[row][nextColumn] === board[row][column]) {
                        if (!isTileMerged(row, nextColumn)) {
                            board[row][nextColumn] *= 2;
                            board[row][column] = 0;
                            score += board[row][nextColumn];
                            markTileAsMerged(row, nextColumn);
                            moved = true;
                        }
                        break;
                    } else {
                        break;
                    }

                    nextColumn++;
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

// Move tiles down
function moveDown() {
    if (!isCanMove()) {
        showGameOverAlert();
    }

    let moved = false;

    for (let column = 0; column < columns; column++) {
        for (let row = rows - 2; row >= 0; row--) {
            if (board[row][column] !== 0) {
                let nextRow = row + 1;

                while (nextRow < rows) {
                    if (board[nextRow][column] === 0) {
                        board[nextRow][column] = board[row][column];
                        board[row][column] = 0;
                        row = nextRow;
                        moved = true;
                    } else if (board[nextRow][column] === board[row][column]) {
                        if (!isTileMerged(nextRow, column)) {
                            board[nextRow][column] *= 2;
                            board[row][column] = 0;
                            score += board[nextRow][column];
                            markTileAsMerged(nextRow, column);
                            moved = true;
                        }
                        break;
                    } else {
                        break;
                    }

                    nextRow++;
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

// Move tiles up
function moveUp() {
    if (!isCanMove()) {
        showGameOverAlert();
    }

    let moved = false;

    for (let column = 0; column < columns; column++) {
        for (let row = 1; row < rows; row++) {
            if (board[row][column] !== 0) {
                let prevRow = row - 1;

                while (prevRow >= 0) {
                    if (board[prevRow][column] === 0) {
                        board[prevRow][column] = board[row][column];
                        board[row][column] = 0;
                        row = prevRow;
                        moved = true;
                    } else if (board[prevRow][column] === board[row][column]) {
                        if (!isTileMerged(prevRow, column)) {
                            board[prevRow][column] *= 2;
                            board[row][column] = 0;
                            score += board[prevRow][column];
                            markTileAsMerged(prevRow, column);
                            moved = true;
                        }
                        break;
                    } else {
                        break;
                    }

                    prevRow--;
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
