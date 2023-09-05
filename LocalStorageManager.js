// LocalStorageManager.js
export default class LocalStorageManager {
    saveGameState(gameState) {
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }

    loadGameState() {
        const savedState = localStorage.getItem('gameState');
        return savedState ? JSON.parse(savedState) : null;
    }
}