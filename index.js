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

    updateDisplay();
    setRandomTile();
    setRandomTile();
}

// A function to update the display of the game on the page
function updateDisplay() {
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
    document.getElementById("score").innerText = "Score: " + score;
}

// A function to create a tile element with the corresponding numeric value
function createTileElement(num) {
    const tile = document.createElement("div");
    tile.className = "tile x" + num;
    tile.textContent = num > 0 ? num : "";
    return tile;
}

// A function to place a random tile on an empty space on the board
function setRandomTile() {
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
    
    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const tile = emptyTiles[randomIndex];
    board[tile.row][tile.column] = Math.random() < 0.9 ? 2 : 4;
    updateDisplay();
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
    if (!canMove()) {
        alert("Game over, you lost"); // Notification of loss
        location.reload(); 
    }

    let moved = false;

    for (let row = 0; row < rows; row++) {
        for (let column = 1; column < columns; column++) {
            if (board[row][column] !== 0) {
                let prevC = column - 1;

                // We check the cells on the left and move the tile if possible
                while (prevC >= 0) {
                    if (board[row][prevC] === 0) {
                        board[row][prevC] = board[row][column];
                        board[row][column] = 0;
                        column = prevC; // We remain on this column for further unification
                        moved = true;
                    } else if (board[row][prevC] === board[row][column]) {
                        // Combine two tiles if they have the same values
                        if (!isTileMerged(row, prevC)) {
                            board[row][prevC] *= 2;
                            board[row][column] = 0;
                            score += board[row][prevC];
                            markTileAsMerged(row, prevC);
                            moved = true;
                        }
                        break;
                    } else {
                        break;
                    }

                    prevC--;
                }
            }
        }
    }

    if (moved) {
        resetMergeState(); // Resetting the state of merged tiles
        setRandomTile(); // Adding a new tile
        updateDisplay(); // Update game display
    }
}
// Move tiles right
function moveRight() {
    if (!canMove()) {
        alert("Game over, you lost"); // Notification of loss
        location.reload(); 
    }

    let moved = false;

    for (let row = 0; row < rows; row++) {
        for (let column = columns - 2; column >= 0; column--) {
            if (board[row][column] !== 0) {
                let nextC = column + 1;

                while (nextC < columns) {
                    if (board[row][nextC] === 0) {
                        board[row][nextC] = board[row][column];
                        board[row][column] = 0;
                        column = nextC;
                        moved = true;
                    } else if (board[row][nextC] === board[row][column]) {
                        if (!isTileMerged(row, nextC)) {
                            board[row][nextC] *= 2;
                            board[row][column] = 0;
                            score += board[row][nextC];
                            markTileAsMerged(row, nextC);
                            moved = true;
                        }
                        break;
                    } else {
                        break;
                    }

                    nextC++;
                }
            }
        }
    }

    if (moved) {
        resetMergeState();
        setRandomTile();
        updateDisplay();
    }
}

// Move tiles down
function moveDown() {
    if (!canMove()) {
        alert("Game over, you lost"); // Notification of loss
        location.reload(); 
    }

    let moved = false;

    for (let column = 0; column < columns; column++) {
        for (let row = rows - 2; row >= 0; row--) {
            if (board[row][column] !== 0) {
                let nextR = row + 1;

                while (nextR < rows) {
                    if (board[nextR][column] === 0) {
                        board[nextR][column] = board[row][column];
                        board[row][column] = 0;
                        row = nextR;
                        moved = true;
                    } else if (board[nextR][column] === board[row][column]) {
                        if (!isTileMerged(nextR, column)) {
                            board[nextR][column] *= 2;
                            board[row][column] = 0;
                            score += board[nextR][column];
                            markTileAsMerged(nextR, column);
                            moved = true;
                        }
                        break;
                    } else {
                        break;
                    }

                    nextR++;
                }
            }
        }
    }

    if (moved) {
        resetMergeState();
        setRandomTile();
        updateDisplay();
    }
}

// Move tiles up
function moveUp() {
    if (!canMove()) {
        alert("Game over, you lost"); // Notification of loss
        location.reload(); 
    }

    let moved = false;

    for (let column = 0; column < columns; column++) {
        for (let row = 1; row < rows; row++) {
            if (board[row][column] !== 0) {
                let prevR = row - 1;

                while (prevR >= 0) {
                    if (board[prevR][column] === 0) {
                        board[prevR][column] = board[row][column];
                        board[row][column] = 0;
                        row = prevR;
                        moved = true;
                    } else if (board[prevR][column] === board[row][column]) {
                        if (!isTileMerged(prevR, column)) {
                            board[prevR][column] *= 2;
                            board[row][column] = 0;
                            score += board[prevR][column];
                            markTileAsMerged(prevR, column);
                            moved = true;
                        }
                        break;
                    } else {
                        break;
                    }

                    prevR--;
                }
            }
        }
    }

    if (moved) {
        resetMergeState();
        setRandomTile();
        updateDisplay();
    }
}

// A function to check if at least one move is possible
function canMove() {
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

// Adding a key event listener to handle game movement
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
