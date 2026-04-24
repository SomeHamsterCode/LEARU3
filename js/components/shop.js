// ===== МАГАЗИН =====

const Shop = {
    currentTab: 'boosters',
    isInitialized: false, // <--- ДОБАВЛЯЕМ
    
    // Инициализация
    init() {
        this.renderTabs();
        this.renderItems();
        
        if (!this.isInitialized) { // <--- ПРОВЕРЯЕМ
            this.bindEvents();
            this.isInitialized = true;
        }
    },
    
    // Рендер табов
    renderTabs() {
        const container = document.getElementById('shop-tabs');
        if (!container) return;
        
        container.innerHTML = ShopData.categories.map(cat => `
            <button class="shop-tab ${cat.id === this.currentTab ? 'active' : ''}" data-tab="${cat.id}">
                ${cat.name}
            </button>
        `).join('');
    },
    
    // Рендер предметов
    renderItems() {
        const container = document.getElementById('shop-grid');
        if (!container) return;
        
        const items = ShopData.items[this.currentTab] || [];
        
        container.innerHTML = items.map(item => {
            const isConsumable = item.type === 'consumable';
            const owned = !isConsumable && GameState.ownsItem(item.id);
            
            let iconStyle = '';
            if (item.color) {
                iconStyle = `style="background: ${item.color}; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center;"`;
            }
            
            return `
                <div class="shop-item ${owned ? 'owned' : ''}" 
                     data-id="${item.id}" 
                     data-price="${item.price}" 
                     data-type="${item.type || 'permanent'}">
                    <div class="shop-item-icon" ${iconStyle}>
                        ${item.color ? '' : item.icon}
                    </div>
                    <div class="shop-item-name">${item.name}</div>
                    <div class="shop-item-description">${item.description}</div>
                    <div class="shop-item-price ${owned ? 'owned' : ''}">
                        ${owned ? '✓ Куплено' : `💎 ${item.price}`}
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // Привязка событий
    bindEvents() {
        // Переключение табов
        const tabsContainer = document.getElementById('shop-tabs');
        if (tabsContainer) {
            tabsContainer.addEventListener('click', (e) => {
                const tab = e.target.closest('.shop-tab');
                if (tab) {
                    this.currentTab = tab.dataset.tab;
                    this.renderTabs();
                    this.renderItems();
                }
            });
        }
        
        // Клик по предметам
        const gridContainer = document.getElementById('shop-grid');
        if (gridContainer) {
            gridContainer.addEventListener('click', (e) => {
                const item = e.target.closest('.shop-item');
                if (item && !item.classList.contains('owned')) {
                    this.purchase(
                        item.dataset.id, 
                        parseInt(item.dataset.price), 
                        item.dataset.type
                    );
                }
            });
        }
    },
    
    // Покупка
    purchase(itemId, price, type) {
        // Проверка баланса
        if (GameState.data.points < price) {
            App.showNotification('💎 Недостаточно кристаллов!', 'error');
            return;
        }
        
        // Списываем кристаллы
        GameState.data.points -= price;
        
        if (type === 'consumable') {
            // Расходуемые предметы
            this.useConsumable(itemId);
        } else {
            // Постоянные предметы — добавляем в инвентарь
            GameState.data.ownedItems.push(itemId);
            App.showNotification('🎉 Покупка успешна! Надень в разделе "Аватар"', 'success');
        }
        
        GameState.save();
        App.updateUI();
        this.renderItems();
    },
    
    // Использование расходуемого предмета
    useConsumable(itemId) {
        switch (itemId) {
            case 'hearts_refill':
                GameState.refillHearts();
                App.showNotification('❤️ Сердца полностью восстановлены!', 'success');
                break;
                
            case 'double_xp':
                GameState.data.inventory.doubleXp = true;
                App.showNotification('⚡ Двойной опыт активирован на следующий урок!', 'success');
                break;
                
            case 'streak_freeze':
                GameState.data.inventory.streakFreezes++;
                App.showNotification('🧊 Заморозка серии добавлена! Защитит при пропуске дня.', 'success');
                break;
                
            case 'hint_pack':
                GameState.data.inventory.hints += 5;
                App.showNotification('💡 5 подсказок от Леа добавлены!', 'success');
                break;
                
            default:
                App.showNotification('✨ Предмет использован!', 'success');
        }
    }
};
