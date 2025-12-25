// ===== СОСТОЯНИЕ ИГРЫ =====

const GameState = {
    data: {
        // Персонаж
        character: {
            name: '',
            avatar: 0,
            createdAt: null
        },
        
        // Прогресс
        level: 1,
        exp: 0,
        expToNextLevel: 100,
        points: 0,
        
        // Серия и время
        streak: 0,
        lastPlayedDate: null,
        totalPlayTime: 0,
        
        // Здоровье
        hearts: 5,
        maxHearts: 5,
        heartsRegenTime: null,
        
        // Статистика
        stats: {
            totalAnswers: 0,
            correctAnswers: 0,
            lessonsCompleted: 0,
            perfectLessons: 0,
            tasksCompleted: {
                9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0
            },
            accuracy: {
                9: [], 10: [], 11: [], 12: [], 13: [], 14: [], 15: []
            }
        },
        
        // Прогресс по юнитам
        unitProgress: {
            9: { unlocked: true, completed: false, stars: 0, bestScore: 0 },
            10: { unlocked: false, completed: false, stars: 0, bestScore: 0 },
            11: { unlocked: false, completed: false, stars: 0, bestScore: 0 },
            12: { unlocked: false, completed: false, stars: 0, bestScore: 0 },
            13: { unlocked: false, completed: false, stars: 0, bestScore: 0 },
            14: { unlocked: false, completed: false, stars: 0, bestScore: 0 },
            15: { unlocked: false, completed: false, stars: 0, bestScore: 0 }
        },
        
        // Достижения
        achievements: {},
        
        // Покупки
        inventory: []
    },

    // Инициализация
    init() {
        const saved = Utils.loadFromStorage('egeQuest');
        if (saved) {
            this.data = { ...this.data, ...saved };
            this.checkStreak();
            this.regenerateHearts();
        }
        return this.data.character.name !== '';
    },

    // Сохранение
    save() {
        Utils.saveToStorage('egeQuest', this.data);
    },

    // Проверка серии
    checkStreak() {
        const today = new Date().toDateString();
        const lastPlayed = this.data.lastPlayedDate;
        
        if (!lastPlayed) {
            this.data.streak = 0;
            return;
        }
        
        const lastDate = new Date(lastPlayed).toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate === today) {
            // Уже играли сегодня
            return;
        } else if (lastDate === yesterday.toDateString()) {
            // Играли вчера - продолжаем серию
            // Серия увеличится при первом правильном ответе
        } else {
            // Пропустили день - сброс
            this.data.streak = 0;
        }
        
        this.save();
    },

    // Восстановление сердец
    regenerateHearts() {
        if (this.data.hearts < this.data.maxHearts && this.data.heartsRegenTime) {
            const now = Date.now();
            const regenTime = this.data.heartsRegenTime;
            const elapsed = now - regenTime;
            const heartsToRegen = Math.floor(elapsed / (30 * 60 * 1000)); // 30 минут на сердце
            
            if (heartsToRegen > 0) {
                this.data.hearts = Math.min(
                    this.data.maxHearts,
                    this.data.hearts + heartsToRegen
                );
                
                if (this.data.hearts < this.data.maxHearts) {
                    this.data.heartsRegenTime = now;
                } else {
                    this.data.heartsRegenTime = null;
                }
                
                this.save();
            }
        }
    },

    // Создание персонажа
    createCharacter(name, avatar) {
        this.data.character = {
            name: name,
            avatar: avatar,
            createdAt: new Date().toISOString()
        };
        this.data.lastPlayedDate = new Date().toISOString();
        this.save();
    },

    // Добавление очков
    addPoints(amount) {
        this.data.points += amount;
        this.save();
        return this.data.points;
    },

    // Добавление опыта
    addExp(amount) {
        this.data.exp += amount;
        
        while (this.data.exp >= this.data.expToNextLevel) {
            this.data.exp -= this.data.expToNextLevel;
            this.data.level++;
            this.data.expToNextLevel = Math.floor(this.data.expToNextLevel * 1.2);
            
            // Бонус за уровень
            this.addPoints(50);
            
            App.showNotification(`🎉 Уровень ${this.data.level}!`, 'success');
            Utils.fireConfetti();
        }
        
        this.save();
        return { level: this.data.level, exp: this.data.exp };
    },

    // Потеря сердца
    loseHeart() {
        if (this.data.hearts > 0) {
            this.data.hearts--;
            
            if (this.data.hearts === 0) {
                App.showNotification('💔 Сердца закончились! Подождите 30 минут.', 'error');
            }
            
            if (!this.data.heartsRegenTime) {
                this.data.heartsRegenTime = Date.now();
            }
            
            this.save();
        }
        return this.data.hearts;
    },

    // Восстановление сердец (покупка)
    refillHearts() {
        if (this.data.points >= 50) {
            this.data.points -= 50;
            this.data.hearts = this.data.maxHearts;
            this.data.heartsRegenTime = null;
            this.save();
            return true;
        }
        return false;
    },

    // Обновление прогресса юнита
    updateUnitProgress(unitId, score, totalTasks) {
        const unit = this.data.unitProgress[unitId];
        const percentage = (score / totalTasks) * 100;
        
        // Звёзды
        let stars = 0;
        if (percentage >= 60) stars = 1;
        if (percentage >= 80) stars = 2;
        if (percentage === 100) stars = 3;
        
        if (stars > unit.stars) {
            unit.stars = stars;
        }
        
        if (score > unit.bestScore) {
            unit.bestScore = score;
        }
        
        if (percentage >= 60 && !unit.completed) {
            unit.completed = true;
            
            // Разблокировка следующего юнита
            const nextUnit = unitId + 1;
            if (nextUnit <= 15 && this.data.unitProgress[nextUnit]) {
                this.data.unitProgress[nextUnit].unlocked = true;
            }
        }
        
        this.save();
        return { stars, completed: unit.completed };
    },

    // Обновление статистики
    updateStats(unitId, correct, total) {
        const stats = this.data.stats;
        
        stats.totalAnswers += total;
        stats.correctAnswers += correct;
        stats.tasksCompleted[unitId] += total;
        stats.accuracy[unitId].push(Math.round((correct / total) * 100));
        
        // Обновляем серию
        const today = new Date().toDateString();
        const lastPlayed = this.data.lastPlayedDate 
            ? new Date(this.data.lastPlayedDate).toDateString() 
            : null;
            
        if (lastPlayed !== today) {
            this.data.streak++;
        }
        
        this.data.lastPlayedDate = new Date().toISOString();
        this.save();
    },

    // Завершение урока
    completeLesson(perfect) {
        this.data.stats.lessonsCompleted++;
        if (perfect) {
            this.data.stats.perfectLessons++;
        }
        this.save();
    }
};
