// ===== ДОСТИЖЕНИЯ =====

const Achievements = {
    // Список всех достижений
    list: [
        { 
            id: 'first_lesson', 
            name: 'Первые шаги', 
            description: 'Пройти первый урок', 
            icon: '🎯', 
            condition: () => GameState.data.stats.lessonsCompleted >= 1 
        },
        { 
            id: 'perfect_lesson', 
            name: 'Идеально!', 
            description: 'Пройти урок без ошибок', 
            icon: '🏆', 
            condition: () => GameState.data.stats.perfectLessons >= 1 
        },
        { 
            id: 'perfect_5', 
            name: 'Мастер', 
            description: 'Пройти 5 уроков без ошибок', 
            icon: '🌟', 
            condition: () => GameState.data.stats.perfectLessons >= 5 
        },
        { 
            id: 'streak_3', 
            name: 'Огонь!', 
            description: 'Серия 3 дня подряд', 
            icon: '🔥', 
            condition: () => GameState.data.streak >= 3 
        },
        { 
            id: 'streak_7', 
            name: 'Неделя знаний', 
            description: 'Серия 7 дней подряд', 
            icon: '📅', 
            condition: () => GameState.data.streak >= 7 
        },
        { 
            id: 'streak_30', 
            name: 'Месяц упорства', 
            description: 'Серия 30 дней подряд', 
            icon: '💪', 
            condition: () => GameState.data.streak >= 30 
        },
        { 
            id: 'correct_50', 
            name: 'Полсотни', 
            description: '50 правильных ответов', 
            icon: '✅', 
            condition: () => GameState.data.stats.correctAnswers >= 50 
        },
        { 
            id: 'correct_100', 
            name: 'Сотня!', 
            description: '100 правильных ответов', 
            icon: '💯', 
            condition: () => GameState.data.stats.correctAnswers >= 100 
        },
        { 
            id: 'correct_500', 
            name: 'Эксперт', 
            description: '500 правильных ответов', 
            icon: '🎓', 
            condition: () => GameState.data.stats.correctAnswers >= 500 
        },
        { 
            id: 'all_units', 
            name: 'Полный курс', 
            description: 'Пройти все типы заданий', 
            icon: '📚', 
            condition: () => {
                const types = getTaskTypes();
                return types.every(t => GameState.data.unitProgress[t.id]?.completed);
            }
        },
        { 
            id: 'all_stars', 
            name: 'Звёздный час', 
            description: 'Получить все звёзды (21)', 
            icon: '⭐', 
            condition: () => Stats.getTotalStars() >= 21
        },
        { 
            id: 'points_500', 
            name: 'Богач', 
            description: 'Накопить 500 кристаллов', 
            icon: '💎', 
            condition: () => GameState.data.points >= 500 
        },
        { 
            id: 'points_1000', 
            name: 'Миллионер', 
            description: 'Накопить 1000 кристаллов', 
            icon: '💰', 
            condition: () => GameState.data.points >= 1000 
        },
        { 
            id: 'collector', 
            name: 'Коллекционер', 
            description: 'Купить 5 предметов для аватара', 
            icon: '🛍️', 
            condition: () => GameState.data.ownedItems.length >= 6 
        },
        { 
            id: 'fashionista', 
            name: 'Модник', 
            description: 'Купить 10 предметов для аватара', 
            icon: '👗', 
            condition: () => GameState.data.ownedItems.length >= 11 
        },
        { 
            id: 'level_5', 
            name: 'Ученик', 
            description: 'Достичь 5 уровня', 
            icon: '📖', 
            condition: () => GameState.data.level >= 5 
        },
        { 
            id: 'level_10', 
            name: 'Знаток', 
            description: 'Достичь 10 уровня', 
            icon: '🧠', 
            condition: () => GameState.data.level >= 10 
        },
        {
            id: 'lion_friend',
            name: 'Друг Достойного',
            description: 'Провести 10 уроков',
            icon: '🦁',
            condition: () => GameState.data.stats.lessonsCompleted >= 10
        }
    ],
    
    // Рендер страницы достижений
    render() {
        const grid = document.getElementById('achievements-grid');
        if (!grid) return;
        
        // Сортировка: сначала полученные, потом заблокированные
        const sorted = [...this.list].sort((a, b) => {
            const aUnlocked = a.condition();
            const bUnlocked = b.condition();
            if (aUnlocked && !bUnlocked) return -1;
            if (!aUnlocked && bUnlocked) return 1;
            return 0;
        });
        
        grid.innerHTML = sorted.map(achievement => {
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
    
    // Проверка новых достижений
    check() {
        let newAchievements = [];
        
        this.list.forEach(achievement => {
            const isUnlocked = achievement.condition();
            const wasUnlocked = GameState.data.achievements[achievement.id];
            
            if (isUnlocked && !wasUnlocked) {
                GameState.data.achievements[achievement.id] = true;
                newAchievements.push(achievement);
            }
        });
        
        // Показываем уведомления о новых достижениях
        newAchievements.forEach((achievement, index) => {
            setTimeout(() => {
                App.showNotification(`🏆 Достижение: ${achievement.name}!`, 'success');
                if (index === 0) {
                    Utils.fireConfetti();
                }
            }, index * 1000);
        });
        
        if (newAchievements.length > 0) {
            GameState.save();
        }
        
        return newAchievements;
    },
    
    // Получить прогресс достижений
    getProgress() {
        const total = this.list.length;
        const unlocked = this.list.filter(a => a.condition()).length;
        return { unlocked, total, percentage: Math.round((unlocked / total) * 100) };
    }
};
