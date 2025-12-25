// ===== УРОК =====

const Lesson = {
    currentType: null,
    tasks: [],
    currentIndex: 0,
    score: 0,
    answers: [],
    
    // Начало урока
    start(type, tasks) {
        this.currentType = type;
        this.tasks = tasks;
        this.currentIndex = 0;
        this.score = 0;
        this.answers = [];
        
        // Показываем модальное окно
        document.getElementById('lesson-modal').classList.remove('hidden');
        
        // Рендерим первое задание
        this.renderTask();
    },
    
    // Рендер задания
    renderTask() {
        const task = this.tasks[this.currentIndex];
        const body = document.getElementById('lesson-body');
        const progressFill = document.getElementById('lesson-progress-fill');
        const progressText = document.getElementById('lesson-progress-text');
        
        // Обновляем прогресс
        const progress = (this.currentIndex / this.tasks.length) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${this.currentIndex + 1} / ${this.tasks.length}`;
        
        // Формируем HTML задания
        let html = `
            <div class="task-container">
                <div class="task-type">Задание ${task.type}: ${task.typeName}</div>
                <div class="task-question">${task.question}</div>
                <div class="task-text">${this.formatTaskText(task.text)}</div>
        `;
        
        // Варианты ответа или текстовый ввод
        if (task.options) {
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
        
        // Привязываем события
        this.bindTaskEvents();
        
        // Сбрасываем кнопку проверки
        const checkBtn = document.getElementById('btn-check');
        checkBtn.disabled = true;
        checkBtn.textContent = 'Проверить';
    },
    
    // Форматирование текста задания
    formatTaskText(text) {
        return text
            .replace(/\n/g, '<br>')
            .replace(/\((\d+)\)/g, '<span class="highlight">($1)</span>');
    },
    
    // Привязка событий для задания
    bindTaskEvents() {
        const task = this.tasks[this.currentIndex];
        const checkBtn = document.getElementById('btn-check');
        
        if (task.options) {
            // Множественный выбор
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
            // Текстовый ввод
            const input = document.getElementById('answer-input');
            
            input.addEventListener('input', () => {
                checkBtn.disabled = input.value.trim() === '';
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && input.value.trim()) {
                    this.checkAnswer(input.value.trim().toLowerCase());
                }
            });
            
            // Фокус на поле ввода
            setTimeout(() => input.focus(), 100);
            
            checkBtn.onclick = () => this.checkAnswer(input.value.trim().toLowerCase());
        }
        
        // Кнопка пропуска
        document.getElementById('btn-skip').onclick = () => this.skipTask();
        
        // Кнопка закрытия
        document.getElementById('lesson-close').onclick = () => this.close();
    },
    
    // Проверка ответа
    checkAnswer(userAnswer) {
        const task = this.tasks[this.currentIndex];
        let isCorrect = false;
        
        if (Array.isArray(task.correct)) {
            // Множественный выбор — сравниваем множества
            const correctSet = new Set(task.correct);
            const userSet = new Set(userAnswer);
            isCorrect = correctSet.size === userSet.size && 
                        [...correctSet].every(v => userSet.has(v));
        } else {
            // Текстовый ответ — нормализуем и сравниваем
            const normalizedCorrect = task.correct.toLowerCase().replace(/\s+/g, '');
            const normalizedUser = userAnswer.toLowerCase().replace(/\s+/g, '');
            isCorrect = normalizedCorrect === normalizedUser;
        }
        
        // Сохраняем ответ
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
    
    // Показать обратную связь
    showFeedback(isCorrect, explanation, correctAnswer = null) {
        const body = document.getElementById('lesson-body');
        const taskContainer = body.querySelector('.task-container');
        const task = this.tasks[this.currentIndex];
        
        // Отмечаем варианты
        if (task.options) {
            const options = body.querySelectorAll('.option-item');
            const correct = task.correct;
            
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
        
        // Сообщение от Леа
        const leaMessage = isCorrect 
            ? Mascot.getRandomPhrase('correct') 
            : Mascot.getRandomPhrase('incorrect');
        
        // Добавляем блок обратной связи
        const feedback = document.createElement('div');
        feedback.className = `feedback-container ${isCorrect ? 'correct' : 'incorrect'}`;
        feedback.innerHTML = `
            <div class="feedback-title">
                ${isCorrect ? '✅' : '❌'} ${leaMessage}
            </div>
            <div class="feedback-text">
                ${!isCorrect && correctAnswer ? `
                    <p><strong>Правильный ответ:</strong> ${Array.isArray(correctAnswer) ? correctAnswer.join(', ') : correctAnswer}</p>
                ` : ''}
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
    
    // Пропустить задание
    skipTask() {
        this.answers.push({ 
            task: this.tasks[this.currentIndex], 
            userAnswer: null, 
            isCorrect: false 
        });
        
        GameState.loseHeart();
        App.updateUI();
        this.nextTask();
    },
    
    // Следующее задание
    nextTask() {
        this.currentIndex++;
        
        if (this.currentIndex >= this.tasks.length) {
            this.finish();
        } else {
            this.renderTask();
        }
    },
    
    // Завершение урока
    finish() {
        // Скрываем модальное окно урока
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
    
    // Показать результат
    showResult(isPerfect, unitResult) {
        const modal = document.getElementById('result-modal');
        const icon = document.getElementById('result-icon');
        const title = document.getElementById('result-title');
        const message = document.getElementById('result-message');
        const stats = document.getElementById('result-stats');
        
        const total = this.tasks.length;
        const percentage = Math.round((this.score / total) * 100);
        
        // Определяем результат
        if (isPerfect) {
            icon.textContent = '🏆';
            title.textContent = 'Идеально!';
            message.textContent = '🐆 Леа: "Рррр! Ты просто великолепен! Я горжусь тобой!"';
            Utils.fireConfetti();
        } else if (percentage >= 80) {
            icon.textContent = '🎉';
            title.textContent = 'Отлично!';
            message.textContent = '🐆 Леа: "Прекрасный результат! Так держать!"';
        } else if (percentage >= 60) {
            icon.textContent = '👍';
            title.textContent = 'Хорошо!';
            message.textContent = '🐆 Леа: "Неплохо! Но я знаю, что ты можешь лучше!"';
        } else {
            icon.textContent = '📚';
            title.textContent = 'Нужна практика';
            message.textContent = '🐆 Леа: "Не расстраивайся! Давай повторим теорию вместе!"';
        }
        
        // Бонусный опыт за идеальный урок
        let bonusXP = 0;
        if (isPerfect) {
            bonusXP = 50;
            GameState.addExp(bonusXP);
        }
        
        // Статистика
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
                <div class="result-stat-label">Кристаллов</div>
            </div>
        `;
        
        // Показываем модальное окно
        modal.classList.remove('hidden');
        
        // Привязываем кнопки
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
    
    // Закрыть урок
    close() {
        if (confirm('Выйти из урока? Прогресс будет потерян.')) {
            document.getElementById('lesson-modal').classList.add('hidden');
        }
    }
};
