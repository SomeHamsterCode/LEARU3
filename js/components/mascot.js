// ===== МАСКОТ ДОСТОЙНЫЙ =====

const Mascot = {
    name: 'Достойный',
    emoji: '🦁',
    isInitialized: false, // <--- ДОБАВЛЯЕМ ФЛАГ ЗДЕСЬ
    
    // Фразы для разных ситуаций
    phrases: {
        greeting: [
            'Привет! Я Достойный, твой наставник! 🦁',
            'Рад тебя видеть! Готов покорять русский язык? 📚',
            'Рррр! Приветствую, будущий стобалльник! 🦁✨',
            'Привет, чемпион! Сегодня станем ещё сильнее!',
            'Здравствуй! Достойный к вашим услугам! 🦁👑'
        ],
        correct: [
            'Отлично! Достойный ответ! 🎉',
            'Правильно! Я в тебе не сомневался! 💪',
            'Рррр! Великолепно! Так держать! 🦁✨',
            'Блестяще! Ты достоин похвалы!',
            'Мощно! Настоящий лев знаний! 🦁🌟',
            'Браво! Это было достойно! 👑'
        ],
        incorrect: [
            'Не расстраивайся! Лев не сдаётся! 💪',
            'Ошибки закаляют! Попробуем ещё раз! 📚',
            'Давай разберём это вместе! 🦁',
            'Не переживай, даже львы учатся! 🦁📖',
            'Каждая ошибка делает тебя сильнее! 💫',
            'Настоящий воин не боится трудностей! ⚔️'
        ],
        encouragement: [
            'Ты справишься! Я верю в тебя! 💫',
            'Помни: львы не отступают! 🦁💪',
            'Каждый шаг приближает к победе! 🏆',
            'Ты уже многого достиг! Продолжай! 🌟',
            'Вместе мы непобедимы! 🦁⚔️',
            'Будь достоин своей мечты! 👑'
        ],
        streak: [
            'Рррр! {count} дней подряд! Ты — настоящий лев! 🦁🔥',
            '{count} дней серии! Достойный результат! 🌟',
            '{count} дней! Твоя сила растёт! 🦁💪'
        ],
        levelUp: [
            'Поздравляю с уровнем {level}! Ты становишься сильнее! 🎉',
            'Уровень {level}! Достойный рост! 🦁🌟',
            'Рррр! Уровень {level}! Лев знаний! 🦁👑'
        ]
    },
    
    // Получить случайную фразу
    getRandomPhrase(type, replacements = {}) {
        const phrases = this.phrases[type];
        if (!phrases || phrases.length === 0) return '';
        
        let phrase = phrases[Math.floor(Math.random() * phrases.length)];
        
        for (const [key, value] of Object.entries(replacements)) {
            phrase = phrase.replace(`{${key}}`, value);
        }
        
        return phrase;
    },
    
    // Инициализация страницы маскота
      init() {
        this.renderTopics();
        
        // Привязываем события ТОЛЬКО один раз
        if (!this.isInitialized) {
            this.bindEvents();
            this.isInitialized = true; // Запоминаем, что события уже висят
        }
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
        
        this.addMessage(message, 'user');
        input.value = '';
        
        // Ответ Достойного
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
                <div class="message-avatar">🦁</div>
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
        if (lower.includes('привет') || lower.includes('здравствуй') || lower.includes('хай') || lower.includes('ку') || lower.includes('здарова')) {
            return this.getRandomPhrase('greeting');
        }
        
        // Кто ты
        if (lower.includes('кто ты') || lower.includes('как тебя зовут') || lower.includes('ты кто')) {
            return 'Я — Достойный! 🦁 Лев-наставник, который поможет тебе достойно сдать ЕГЭ по русскому языку! Выбирай тему — и вперёд к знаниям! 👑📚';
        }
        
        // Просьба о помощи
        if (lower.includes('помо') || lower.includes('не понимаю') || lower.includes('сложно') || lower.includes('трудно') || lower.includes('не могу')) {
            return 'Лев не отступает перед трудностями! 🦁 Выбери тему из кнопок выше, и я объясню всё подробно. Вместе мы обязательно разберёмся! 💪';
        }
        
        // Благодарность
        if (lower.includes('спасибо') || lower.includes('благодар')) {
            return 'Рррр! Всегда рад помочь! 🦁 Помни — ты достоин лучшего результата! Обращайся, если будут вопросы! 👑';
        }
        
        // Похвала
        if (lower.includes('молодец') || lower.includes('умни') || lower.includes('класс') || lower.includes('крут')) {
            return 'Спасибо! 🦁 Но настоящий герой здесь — ты! Продолжай в том же духе, и ЕГЭ сдашь достойно! 👑✨';
        }
        
        // Вопросы по темам
        if (lower.includes('корн') || lower.includes('задание 9') || lower.includes('чередующ') || lower.includes('безударн')) {
            this.showTheory(9);
            return 'Отличный выбор! 🦁 Корни — фундамент грамотности! Смотри теорию выше! ⬆️';
        }
        
        if (lower.includes('приставк') || lower.includes('задание 10') || lower.includes('пре') || lower.includes('при')) {
            this.showTheory(10);
            return 'Приставки — достойная тема! 🦁 Смотри правила выше! ⬆️';
        }
        
        if (lower.includes('суффикс') || lower.includes('задание 11')) {
            this.showTheory(11);
            return 'Суффиксы бывают коварными, но лев справится! 🦁 Изучай! ⬆️';
        }
        
        if (lower.includes('глагол') || lower.includes('спряжен') || lower.includes('задание 12') || lower.includes('причаст')) {
            this.showTheory(12);
            return 'Спряжение — важная тема! 🦁 Разберёмся вместе! ⬆️';
        }
        
        if (lower.includes('не ') || lower.includes(' ни') || lower.includes('задание 13') || lower.includes('слитно не')) {
            this.showTheory(13);
            return 'НЕ и НИ — частые ловушки на ЕГЭ! 🦁 Вот правила! ⬆️';
        }
        
        if (lower.includes('слитно') || lower.includes('раздельно') || lower.includes('дефис') || lower.includes('задание 14')) {
            this.showTheory(14);
            return 'Разберёмся с правописанием как достойные знатоки! 🦁📚 ⬆️';
        }
        
        if (lower.includes(' н ') || lower.includes(' нн') || lower.includes('задание 15') || lower.includes('одна н') || lower.includes('две н')) {
            this.showTheory(15);
            return 'Н и НН — королевская тема! 🦁👑 Смотри правила! ⬆️';
        }
        
        // ЕГЭ и экзамены
        if (lower.includes('егэ') || lower.includes('экзамен') || lower.includes('сдать') || lower.includes('балл')) {
            return 'Ты сдашь ЕГЭ достойно! 🦁👑 С моей помощью ты будешь готов на все 100! Выбери тему и начнём! 💪📚';
        }
        
        // Мотивация
        if (lower.includes('устал') || lower.includes('надоел') || lower.includes('не хочу') || lower.includes('лень')) {
            return this.getRandomPhrase('encouragement') + ' Сделай перерыв, отдохни, а потом вернёмся с новыми силами! 🦁☕';
        }
        
        // Шутки и неформальное
        if (lower.includes('шутк') || lower.includes('смешн') || lower.includes('анекдот')) {
            return 'Знаешь, почему лев всегда сдаёт ЕГЭ на 100 баллов? Потому что он — Достойный! 🦁😄 А теперь к учёбе! 📚';
        }
        
        // Достойный
        if (lower.includes('достойн')) {
            return 'Рррр! Ты позвал? 🦁 Я здесь, чтобы помочь тебе стать достойным знатоком русского языка! Выбирай тему! 👑';
        }
        
        // Лев
        if (lower.includes('лев') || lower.includes('львин') || lower.includes('рррр') || lower.includes('рычи')) {
            return 'РРРРРР! 🦁🔥 Лев знаний к вашим услугам! Спрашивай о любом задании 9-15, я всё объясню! 👑📚';
        }
        
        // Общий ответ
        return 'Интересный вопрос! 🤔 Выбери тему из кнопок выше, и я расскажу всю теорию. Или спроси конкретно про задания 9-15! 🦁📚 Будь достоин знаний! 👑';
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
            <div class="message-avatar">🦁</div>
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
    
    // Подсказка в уроке
    showHint(task) {
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
