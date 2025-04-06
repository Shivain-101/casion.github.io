
class MinesGame {
    constructor() {
        this.grid = [];
        this.minesCount = 5;
        this.betAmount = 10;
        this.isGameActive = false;
        this.revealedCount = 0;
        this.multiplier = 1.0;
        this.houseEdge = 0.05; // 5% house edge
        this.playerBalance = 1000; // Starting balance
        
        this.initializeUI();
        this.setupEventListeners();
    }

    initializeUI() {
        this.minesGrid = document.querySelector('.mines-grid');
        this.startButton = document.getElementById('start-game');
        this.cashoutButton = document.getElementById('cashout');
        this.multiplierDisplay = document.getElementById('current-multiplier');
        this.potentialWinDisplay = document.getElementById('potential-win');
        
        // Create 25 tiles (5x5 grid)
        for (let i = 0; i < 25; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.index = i;
            this.minesGrid.appendChild(tile);
        }
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.cashoutButton.addEventListener('click', () => this.cashout());
        this.minesGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('tile') && this.isGameActive) {
                this.revealTile(e.target);
            }
        });
    }

    startGame() {
        this.minesCount = parseInt(document.getElementById('mines-count').value);
        this.betAmount = parseInt(document.getElementById('bet-amount').value);
        
        if (this.minesCount < 1 || this.minesCount > 24) {
            alert('Please select between 1 and 24 mines');
            return;
        }

        if (this.betAmount > this.playerBalance) {
            alert('Insufficient balance!');
            return;
        }

        // Deduct bet amount from balance
        this.playerBalance -= this.betAmount;
        this.updateBalance();

        this.isGameActive = true;
        this.revealedCount = 0;
        this.multiplier = 1.0;
        this.startButton.disabled = true;
        this.cashoutButton.disabled = false;
        
        // Reset grid
        this.grid = new Array(25).fill(false);
        // Place mines randomly
        let minesToPlace = this.minesCount;
        while (minesToPlace > 0) {
            const pos = Math.floor(Math.random() * 25);
            if (!this.grid[pos]) {
                this.grid[pos] = true;
                minesToPlace--;
            }
        }
        
        // Reset UI
        document.querySelectorAll('.tile').forEach(tile => {
            tile.className = 'tile';
        });
        
        this.updateMultiplier();
    }

    revealTile(tile) {
        const index = parseInt(tile.dataset.index);
        if (this.grid[index]) {
            // Hit a mine
            tile.classList.add('mine');
            this.endGame(false);
        } else {
            // Safe tile
            tile.classList.add('revealed');
            this.revealedCount++;
            this.updateMultiplier();
        }
    }

    updateMultiplier() {
        // Simple multiplier calculation
        this.multiplier = parseFloat((1 / (1 - (this.revealedCount / (25 - this.minesCount)))).toFixed(2));
        this.multiplierDisplay.textContent = this.multiplier + 'x';
        this.potentialWinDisplay.textContent = (this.betAmount * this.multiplier).toFixed(2);
    }

    cashout() {
        const winAmount = this.betAmount * this.multiplier * (1 - this.houseEdge);
        this.playerBalance += winAmount;
        this.updateBalance();
        alert(`Congratulations! You won ${winAmount.toFixed(2)} coins!`);
        this.endGame(true);
    }

    updateBalance() {
        document.getElementById('player-balance').textContent = this.playerBalance.toFixed(2);
    }

    endGame(success) {
        this.isGameActive = false;
        this.startButton.disabled = false;
        this.cashoutButton.disabled = true;
        
        if (!success) {
            // Reveal all mines
            this.grid.forEach((isMine, index) => {
                if (isMine) {
                    document.querySelector(`[data-index="${index}"]`).classList.add('mine');
                }
            });
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MinesGame();
});

