// main.js
import TileGame from '/TileGame.js';
import LocalStorageManager from '/LocalStorageManager.js';
import GameUI from '/GameUI.js';
import GameManager from '/GameManager.js';

const rows = 4;
const columns = 4;

const game = new TileGame(rows, columns);
const localStorageManager = new LocalStorageManager();
const gameManager = new GameManager(game);
const gameUI = new GameUI(game, localStorageManager, gameManager);

window.onload = function() {
    gameUI.initialize();
    game.loadGameState();
    game.updateBoard();
    game.askToRestoreProgress();

    const resetButton = document.getElementById("resetButton");

    resetButton.addEventListener("click", function() {
        game.resetGameConfirm();
    });
};

