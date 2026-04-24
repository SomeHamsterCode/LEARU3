// ===== КАСТОМИЗАЦИЯ АВАТАРА =====

const AvatarCustomizer = {
    currentTab: 'hats',
    isInitialized: false, // <--- ДОБАВЛЯЕМ
    
    // Категории для кастомизации
    categories: ['hats', 'glasses', 'pets', 'backgrounds'],
    categoryNames: {
        hats: '🎩 Шляпы',
        glasses: '👓 Очки',
        pets: '🐾 Питомцы',
        backgrounds: '🎨 Фоны'
    },
    
    // Инициализация
     init() {
        this.renderTabs();
        this.renderItems();
        this.updatePreview();
        
        if (!this.isInitialized) { // <--- ПРОВЕРЯЕМ
            this.bindEvents();
            this.isInitialized = true;
        }
    },
    
    // Рендер табов
    renderTabs() {
        const container = document.getElementById('customizer-tabs');
        if (!container) return;
        
        container.innerHTML = this.categories.map(tab => `
            <button class="customizer-tab ${tab === this.currentTab ? 'active' : ''}" data-tab="${tab}">
                ${this.categoryNames[tab]}
            </button>
        `).join('');
    },
    
    // Рендер предметов
    renderItems() {
        const container = document.getElementById('customizer-items');
        if (!container) return;
        
        const items = ShopData.items[this.currentTab] || [];
        const categoryKey = this.getCategoryKey(this.currentTab);
        
        container.innerHTML = items.map(item => {
            const owned = GameState.ownsItem(item.id);
            const equipped = GameState.data.equipped[categoryKey] === item.id;
            
            let previewStyle = '';
            if (item.color) {
                previewStyle = `style="background: ${item.color}; border-radius: 50%; width: 50px; height: 50px; margin: 0 auto;"`;
            }
            
            return `
                <div class="item-card ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}" 
                     data-id="${item.id}" data-price="${item.price}">
                    ${equipped ? '<div class="item-badge">✓</div>' : ''}
                    <div class="item-preview" ${previewStyle}>
                        ${item.color ? '' : item.icon}
                    </div>
                    <div class="item-name">${item.name}</div>
                    <div class="item-price ${owned ? 'owned' : ''}">
                        ${owned ? '✓ Куплено' : `💎 ${item.price}`}
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // Получить ключ категории (hats -> hat)
    getCategoryKey(tab) {
        const mapping = {
            hats: 'hat',
            glasses: 'glasses',
            pets: 'pet',
            backgrounds: 'background'
        };
        return mapping[tab] || tab;
    },
    
    // Обновить превью аватара
    updatePreview() {
        const equipped = GameState.data.equipped;
        
        // Базовый аватар
        const baseEl = document.getElementById('avatar-base');
        if (baseEl) {
            baseEl.textContent = Character.getAvatar(equipped.base);
        }
        
        // Шляпа
        const hatEl = document.getElementById('avatar-hat');
        if (hatEl) {
            const hatItem = ShopData.items.hats.find(i => i.id === equipped.hat);
            hatEl.textContent = hatItem ? hatItem.icon : '';
        }
        
        // Очки
        const glassesEl = document.getElementById('avatar-glasses');
        if (glassesEl) {
            const glassesItem = ShopData.items.glasses.find(i => i.id === equipped.glasses);
            glassesEl.textContent = glassesItem ? glassesItem.icon : '';
        }
        
        // Питомец
        const petEl = document.getElementById('avatar-pet');
        if (petEl) {
            const petItem = ShopData.items.pets.find(i => i.id === equipped.pet);
            petEl.textContent = petItem ? petItem.icon : '';
        }
        
        // Фон
        const bgEl = document.getElementById('avatar-background');
        if (bgEl) {
            const bgItem = ShopData.items.backgrounds.find(i => i.id === equipped.background);
            bgEl.style.background = bgItem ? bgItem.color : 'transparent';
        }
        
        // Имя и уровень
        const nameEl = document.getElementById('avatar-player-name');
        const levelEl = document.getElementById('avatar-level');
        
        if (nameEl) {
            nameEl.textContent = GameState.data.character.name || 'Игрок';
        }
        if (levelEl) {
            levelEl.textContent = GameState.data.level;
        }
    },
    
    // Привязка событий
    bindEvents() {
        // Переключение табов
        const tabsContainer = document.getElementById('customizer-tabs');
        if (tabsContainer) {
            tabsContainer.addEventListener('click', (e) => {
                const tab = e.target.closest('.customizer-tab');
                if (tab) {
                    this.currentTab = tab.dataset.tab;
                    this.renderTabs();
                    this.renderItems();
                }
            });
        }
        
        // Клик по предметам
        const itemsContainer = document.getElementById('customizer-items');
        if (itemsContainer) {
            itemsContainer.addEventListener('click', (e) => {
                const card = e.target.closest('.item-card');
                if (card) {
                    this.handleItemClick(card.dataset.id, parseInt(card.dataset.price));
                }
            });
        }
        
        // Кнопка сброса
        const resetBtn = document.getElementById('reset-avatar');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetAvatar());
        }
    },
    
    // Обработка клика по предмету
    handleItemClick(itemId, price) {
        const categoryKey = this.getCategoryKey(this.currentTab);
        
        if (GameState.ownsItem(itemId)) {
            // Уже куплен — экипировать/снять
            if (GameState.data.equipped[categoryKey] === itemId) {
                // Снять
                GameState.data.equipped[categoryKey] = null;
                App.showNotification('Предмет снят', 'success');
            } else {
                // Надеть
                GameState.data.equipped[categoryKey] = itemId;
                App.showNotification('Предмет надет! ✨', 'success');
            }
            GameState.save();
        } else {
            // Не куплен — попытка покупки
            if (GameState.data.points >= price) {
                if (GameState.buyItem(itemId, price)) {
                    // Сразу надеваем
                    GameState.data.equipped[categoryKey] = itemId;
                    GameState.save();
                    App.showNotification('🎉 Покупка успешна!', 'success');
                    App.updateUI();
                }
            } else {
                App.showNotification('💎 Недостаточно кристаллов!', 'error');
            }
        }
        
        this.updatePreview();
        this.renderItems();
    },
    
    // Сброс аватара
    resetAvatar() {
        GameState.data.equipped = {
            base: GameState.data.character.avatar || 0,
            hat: null,
            glasses: null,
            pet: null,
            background: null
        };
        GameState.save();
        
        this.updatePreview();
        this.renderItems();
        App.showNotification('Аватар сброшен! 🔄', 'success');
    }
};
