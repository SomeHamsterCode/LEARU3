// ===== МАСКОТ ЛЕА =====

const Mascot = {
    name: 'Леа',
    emoji: '🐆',
    
    // Фразы для разных ситуаций
    phrases: {
        greeting: [
            'Привет! Я Леа, твоя помощница! 🐆',
            'Рррр! Рада тебя видеть! Готов к знаниям? 📚',
            'Мяу... то есть, рррр! Давай учиться! 🐆✨',
            'Привет, чемпион! Сегодня покорим русский язык!'
        ],
        correct: [
            'Отлично! Ты молодец! 🎉',
            'Правильно! Я в тебе не сомневалась! 💪',
            'Рррр! Так держать! 🐆✨',
            'Великолепно! Продолжай в том же духе!',
            'Блестяще! Ты настоящий знаток! 🌟',
            'Умница! Я горжусь тобой! 💕'
        ],
        incorrect: [
            'Не расстраивайся, попробуем ещё раз! 💪',
            'Ничего страшного! Ошибки — часть обучения 📚',
            'Давай разберём это вместе! 🐆',
            'Не переживай, я помогу тебе разобраться!',
            'Каждая ошибка делает тебя сильнее! 💫'
        ],
        encouragement: [
            'Ты справишься! Я верю в тебя! 💫',
            'Помни: практика делает совершенным! 📖',
            'Каждая ошибка приближает к победе! 🏆',
            'Ты уже многого достиг! Продолжай! 🌟',
            'Вместе мы всё преодолеем! 🐆💪'
        ],
        streak: [
            'Вау! {count} дней подряд! Ты огонь! 🔥',
            '{count} дней серии! Невероятно! 🌟',
            'Рррр! {count} дней! Ты неудержим! 🐆'
        ],
        levelUp: [
            'Поздравляю с уровнем {level}! 🎉',
            'Уровень {level}! Ты растёшь! 🌟',
            'Рррр! Уровень {level}! Так держать! 🐆'
        ]
    },
    
    // Получить случайную фразу
    getRandomPhrase(type, replacements = {}) {
        const phrases = this.phrases[type];
        if (!phrases || phrases.length === 0) return '';
        
        let phrase = phrases[Math.floor(Math.random() * phrases.length)];
        
        // Замена плейсхолдеров
        for (const [key, value] of Object.entries(replacements)) {
            phrase = phrase.replace(`{${key}}`, value);
        }
        
        return phrase;
    },
    
    // Инициализация страницы маскота
    init() {
        this.renderTopics();
        this.bindEvents();
    },
    
    // Рендер кнопок тем
    renderTopics() {
        const container = document.getElementById('chat-topics');
        if (!container) return;
        
        const topics = getTaskTypes();
        container.innerHTML = topics.map(topic => `
            <button class="topic-btn" data-topic="${topic.id}">
                ${topic.icon} Задание ${topic.id}
            </button>
        `).join('');
    },
    
    // Привязка событий
    bindEvents() {
        // Клик по темам
        const topicsContainer = document.getElementById('chat-topics');
        if (topicsContainer) {
            topicsContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.topic-btn');
                if (btn) {
                    // Убираем активный класс у всех
                    document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    const topic = parseInt(btn.dataset.topic);
                    this.showTheory(topic);
                }
            });
        }
        
        // Отправка сообщения
        const sendBtn = document.getElementById('chat-send');
        const chatInput = document.getElementById('chat-input');
        
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
        
        // Плавающий маскот
        const floatingMascot = document.getElementById('floating-mascot');
        if (floatingMascot) {
            floatingMascot.addEventListener('click', () => {
                App.navigateTo('mascot');
            });
        }
    },
    
    // Отправка сообщения пользователем
    sendMessage() {
        const input = document.getElementById('chat-input');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        // Добавляем сообщение пользователя
        this.addMessage(message, 'user');
        input.value = '';
        
        // Генерируем ответ Леа
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage(response, 'mascot');
        }, 500 + Math.random() * 500);
    },
    
    // Добавление сообщения в чат
    addMessage(text, sender) {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        
        const div = document.createElement('div');
        div.className = `chat-message ${sender}`;
        
        if (sender === 'mascot') {
            div.innerHTML = `
                <div class="message-avatar">🐆</div>
                <div class="message-content">${text}</div>
            `;
        } else {
            div.innerHTML = `
                <div class="message-content">${text}</div>
            `;
        }
        
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    },
    
    // Генерация ответа на сообщение
    generateResponse(message) {
        const lower = message.toLowerCase();
        
        // Приветствия
        if (lower.includes('привет') || lower.includes('здравствуй') || lower.includes('хай') || lower.includes('ку')) {
            return this.getRandomPhrase('greeting');
        }
        
        // Просьба о помощи
        if (lower.includes('помо') || lower.includes('не понимаю') || lower.includes('сложно') || lower.includes('трудно')) {
            return 'Не переживай! 🐆 Выбери тему из кнопок выше, и я объясню всё подробно. Вместе мы обязательно разберёмся! 💪';
        }
        
        // Благодарность
        if (lower.includes('спасибо') || lower.includes('благодар')) {
            return 'Рррр! Всегда рада помочь! 🐆💕 Обращайся, если будут вопросы!';
        }
        
        // Похвала
        if (lower.includes('молодец') || lower.includes('умни') || lower.includes('класс')) {
            return 'Ой, спасибо! 🐆✨ Но это ты молодец, что учишься! Продолжай в том же духе!';
        }
        
        // Вопросы по темам
        if (lower.includes('корн') || lower.includes('задание 9') || lower.includes('чередующ')) {
            this.showTheory(9);
            return 'Отличный выбор! Показываю теорию по корням! ⬆️ Читай внимательно!';
        }
        
        if (lower.includes('приставк') || lower.includes('задание 10') || lower.includes('пре') || lower.includes('при')) {
            this.showTheory(10);
            return 'Приставки — это интересно! 🐆 Смотри теорию выше!';
        }
        
        if (lower.includes('суффикс') || lower.includes('задание 11')) {
            this.showTheory(11);
            return 'Суффиксы бывают коварными! 😼 Вот теория для тебя!';
        }
        
        if (lower.includes('глагол') || lower.includes('спряжен') || lower.includes('задание 12') || lower.includes('причаст')) {
            this.showTheory(12);
            return 'Спряжение — важная тема! 📝 Изучай внимательно!';
        }
        
        if (lower.includes('не ') || lower.includes(' ни') || lower.includes('задание 13') || lower.includes('слитно не')) {
            this.showTheory(13);
            return 'НЕ и НИ — частая ошибка на ЕГЭ! 🐆 Вот правила!';
        }
        
        if (lower.includes('слитно') || lower.includes('раздельно') || lower.includes('дефис') || lower.includes('задание 14')) {
            this.showTheory(14);
            return 'Разберёмся со слитным и раздельным написанием! 📚';
        }
        
        if (lower.includes(' н ') || lower.includes(' нн') || lower.includes('задание 15') || lower.includes('одна н') || lower.includes('две н')) {
            this.showTheory(15);
            return 'Н и НН — моя любимая тема! 🐆✨ Смотри правила!';
        }
        
        // ЕГЭ и экзамены
        if (lower.includes('егэ') || lower.includes('экзамен')) {
            return 'Не волнуйся насчёт ЕГЭ! 🐆 С моей помощью ты точно справишься! Выбери тему и начнём готовиться! 💪';
        }
        
        // Мотивация
        if (lower.includes('устал') || lower.includes('надоел') || lower.includes('не хочу')) {
            return this.getRandomPhrase('encouragement') + ' Давай сделаем небольшой перерыв, а потом продолжим! 🐆☕';
        }
        
        // Общий ответ
        return 'Интересный вопрос! 🤔 Выбери тему из кнопок выше, и я расскажу всю теорию. Или спроси что-то конкретное про задания 9-15! 🐆📚';
    },
    
    // Показать теорию по теме
    showTheory(topicId) {
        const theory = MascotTheory[topicId];
        if (!theory) return;
        
        const container = document.getElementById('chat-messages');
        if (!container) return;
        
        const div = document.createElement('div');
        div.className = 'chat-message mascot';
        div.innerHTML = `
            <div class="message-avatar">🐆</div>
            <div class="message-content" style="max-width: 90%;">
                ${theory.content}
            </div>
        `;
        
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        
        // Подсветка выбранной темы
        document.querySelectorAll('.topic-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.topic) === topicId);
        });
    },
    
    // Показать подсказку в уроке
    showHint(task) {
        // Можно добавить систему подсказок
        const hints = {
            9: 'Определи тип гласной: проверяемая, непроверяемая или чередующаяся!',
            10: 'Вспомни правила для ПРЕ-/ПРИ- и приставок на З/С!',
            11: 'Проверь суффикс: -ЧИВ- и -ЛИВ- всегда с И!',
            12: 'Определи спряжение глагола по инфинитиву!',
            13: 'Подумай: можно ли заменить синонимом без НЕ?',
            14: 'Попробуй заменить слово — если смысл сохранился, пиши слитно!',
            15: 'Есть ли приставка, зависимое слово или суффикс -ОВА-?'
        };
        
        return hints[task.type] || 'Внимательно прочитай задание и вспомни правило!';
    }
};
