// ===== УРОК =====

const Lesson = {
    currentType: null,
    tasks: [],
    currentIndex: 0,
    score: 0,
    answers: [],
    
    start(type, tasks) {
        this.currentType = type;
        this.tasks = tasks;
        this.currentIndex = 0;
        this.score = 0;
        this.answers = [];
        
        document.getElementById('lesson-modal').classList.remove('hidden');
        this.renderTask();
    },
    
    renderTask() {
        const task = this.tasks[this.currentIndex];
        const body = document.getElementById('lesson-body');
        const progressFill = document.getElementById('lesson-progress-fill');
        const progressText = document.getElementById('lesson-progress-text');
        
        // Обновляем прогресс
        const progress = ((this.currentIndex) / this.tasks.length) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${this.currentIndex + 1} / ${this.tasks.length}`;
        
        // Рендерим задание
        let html = `
            <div class="task-container">
                <div class="task-type">Задание ${task.type}: ${task.typeName}</div>
                <div class="task-question">${task.question}</div>
                <div class="task-text">${this.formatText(task.text)}</div>
        `;
        
        if (task.options) {
            // Варианты ответа
            html += '<div class="options-container">';
            task.options.forEach((option, i) => {
                html += `
                    <div class="option-item" data-value="${option}">
                        <div class="option-marker">${i + 1}</div>
                        <div class="option-text">${option}</div>
                    </div>
                `;
            });
            html += '</div>';
        } else if (task.inputType === 'text') {
            // Текстовый ввод
            html += `
                <div class="answer-input-container">
                    <input type="text" class="answer-input" id="answer-input" 
                           placeholder="Введите ответ" autocomplete="off">
                    <div class="answer-hint">Введите ответ строчными буквами без пробелов</div>
                </div>
            `;
        }
        
        html += '</div>';
        body.innerHTML = html;
        
        this.bindTaskEvents();
        
        // Сбрасываем кнопку проверки
        const checkBtn = document.getElementById('btn-check');
        checkBtn.disabled = true;
        checkBtn.textContent = 'Проверить';
    },
    
    formatText(text) {
        // Форматирование текста задания
        return text
            .replace(/\n/g, '<br>')
            .replace(/\((\d+)\)/g, '<span class="highlight">($1)</span>');
    },
    
    bindTaskEvents() {
        const task = this.tasks[this.currentIndex];
        const checkBtn = document.getElementById('btn-check');
        
        if (task.options) {
            // Обработка клика по вариантам
            const options = document.querySelectorAll('.option-item');
            const selectedValues = new Set();
            
            options.forEach(option => {
                option.addEventListener('click', () => {
                    const value = option.dataset.value;
                    
                    if (selectedValues.has(value)) {
                        selectedValues.delete(value);
                        option.classList.remove('selected');
                    } else {
                        selectedValues.add(value);
                        option.classList.add('selected');
                    }
                    
                    checkBtn.disabled = selectedValues.size === 0;
                });
            });
            
            checkBtn.onclick = () => this.checkAnswer([...selectedValues]);
        } else if (task.inputType === 'text') {
            // Обработка текстового ввода
            const input = document.getElementById('answer-input');
            
            input.addEventListener('input', () => {
                checkBtn.disabled = input.value.trim() === '';
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && input.value.trim()) {
                    this.checkAnswer(input.value.trim().toLowerCase());
                }
            });
            
            input.focus();
            
            checkBtn.onclick = () => this.checkAnswer(input.value.trim().toLowerCase());
        }
        
        // Кнопка пропуска
        document.getElementById('btn-skip').onclick = () => this.skipTask();
        
        // Кнопка закрытия
        document.getElementById('lesson-close').onclick = () => this.close();
    },
    
    checkAnswer(userAnswer) {
        const task = this.tasks[this.currentIndex];
        let isCorrect = false;
        
        if (Array.isArray(task.correct)) {
            // Множественный выбор
            const correctSet = new Set(task.correct);
            const userSet = new Set(userAnswer);
            isCorrect = correctSet.size === userSet.size && 
                        [...correctSet].every(v => userSet.has(v));
        } else {
            // Текстовый ответ
            const normalizedCorrect = task.correct.toLowerCase().replace(/\s+/g, '');
            const normalizedUser = userAnswer.toLowerCase().replace(/\s+/g, '');
            isCorrect = normalizedCorrect === normalizedUser;
        }
        
        this.answers.push({ task, userAnswer, isCorrect });
        
        if (isCorrect) {
            this.score++;
            this.showFeedback(true, task.explanation);
            GameState.addExp(20);
            GameState.addPoints(10);
        } else {
            this.showFeedback(false, task.explanation, task.correct);
            GameState.loseHeart();
        }
        
        App.updateUI();
    },
    
    showFeedback(isCorrect, explanation, correctAnswer = null) {
        const body = document.getElementById('lesson-body');
        const taskContainer = body.querySelector('.task-container');
        
        // Отмечаем варианты
        if (this.tasks[this.currentIndex].options) {
            const options = body.querySelectorAll('.option-item');
            const correct = this.tasks[this.currentIndex].correct;
            
            options.forEach(option => {
                const value = option.dataset.value;
                if (correct.includes(value)) {
                    option.classList.add('correct');
                } else if (option.classList.contains('selected')) {
                    option.classList.add('incorrect');
                }
                option.style.pointerEvents = 'none';
            });
        } else {
            const input = document.getElementById('answer-input');
            if (input) {
                input.classList.add(isCorrect ? 'correct' : 'incorrect');
                input.disabled = true;
            }
        }
        
        // Добавляем обратную связь
        const feedback = document.createElement('div');
        feedback.className = `feedback-container ${isCorrect ? 'correct' : 'incorrect'}`;
        feedback.innerHTML = `
            <div class="feedback-title">
                ${isCorrect ? '✅ Правильно!' : '❌ Неправильно'}
            </div>
            <div class="feedback-text">
                ${!isCorrect && correctAnswer ? `<p><strong>Правильный ответ:</strong> ${Array.isArray(correctAnswer) ? correctAnswer.join(', ') : correctAnswer}</p>` : ''}
                <p>${explanation}</p>
            </div>
        `;
        taskContainer.appendChild(feedback);
        
        // Меняем кнопку
        const checkBtn = document.getElementById('btn-check');
        checkBtn.textContent = 'Далее';
        checkBtn.disabled = false;
        checkBtn.onclick = () => this.nextTask();
        
        // Анимация
        if (isCorrect) {
            taskContainer.classList.add('correct-pop');
        } else {
            taskContainer.classList.add('incorrect-shake');
        }
    },
    
    skipTask() {
        this.answers.push({ task: this.tasks[this.currentIndex], userAnswer: null, isCorrect: false });
        GameState.loseHeart();
        App.updateUI();
        this.nextTask();
    },
    
    nextTask() {
        this.currentIndex++;
        
        if (this.currentIndex >= this.tasks.length) {
            this.finish();
        } else {
            this.renderTask();
        }
    },
    
    finish() {
        document.getElementById('lesson-modal').classList.add('hidden');
        
        const total = this.tasks.length;
        const isPerfect = this.score === total;
        
                // Обновляем статистику
        GameState.updateStats(this.currentType, this.score, total);
        GameState.completeLesson(isPerfect);
        
        // Обновляем прогресс юнита
        const result = GameState.updateUnitProgress(this.currentType, this.score, total);
        
        // Показываем результат
        this.showResult(isPerfect, result);
        
        // Проверяем достижения
        Achievements.check();
    },
    
    showResult(isPerfect, unitResult) {
        const modal = document.getElementById('result-modal');
        const icon = document.getElementById('result-icon');
        const title = document.getElementById('result-title');
        const message = document.getElementById('result-message');
        const stats = document.getElementById('result-stats');
        
        const total = this.tasks.length;
        const percentage = Math.round((this.score / total) * 100);
        
        if (isPerfect) {
            icon.textContent = '🏆';
            title.textContent = 'Идеально!';
            message.textContent = 'Вы ответили на все вопросы правильно!';
            Utils.fireConfetti();
        } else if (percentage >= 80) {
            icon.textContent = '🎉';
            title.textContent = 'Отлично!';
            message.textContent = 'Вы отлично справились с заданиями!';
        } else if (percentage >= 60) {
            icon.textContent = '👍';
            title.textContent = 'Хорошо!';
            message.textContent = 'Неплохой результат, но есть куда расти!';
        } else {
            icon.textContent = '📚';
            title.textContent = 'Нужна практика';
            message.textContent = 'Повторите материал и попробуйте снова!';
        }
        
        // Бонусный опыт за идеальный урок
        let bonusXP = 0;
        if (isPerfect) {
            bonusXP = 50;
            GameState.addExp(bonusXP);
        }
        
        stats.innerHTML = `
            <div class="result-stat">
                <div class="result-stat-value">${this.score}/${total}</div>
                <div class="result-stat-label">Правильных</div>
            </div>
            <div class="result-stat">
                <div class="result-stat-value">+${this.score * 20 + bonusXP}</div>
                <div class="result-stat-label">Опыта</div>
            </div>
            <div class="result-stat">
                <div class="result-stat-value">+${this.score * 10}</div>
                <div class="result-stat-label">Очков</div>
            </div>
        `;
        
        modal.classList.remove('hidden');
        
        // Кнопки
        document.getElementById('btn-retry').onclick = () => {
            modal.classList.add('hidden');
            const tasks = getRandomTasks(this.currentType, 5);
            this.start(this.currentType, tasks);
        };
        
        document.getElementById('btn-continue').onclick = () => {
            modal.classList.add('hidden');
            Roadmap.render();
            App.updateUI();
        };
    },
    
    close() {
        if (confirm('Вы уверены, что хотите выйти? Прогресс урока будет потерян.')) {
            document.getElementById('lesson-modal').classList.add('hidden');
        }
    }
};

// ===== ОСНОВНОЕ ПРИЛОЖЕНИЕ =====

const App = {
    currentPage: 'roadmap',
    
    async init() {
        // Показываем загрузку
        await Utils.delay(1500);
        
        // Скрываем загрузку
        document.getElementById('loading-screen').classList.add('hidden');
        
        // Проверяем, есть ли сохранённый персонаж
        const hasCharacter = GameState.init();
        
        if (hasCharacter) {
            this.showMainScreen();
        } else {
            this.showCharacterCreation();
        }
    },
    
    showCharacterCreation() {
        document.getElementById('character-creation').classList.remove('hidden');
        Character.init();
    },
    
    showMainScreen() {
        document.getElementById('character-creation').classList.add('hidden');
        document.getElementById('main-screen').classList.remove('hidden');
        
        this.updateUI();
        this.bindNavigation();
        Roadmap.init();
    },
    
    bindNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                this.navigateTo(page);
            });
        });
    },
    
    navigateTo(page) {
        // Обновляем активный пункт меню
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
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
            case 'stats':
                Stats.render();
                break;
            case 'shop':
                Shop.render();
                break;
            case 'achievements':
                Achievements.render();
                break;
        }
        
        this.currentPage = page;
    },
    
    updateUI() {
        const state = GameState.data;
        
        // Обновляем сердца
        this.updateHearts();
        
        // Обновляем очки
        const pointsDisplay = document.getElementById('points-display');
        if (pointsDisplay) {
            Utils.animateNumber(pointsDisplay, parseInt(pointsDisplay.textContent) || 0, state.points, 500);
        }
        
        // Обновляем серию
        const streakCount = document.getElementById('streak-count');
        if (streakCount) {
            streakCount.textContent = state.streak;
        }
        
        // Обновляем опыт
        const expFill = document.getElementById('exp-fill');
        const expText = document.getElementById('exp-text');
        if (expFill && expText) {
            const percentage = (state.exp / state.expToNextLevel) * 100;
            expFill.style.width = `${percentage}%`;
            expText.textContent = `${state.exp} / ${state.expToNextLevel} XP`;
        }
        
        // Обновляем уровень
        const headerLevel = document.getElementById('header-level');
        if (headerLevel) {
            headerLevel.textContent = state.level;
        }
        
        // Обновляем аватар
        const headerAvatar = document.getElementById('header-avatar');
        if (headerAvatar && Character.avatars[state.character.avatar]) {
            headerAvatar.textContent = Character.avatars[state.character.avatar];
        }
    },
    
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
    
    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        
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

// Обработка закрытия страницы
window.addEventListener('beforeunload', () => {
    GameState.save();
});

// Восстановление сердец каждую минуту
setInterval(() => {
    GameState.regenerateHearts();
    App.updateHearts();
}, 60000);
