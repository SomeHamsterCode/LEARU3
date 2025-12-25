// ===== ДОРОЖНАЯ КАРТА =====

const Roadmap = {
    init() {
        this.render();
    },
    
    render() {
        const container = document.getElementById('roadmap-container');
        if (!container) return;
        
        const taskTypes = getTaskTypes();
        const progress = GameState.data.unitProgress;
        
        let html = '<div class="roadmap-path"></div>';
        
        taskTypes.forEach((type, index) => {
            const unitProgress = progress[type.id] || { unlocked: index === 0, completed: false, stars: 0, bestScore: 0 };
            const isLocked = !unitProgress.unlocked;
            const isCompleted = unitProgress.completed;
            const isCurrent = unitProgress.unlocked && !unitProgress.completed;
            
            html += `
                <div class="unit-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}" 
                     style="animation-delay: ${index * 0.1}s">
                    <div class="unit-connector"></div>
                    <div class="unit-card ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}"
                         data-type="${type.id}" ${isLocked ? '' : 'tabindex="0"'}>
                        <div class="unit-header">
                            <div class="unit-icon" style="background: linear-gradient(135deg, ${type.color}, ${type.color}dd)">
                                ${isLocked ? '🔒' : type.icon}
                            </div>
                            <div class="unit-info">
                                <h3>Задание ${type.id}</h3>
                                <p>${type.name}</p>
                            </div>
                        </div>
                        
                        <div class="unit-progress">
                            <div class="unit-progress-bar">
                                <div class="unit-progress-fill" style="width: ${isCompleted ? 100 : 0}%"></div>
                            </div>
                            <div class="unit-progress-text">
                                <span>${isLocked ? 'Заблокировано' : (isCompleted ? 'Пройдено' : 'Начать')}</span>
                                <span>${unitProgress.bestScore}/5</span>
                            </div>
                        </div>
                        
                        <div class="unit-stars">
                            ${this.renderStars(unitProgress.stars)}
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        this.bindEvents();
        this.updateProgress();
    },
    
    renderStars(count) {
        let stars = '';
        for (let i = 0; i < 3; i++) {
            stars += `<span class="star ${i < count ? 'earned' : ''}">⭐</span>`;
        }
        return stars;
    },
    
    bindEvents() {
        const cards = document.querySelectorAll('.unit-card:not(.locked)');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const type = parseInt(card.dataset.type);
                this.startLesson(type);
            });
        });
    },
    
    updateProgress() {
        const path = document.querySelector('.roadmap-path');
        if (path) {
            const taskTypes = getTaskTypes();
            const completedCount = taskTypes.filter(t => 
                GameState.data.unitProgress[t.id]?.completed
            ).length;
            const progress = (completedCount / taskTypes.length) * 100;
            path.style.setProperty('--progress', `${progress}%`);
        }
    },
    
    startLesson(type) {
        if (GameState.data.hearts <= 0) {
            App.showNotification('💔 У вас нет сердец! Подождите или купите в магазине.', 'error');
            return;
        }
        
        const tasks = getRandomTasks(type, 5);
        if (tasks.length === 0) {
            App.showNotification('Задания для этого типа пока недоступны', 'warning');
            return;
        }
        
        Lesson.start(type, tasks);
    }
};

