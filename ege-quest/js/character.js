// ===== СОЗДАНИЕ ПЕРСОНАЖА =====

const Character = {
    avatars: ['🧑‍🎓', '👨‍💻', '👩‍🔬', '🧙‍♂️', '🦸‍♀️', '🦹‍♂️', '🧝‍♀️', '🧛‍♂️', '👨‍🚀', '👩‍🎨', '🥷', '🧑‍🏫'],
    
    selectedAvatar: 0,
    
    init() {
        this.renderAvatars();
        this.bindEvents();
    },
    
    renderAvatars() {
        const grid = document.getElementById('avatar-grid');
        if (!grid) return;
        
        grid.innerHTML = this.avatars.map((avatar, index) => `
            <div class="avatar-option ${index === this.selectedAvatar ? 'selected' : ''}" 
                 data-index="${index}">
                ${avatar}
            </div>
        `).join('');
    },
    
    bindEvents() {
        const grid = document.getElementById('avatar-grid');
        const nameInput = document.getElementById('player-name');
        const startBtn = document.getElementById('start-journey');
        
        if (grid) {
            grid.addEventListener('click', (e) => {
                const option = e.target.closest('.avatar-option');
                if (option) {
                    this.selectedAvatar = parseInt(option.dataset.index);
                    this.renderAvatars();
                    this.validateForm();
                }
            });
        }
        
        if (nameInput) {
            nameInput.addEventListener('input', () => this.validateForm());
            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.startGame();
                }
            });
        }
        
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }
    },
    
    validateForm() {
        const nameInput = document.getElementById('player-name');
        const startBtn = document.getElementById('start-journey');
        
        if (nameInput && startBtn) {
            const isValid = nameInput.value.trim().length >= 2;
            startBtn.disabled = !isValid;
        }
    },
    
    startGame() {
        const nameInput = document.getElementById('player-name');
        if (!nameInput || nameInput.value.trim().length < 2) return;
        
        GameState.createCharacter(
            nameInput.value.trim(),
            this.selectedAvatar
        );
        
        App.showMainScreen();
    }
};
