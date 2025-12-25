// ===== ОСНОВНОЕ ПРИЛОЖЕНИЕ =====

const App = {
    currentPage: 'roadmap',
    
    // Инициализация приложения
    async init() {
        // Показываем загрузку
        await Utils.delay(1500);
        
        // Скрываем экран загрузки
        document.getElementById('loading-screen').classList.add('hidden');
        
        // Инициализируем состояние игры
        const hasCharacter = GameState.init();
        
        if (hasCharacter) {
            this.showMainScreen();
        } else {
            this.showCharacterCreation();
        }
    },
    
    // Показать экран создания персонажа
    showCharacterCreation() {
        document.getElementById('character-creation').classList.remove('hidden');
        Character.init();
    },
    
    // Показать главный экран
    showMainScreen() {
        document.getElementById('character-creation').classList.add('hidden');
        document.getElementById('main-screen').classList.remove('hidden');
        
        this.updateUI();
        this.bindNavigation();
        
        // Инициализируем компоненты
        Roadmap.render();
        Mascot.init();
    },
    
    // Привязка навигации
    bindNavigation() {
        // Все кнопки навигации (сайдбар + мобильная)
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                if (page) {
                    this.navigateTo(page);
                }
            });
        });
    },
    
    // Навигация между страницами
    navigateTo(page) {
        // Обновляем активные пункты меню
        document.querySelectorAll('.nav-item').forEach(item => {
            const isActive = item.dataset.page === page;
            item.classList.toggle('active', isActive);
            
            // Сохраняем специальный класс для маскота
            if (item.dataset.page === 'mascot' && !isActive) {
                item.classList.add('mascot-nav');
            }
        });
        
        // Скрываем все страницы
        document.querySelectorAll('.page').forEach(p => {
            p.classList.add('hidden');
            p.classList.remove('active');
        });
        
        // Показываем нужную страницу
        const pageElement = document.getElementById(`page-${page}`);
        if (pageElement) {
            pageElement.classList.remove('hidden');
            pageElement.classList.add('active');
        }
        
        // Рендерим контент страницы
        switch (page) {
            case 'roadmap':
                Roadmap.render();
                break;
            case 'mascot':
                Mascot.init();
                break;
            case 'avatar':
                AvatarCustomizer.init();
                break;
            case 'stats':
                Stats.render();
                break;
            case 'shop':
                Shop.init();
                break;
            case 'achievements':
                Achievements.render();
                break;
        }
        
        this.currentPage = page;
    },
    
    // Обновление UI
    updateUI() {
        const state = GameState.data;
        
        // Сердца
        this.updateHearts();
        
        // Кристаллы
        const pointsDisplay = document.getElementById('points-display');
        if (pointsDisplay) {
            pointsDisplay.textContent = state.points;
        }
        
        // Серия
        const streakCount = document.getElementById('streak-count');
        if (streakCount) {
            streakCount.textContent = state.streak;
        }
        
        // Полоса опыта
        const expFill = document.getElementById('exp-fill');
        const expText = document.getElementById('exp-text');
        if (expFill && expText) {
            const percentage = (state.exp / state.expToNextLevel) * 100;
            expFill.style.width = `${percentage}%`;
            expText.textContent = `${state.exp} / ${state.expToNextLevel} XP`;
        }
        
        // Уровень в хедере
        const headerLevel = document.getElementById('header-level');
        if (headerLevel) {
            headerLevel.textContent = state.level;
        }
        
        // Аватар в хедере
        const headerAvatar = document.getElementById('header-avatar');
        if (headerAvatar) {
            headerAvatar.textContent = Character.getAvatar(
                state.equipped.base ?? state.character.avatar
            );
        }
    },
    
    // Обновление сердец
    updateHearts() {
        const container = document.getElementById('hearts-container');
        if (!container) return;
        
        const hearts = GameState.data.hearts;
        const maxHearts = GameState.data.maxHearts;
        
        let html = '';
        for (let i = 0; i < maxHearts; i++) {
            const isFull = i < hearts;
            html += `<span class="heart ${isFull ? '' : 'empty'}">${isFull ? '❤️' : '🖤'}</span>`;
        }
        
        container.innerHTML = html;
    },
    
    // Показать уведомление
    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '❌';
        if (type === 'warning') icon = '⚠️';
        
        notification.innerHTML = `
            <span class="notification-icon">${icon}</span>
            <span class="notification-text">${message}</span>
        `;
        
        container.appendChild(notification);
        
        // Удаляем через 3 секунды
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// ===== ЗАПУСК ПРИЛОЖЕНИЯ =====

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Сохранение при закрытии страницы
window.addEventListener('beforeunload', () => {
    GameState.save();
});

// Восстановление сердец каждую минуту
setInterval(() => {
    GameState.regenerateHearts();
    App.updateHearts();
}, 60000);

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    // Можно добавить адаптивную логику
});
