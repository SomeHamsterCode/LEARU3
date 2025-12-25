// ===== СОСТОЯНИЕ ИГРЫ =====

const GameState = {
    // Данные по умолчанию
    defaultData: {
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
        points: 100, // Стартовые кристаллы
        
        // Серия и время
        streak: 0,
        lastPlayedDate: null,
        
        // Здоровье
        hearts: 5,
        maxHearts: 5,
        heartsRegenTime: null,
        
        // Статистика
        stats: {
            totalAnswers: 0,
            correctAnswers: 0,
            lessonsCompleted: 0,
            perfectLessons: 0
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
        
        // Кастомизация аватара
        equipped: {
            base: 0,
            hat: null,
            glasses: null,
            pet: null,
            background: null
        },
        
        // Купленные предметы
        ownedItems: ['base_0'],
        
        // Инвентарь расходуемых
        inventory: {
            hints: 0,
            streakFreezes: 0,
            doubleXp: false
        }
    },

    data: null,

    // Инициализация
    init() {
        const saved = Utils.loadFromStorage('egeQuest');
        
        if (saved) {
            // Мержим сохранённые данные с дефолтными (на случай новых полей)
            this.data = this.mergeDeep(this.defaultData, saved);
            this.checkStreak();
            this.regenerateHearts();
        } else {
            this.data = JSON.parse(JSON.stringify(this.defaultData));
        }
        
        return this.data.character.name !== '';
    },

    // Глубокое слияние объектов
    mergeDeep(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.mergeDeep(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
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
            return;
        }
        
        const lastDate = new Date(lastPlayed).toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate !== today && lastDate !== yesterday.toDateString()) {
            // Пропустили больше одного дня — сброс серии
            if (this.data.inventory.streakFreezes > 0) {
                this.data.inventory.streakFreezes--;
                App.showNotification('🧊 Использована заморозка серии!', 'warning');
            } else {
                this.data.streak = 0;
            }
            this.save();
        }
    },

    // Восстановление сердец
    regenerateHearts() {
        if (this.data.hearts >= this.data.maxHearts) {
            this.data.heartsRegenTime = null;
            return;
        }
        
        if (this.data.heartsRegenTime) {
            const now = Date.now();
            const elapsed = now - this.data.heartsRegenTime;
            const heartsToRegen = Math.floor(elapsed / (30 * 60 * 1000)); // 30 минут на сердце
            
            if (heartsToRegen > 0) {
                this.data.hearts = Math.min(
                    this.data.maxHearts,
                    this.data.hearts + heartsToRegen
                );
                
                if (this.data.hearts >= this.data.maxHearts) {
                    this.data.heartsRegenTime = null;
                } else {
                    this.data.heartsRegenTime = now;
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
        this.data.equipped.base = avatar;
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
        // Проверяем двойной XP
        if (this.data.inventory.doubleXp) {
            amount *= 2;
            this.data.inventory.doubleXp = false;
        }
        
        this.data.exp += amount;
        
        // Проверка уровня
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
                App.showNotification('💔 Сердца закончились! Подожди 30 минут или купи в магазине.', 'error');
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
        this.data.hearts = this.data.maxHearts;
        this.data.heartsRegenTime = null;
        this.save();
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
                App.showNotification(`🔓 Разблокировано: Задание ${nextUnit}!`, 'success');
            }
        }
        
        this.save();
        return { stars, completed: unit.completed };
    },

    // Обновление статистики
    updateStats(unitId, correct, total) {
        this.data.stats.totalAnswers += total;
        this.data.stats.correctAnswers += correct;
        
        // Обновляем дату и серию
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
    },

    // Покупка предмета
    buyItem(itemId, price) {
        if (this.data.points >= price && !this.data.ownedItems.includes(itemId)) {
            this.data.points -= price;
            this.data.ownedItems.push(itemId);
            this.save();
            return true;
        }
        return false;
    },

    // Экипировка предмета
    equipItem(category, itemId) {
        this.data.equipped[category] = itemId;
        this.save();
    },

    // Проверка владения предметом
    ownsItem(itemId) {
        return this.data.ownedItems.includes(itemId);
    },

    // Сброс данных (для отладки)
    reset() {
        this.data = JSON.parse(JSON.stringify(this.defaultData));
        this.save();
        location.reload();
    }
};
