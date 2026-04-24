// ===== ДОРОЖНАЯ КАРТА =====

const Roadmap = {
    isInitialized: false, // <--- ДОБАВЛЯЕМ
    
    // Рендер карты
    render() {
        const container = document.getElementById('roadmap-container');
        if (!container) return;
        
        const taskTypes = getTaskTypes();
        const progress = GameState.data.unitProgress;
        
        container.innerHTML = taskTypes.map((type, index) => {
            const unitProgress = progress[type.id] || { 
                unlocked: index === 0, 
                completed: false, 
                stars: 0, 
                bestScore: 0 
            };
            
            const isLocked = !unitProgress.unlocked;
            const isCompleted = unitProgress.completed;
            
            return `
                <div class="unit-card ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}" 
                     data-type="${type.id}" 
                     ${!isLocked ? 'tabindex="0"' : ''}>
                    <div class="unit-header">
                        <div class="unit-icon" style="background: linear-gradient(135deg, ${type.color}, ${type.color}dd);">
                            ${isLocked ? '🔒' : type.icon}
                        </div>
                        <div class="unit-info">
                            <h3>Задание ${type.id}</h3>
                            <p>${type.name}</p>
                        </div>
                    </div>
                    
                    <div class="unit-progress">
                        <div class="unit-progress-bar">
                            <div class="unit-progress-fill" style="width: ${isCompleted ? 100 : (unitProgress.bestScore / 5 * 100)}%;"></div>
                        </div>
                    </div>
                    
                    <div class="unit-stars">
                        ${this.renderStars(unitProgress.stars)}
                    </div>
                    
                    ${!isLocked ? `
                        <div class="unit-status">
                            ${isCompleted ? '✅ Пройдено' : `Лучший: ${unitProgress.bestScore}/5`}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        if (!this.isInitialized) { // <--- ПРОВЕРЯЕМ
            this.bindEvents();
            this.isInitialized = true;
        }
    },
    
    // Рендер звёзд
    renderStars(count) {
        let stars = '';
        for (let i = 1; i <= 3; i++) {
            stars += `<span class="star ${i <= count ? 'earned' : ''}">⭐</span>`;
        }
        return stars;
    },
    
    // Привязка событий
    bindEvents() {
        const cards = document.querySelectorAll('.unit-card:not(.locked)');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const type = parseInt(card.dataset.type);
                this.startLesson(type);
            });
            
            // Поддержка клавиатуры
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const type = parseInt(card.dataset.type);
                    this.startLesson(type);
                }
            });
        });
    },
    
    // Начать урок
    startLesson(type) {
        // Проверка сердец
        if (GameState.data.hearts <= 0) {
            App.showNotification('💔 У вас нет сердец! Подождите или купите в магазине.', 'error');
            return;
        }
        
        // Получаем задания
        const tasks = getRandomTasks(type, 5);
        
        if (tasks.length === 0) {
            App.showNotification('😿 Задания для этого типа пока недоступны', 'warning');
            return;
        }
        
        // Запускаем урок
        Lesson.start(type, tasks);
    }
};
