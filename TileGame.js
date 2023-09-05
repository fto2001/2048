// TileGame.js
export default class TileGame {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.board = [];
        this.score = 0;
        this.bestScore = 0;
        this.mergedTiles = [];
        this.swipeStartX = 0;
        this.swipeStartY = 0;
        this.swipeEndX = 0;
        this.swipeEndY = 0;

        this.initialize();
    }

    initialize() {
        this.board = Array.from({ length: this.rows }, () => Array(this.columns).fill(0));
        this.updateBoard();
    }

    saveGameState() {
        localStorage.setItem('gameState', JSON.stringify({ board: this.board, score: this.score, mergedTiles: this.mergedTiles, bestScore: this.bestScore }));
    }

    loadGameState() {
        const savedState = localStorage.getItem('gameState');

        if (savedState) {
            const { board: savedBoard, score: savedScore, mergedTiles: savedMergedTiles, bestScore: savedBestScore } = JSON.parse(savedState);
            this.board = savedBoard;
            this.score = savedScore;
            this.mergedTiles = savedMergedTiles;
            this.bestScore = savedBestScore;
            this.updateBoard();
        }
    }

    startGame() {
        this.board = Array.from({ length: this.rows }, () => Array(this.columns).fill(0));

        this.updateBoard();
        this.setRandomTileToBoard();
        this.setRandomTileToBoard();
    }

    updateBoard() {
        const boardElement = document.getElementById("board");
        boardElement.innerHTML = "";

        for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
                const tileValue = this.board[row][column];
                const tile = this.createTileElement(tileValue);
                boardElement.appendChild(tile);
            }
        }

        const scoreDisplay = document.getElementsByClassName('tab-score')[0];
        const bestScoreDisplay = document.getElementsByClassName('best-score')[0];

        scoreDisplay.innerText = this.score;
        bestScoreDisplay.innerText = this.bestScore;
    }

    generateTileColor(value) {
        const hueStart = 0;
        const hueEnd = 120;
        const hueStep = (hueEnd - hueStart) / 11;
        const hue = (Math.log2(value) % 12) * hueStep + hueStart;
        const saturation = 50;
        const lightness = 50;

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    createTileElement(num) {
        const tile = document.createElement("div");

        tile.className = "tile x" + num;
        tile.textContent = num > 0 ? num : "";
        tile.style.backgroundColor = this.generateTileColor(num);

        return tile;
    }

    setRandomTileToBoard() {
        const emptyTiles = [];
    
        for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
                if (this.board[row][column] === 0) {
                    emptyTiles.push({ row: row, column: column });
                }
            }
        }
    
        if (emptyTiles.length === 0) return;
    
        const randomNumber = Math.floor(Math.random() * emptyTiles.length);
        const tile = emptyTiles[randomNumber];
        this.board[tile.row][tile.column] = Math.random() < 0.9 ? 2 : 4; 
        this.updateBoard();
    }

    resetMergeState() {
        this.mergedTiles = Array.from({ length: this.rows }, () => Array(this.columns).fill(false));
    }

    markTileAsMerged(row, column) {
        this.mergedTiles[row][column] = true;
    }

    isTileMerged(row, column) {
        return this.mergedTiles[row][column];
    }

    moveTiles(direction) {
        this.resetMergeState();
    
        if (!this.isCanMove()) {
            this.showGameOverAlert();
            return;
        }
    
        let isMoved = false;
    
        for (let primary = 0; primary < this.rows; primary++) {
            for (let secondary = 0; secondary < this.columns; secondary++) {
                const row = direction === "up" ? primary : direction === "down" ? this.rows - 1 - primary : secondary;
                const column = direction === "left" ? primary : direction === "right" ? this.columns - 1 - primary : secondary;
    
                if (this.board[row][column] !== 0) {
                    let newRow = row;
                    let newColumn = column;
    
                    while (true) {
                        const verticalMove = (direction === "down" ? 1 : direction === "up" ? -1 : 0);
                        const horizontalMove = (direction === "right" ? 1 : direction === "left" ? -1 : 0);
                        const nextRow = newRow + verticalMove;
                        const nextColumn = newColumn + horizontalMove;
    
                        if (nextRow < 0 || nextRow >= this.rows || nextColumn < 0 || nextColumn >= this.columns) {
                            break;
                        }
    
                        if (this.board[nextRow][nextColumn] === 0) {
                            this.board[nextRow][nextColumn] = this.board[newRow][newColumn];
                            this.board[newRow][newColumn] = 0;
                            newRow = nextRow;
                            newColumn = nextColumn;
                            isMoved = true;
                        } else if (this.board[nextRow][nextColumn] === this.board[newRow][newColumn]) {
                            if (!this.isTileMerged(nextRow, nextColumn) && !this.isTileMerged(newRow, newColumn)) {
                                this.board[nextRow][nextColumn] *= 2;
                                this.score += this.board[nextRow][nextColumn];
                                if (this.score > this.bestScore) {
                                    this.bestScore = this.score;
                                }
                                this.board[newRow][newColumn] = 0;
                                this.markTileAsMerged(nextRow, nextColumn);
                                isMoved = true;
                            }
                            break;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
    
        if (isMoved) {
            this.saveGameState();
            this.resetMergeState();
            this.setRandomTileToBoard();
            this.updateBoard();
    
            const tileElements = document.querySelectorAll('.tile');
            tileElements.forEach(tileElement => {
                tileElement.classList.add(`move-${direction}`);
            });
    
            setTimeout(() => {
                tileElements.forEach(tileElement => {
                    tileElement.classList.remove(`move-${direction}`);
                });
            }, 200);
        }
    }

    moveLeft() {
        this.moveTiles("left");
    }

    moveRight() {
        this.moveTiles("right");
    }

    moveUp() {
        this.moveTiles("up");
    }

    moveDown() {
        this.moveTiles("down");
    }

    isCanMove() {
        for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
                const canMoveEmptyCell = this.board[row][column] === 0;
                const canMoveUp = column > 0 && this.board[row][column] === this.board[row][column - 1];
                const canMoveRight = row > 0 && this.board[row][column] === this.board[row - 1][column];

                if (canMoveEmptyCell || canMoveUp || canMoveRight) return true;
            }
        }

        return false;
    }

    showGameOverAlert() {
        const fail = new Audio("sounds/fail-wha-wha-version.mp3");

        alert("Game over, you lost");
        fail.play();
        this.resetGame();
    }

    handleSwipe() {
        const deltaX = this.swipeEndX - this.swipeStartX;
        const deltaY = this.swipeEndY - this.swipeStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                this.moveRight();
            } else {
                this.moveLeft();
            }
        } else {
            if (deltaY > 0) {
                this.moveDown();
            } else {
                this.moveUp();
            }
        }
    }

    resetGame() {
        localStorage.removeItem('gameState');
        this.board = Array.from({ length: this.rows }, () => Array(this.columns).fill(0));
        this.score = 0;
        this.mergedTiles = Array.from({ length: this.rows }, () => Array(this.columns).fill(false));

        this.updateBoard();
        this.setRandomTileToBoard();
        this.setRandomTileToBoard();
    }

    resetGameConfirm() {
        const reset = confirm('Do you want to reset your game?');

        if (reset) {
            this.resetGame();
        }
    }

    askToRestoreProgress() {
        const restore = confirm('Do you want to restore your progress?');

        if (restore) {
            this.loadGameState();
        } else {
            this.resetGame();
        }
    }
}