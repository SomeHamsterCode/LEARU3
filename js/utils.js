// ===== УТИЛИТЫ =====

const Utils = {
    // Задержка (Promise)
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Перемешивание массива
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // Сохранение в localStorage
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Ошибка сохранения:', e);
            return false;
        }
    },

    // Загрузка из localStorage
    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Ошибка загрузки:', e);
            return null;
        }
    },

    // Генерация уникального ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Форматирование даты
    formatDate(date) {
        return new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(date));
    },

    // Склонение слов
    pluralize(number, words) {
        const cases = [2, 0, 1, 1, 1, 2];
        const index = (number % 100 > 4 && number % 100 < 20)
            ? 2
            : cases[Math.min(number % 10, 5)];
        return words[index];
    },

    // Конфетти
    fireConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#DC2626', '#FFFFFF', '#EF4444', '#22C55E', '#F59E0B', '#8B5CF6', '#3B82F6'];

        // Создаём частицы
        for (let i = 0; i < 150; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20 - 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            let activeParticles = 0;
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.5; // Гравитация
                p.rotation += p.rotationSpeed;
                
                if (p.y < canvas.height + 50) {
                    activeParticles++;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation * Math.PI / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                }
            });
            
            if (activeParticles > 0) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };
        
        animate();
    },

    // Анимация числа
    animateNumber(element, start, end, duration = 1000) {
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOut);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    }
};
