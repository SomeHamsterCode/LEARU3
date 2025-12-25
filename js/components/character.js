// ===== СОЗДАНИЕ ПЕРСОНАЖА =====

const Character = {
    avatars: ['🧑‍🎓', '👨‍💻', '👩‍🔬', '🧙‍♂️', '🦸‍♀️', '🦹‍♂️', '🧝‍♀️', '🧛‍♂️', '👨‍🚀', '👩‍🎨', '🥷', '🧑‍🏫'],
    selectedAvatar: 0,
    
    // Инициализация
    init() {
        this.renderAvatars();
        this.bindEvents();
    },
    
    // Рендер сетки аватаров
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
    
    // Привязка событий
    bindEvents() {
        const grid = document.getElementById('avatar-grid');
        const nameInput = document.getElementById('player-name');
        const startBtn = document.getElementById('start-journey');
        
        // Выбор аватара
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
        
        // Ввод имени
        if (nameInput) {
            nameInput.addEventListener('input', () => this.validateForm());
            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !startBtn.disabled) {
                    this.startGame();
                }
            });
        }
        
        // Кнопка старта
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }
    },
    
    // Валидация формы
    validateForm() {
        const nameInput = document.getElementById('player-name');
        const startBtn = document.getElementById('start-journey');
        
        if (nameInput && startBtn) {
            const isValid = nameInput.value.trim().length >= 2;
            startBtn.disabled = !isValid;
        }
    },
    
    // Начало игры
    startGame() {
        const nameInput = document.getElementById('player-name');
        if (!nameInput || nameInput.value.trim().length < 2) return;
        
        GameState.createCharacter(
            nameInput.value.trim(),
            this.selectedAvatar
        );
        
        App.showMainScreen();
    },
    
    // Получение аватара по индексу
    getAvatar(index) {
        return this.avatars[index] || this.avatars[0];
    }
};
