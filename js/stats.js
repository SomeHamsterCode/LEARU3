// ===== СТАТИСТИКА =====

const Stats = {
    init() {
        this.render();
    },
    
    render() {
        this.renderStatsGrid();
    },
    
    renderStatsGrid() {
        const grid = document.getElementById('stats-grid');
        if (!grid) return;
        
        const stats = GameState.data.stats;
        const accuracy = stats.totalAnswers > 0 
            ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100) 
            : 0;
        
        const statsData = [
            { icon: '📚', value: stats.lessonsCompleted, label: 'Уроков пройдено' },
            { icon: '✅', value: stats.correctAnswers, label: 'Правильных ответов' },
            { icon: '📊', value: `${accuracy}%`, label: 'Точность' },
            { icon: '🔥', value: GameState.data.streak, label: 'Дней подряд' },
            { icon: '⭐', value: stats.perfectLessons, label: 'Идеальных уроков' },
            { icon: '💎', value: GameState.data.points, label: 'Очков' }
        ];
        
        grid.innerHTML = statsData.map(stat => `
            <div class="stat-card">
                <div class="stat-icon">${stat.icon}</div>
                <div class="stat-value">${stat.value}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `).join('');
    }
};

// ===== МАГАЗИН =====

const Shop = {
    items: [
        { id: 'hearts', name: 'Восстановить сердца', description: 'Полностью восстановить все сердца', price: 50, icon: '❤️‍🩹' },
        { id: 'streak_freeze', name: 'Заморозка серии', description: 'Сохранить серию при пропуске дня', price: 100, icon: '🧊' },
        { id: 'double_xp', name: 'Двойной опыт', description: 'x2 опыта на следующий урок', price: 75, icon: '⚡' },
        { id: 'hint', name: 'Подсказка', description: 'Получить подсказку в сложном задании', price: 25, icon: '💡' }
    ],
    
    render() {
        const grid = document.getElementById('shop-grid');
        if (!grid) return;
        
        grid.innerHTML = this.items.map(item => `
            <div class="shop-item" data-id="${item.id}">
                <div class="shop-item-icon">${item.icon}</div>
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-description">${item.description}</div>
                <div class="shop-item-price">
                    <span>💎</span>
                    <span>${item.price}</span>
                </div>
            </div>
        `).join('');
        
        this.bindEvents();
    },
    
    bindEvents() {
        const items = document.querySelectorAll('.shop-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                this.purchase(id);
            });
        });
    },
    
    purchase(id) {
        const item = this.items.find(i => i.id === id);
        if (!item) return;
        
        if (GameState.data.points < item.price) {
            App.showNotification('Недостаточно очков!', 'error');
            return;
        }
        
        GameState.data.points -= item.price;
        
        switch (id) {
            case 'hearts':
                GameState.data.hearts = GameState.data.maxHearts;
                App.showNotification('❤️ Сердца восстановлены!', 'success');
                break;
            case 'streak_freeze':
                GameState.data.inventory.push('streak_freeze');
                App.showNotification('🧊 Заморозка добавлена!', 'success');
                break;
            case 'double_xp':
                GameState.data.inventory.push('double_xp');
                App.showNotification('⚡ Двойной опыт активирован!', 'success');
                break;
            case 'hint':
                GameState.data.inventory.push('hint');
                App.showNotification('💡 Подсказка добавлена!', 'success');
                break;
        }
        
        GameState.save();
        App.updateUI();
        this.render();
    }
};

// ===== ДОСТИЖЕНИЯ =====

const Achievements = {
    list: [
        { id: 'first_lesson', name: 'Первые шаги', description: 'Пройти первый урок', icon: '🎯', condition: () => GameState.data.stats.lessonsCompleted >= 1 },
        { id: 'perfect_lesson', name: 'Идеально!', description: 'Пройти урок без ошибок', icon: '🏆', condition: () => GameState.data.stats.perfectLessons >= 1 },
        { id: 'streak_3', name: 'Огонь!', description: 'Серия 3 дня подряд', icon: '🔥', condition: () => GameState.data.streak >= 3 },
        { id: 'streak_7', name: 'Неделя знаний', description: 'Серия 7 дней подряд', icon: '📅', condition: () => GameState.data.streak >= 7 },
        { id: 'correct_50', name: 'Полсотни', description: '50 правильных ответов', icon: '✅', condition: () => GameState.data.stats.correctAnswers >= 50 },
        { id: 'correct_100', name: 'Сотня!', description: '100 правильных ответов', icon: '💯', condition: () => GameState.data.stats.correctAnswers >= 100 },
        { id: 'all_units', name: 'Полный курс', description: 'Пройти все типы заданий', icon: '🎓', condition: () => {
            const types = getTaskTypes();
            return types.every(t => GameState.data.unitProgress[t.id]?.completed);
        }},
        { id: 'points_500', name: 'Богач', description: 'Накопить 500 очков', icon: '💎', condition: () => GameState.data.points >= 500 }
    ],
    
    render() {
        const grid = document.getElementById('achievements-grid');
        if (!grid) return;
        
        grid.innerHTML = this.list.map(achievement => {
            const unlocked = achievement.condition();
            return `
                <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-info">
                        <h4>${achievement.name}</h4>
                        <p>${achievement.description}</p>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    check() {
        this.list.forEach(achievement => {
            if (achievement.condition() && !GameState.data.achievements[achievement.id]) {
                GameState.data.achievements[achievement.id] = true;
                App.showNotification(`🏆 Достижение: ${achievement.name}!`, 'success');
                Utils.fireConfetti();
            }
        });
        GameState.save();
    }
};
