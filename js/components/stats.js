// ===== СТАТИСТИКА =====

const Stats = {
    // Рендер страницы статистики
    render() {
        this.renderStatsGrid();
    },
    
    // Рендер сетки статистики
    renderStatsGrid() {
        const grid = document.getElementById('stats-grid');
        if (!grid) return;
        
        const stats = GameState.data.stats;
        const accuracy = stats.totalAnswers > 0 
            ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100) 
            : 0;
        
        const statsData = [
            { 
                icon: '📚', 
                value: stats.lessonsCompleted, 
                label: 'Уроков пройдено' 
            },
            { 
                icon: '✅', 
                value: stats.correctAnswers, 
                label: 'Правильных ответов' 
            },
            { 
                icon: '📊', 
                value: `${accuracy}%`, 
                label: 'Точность' 
            },
            { 
                icon: '🔥', 
                value: GameState.data.streak, 
                label: Utils.pluralize(GameState.data.streak, ['день подряд', 'дня подряд', 'дней подряд'])
            },
            { 
                icon: '⭐', 
                value: stats.perfectLessons, 
                label: 'Идеальных уроков' 
            },
            { 
                icon: '💎', 
                value: GameState.data.points, 
                label: 'Кристаллов' 
            },
            { 
                icon: '🎯', 
                value: GameState.data.level, 
                label: 'Уровень' 
            },
            { 
                icon: '🏆', 
                value: Object.keys(GameState.data.achievements).length, 
                label: 'Достижений' 
            }
        ];
        
        grid.innerHTML = statsData.map(stat => `
            <div class="stat-card">
                <div class="stat-icon">${stat.icon}</div>
                <div class="stat-value">${stat.value}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `).join('');
    },
    
    // Получить процент прохождения
    getCompletionPercentage() {
        const types = getTaskTypes();
        const completed = types.filter(t => 
            GameState.data.unitProgress[t.id]?.completed
        ).length;
        return Math.round((completed / types.length) * 100);
    },
    
    // Получить общее количество звёзд
    getTotalStars() {
        let total = 0;
        for (const unitId in GameState.data.unitProgress) {
            total += GameState.data.unitProgress[unitId].stars || 0;
        }
        return total;
    }
};
