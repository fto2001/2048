// GameManager.js
export default class GameManager {
    constructor(game) {
        this.game = game;
    }

    move(direction) {
        this.game.moveTiles(direction);
    }

    moveLeft() {
        this.game.moveLeft();
    }

    moveRight() {
        this.game.moveRight();
    }

    moveUp() {
        this.game.moveUp();
    }

    moveDown() {
        this.game.moveDown();
    }
}