// GameUI.js
export default class GameUI {
    constructor(game, localStorageManager, gameManager) {
        this.game = game;
        this.localStorageManager = localStorageManager;
        this.gameManager = gameManager;
    }

    initialize() {
        document.addEventListener('keyup', (e) => {
            const key = e.key;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                this.gameManager.move(key.substring(5).toLowerCase());
                this.localStorageManager.saveGameState(this.game);
            }
        });

        document.addEventListener('touchstart', (e) => {
            this.game.swipeStartX = e.touches[0].clientX;
            this.game.swipeStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            this.game.swipeEndX = e.changedTouches[0].clientX;
            this.game.swipeEndY = e.changedTouches[0].clientY;

            this.localStorageManager.saveGameState(this.game);
            this.game.handleSwipe();
        });

    }
}