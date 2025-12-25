// ===== ДАННЫЕ МАГАЗИНА =====

const ShopData = {
    categories: [
        { id: 'boosters', name: '⚡ Бустеры', icon: '⚡' },
        { id: 'hats', name: '🎩 Шляпы', icon: '🎩' },
        { id: 'glasses', name: '👓 Очки', icon: '👓' },
        { id: 'pets', name: '🐾 Питомцы', icon: '🐾' },
        { id: 'backgrounds', name: '🎨 Фоны', icon: '🎨' }
    ],
    
    items: {
        boosters: [
            { id: 'hearts_refill', name: 'Восстановить ❤️', description: 'Полностью восстановить сердца', price: 50, icon: '❤️‍🩹', type: 'consumable' },
            { id: 'double_xp', name: 'Двойной опыт', description: 'x2 XP на следующий урок', price: 75, icon: '⚡', type: 'consumable' },
            { id: 'streak_freeze', name: 'Заморозка серии', description: 'Сохранить серию при пропуске дня', price: 100, icon: '🧊', type: 'consumable' },
            { id: 'hint_pack', name: 'Пакет подсказок', description: '5 подсказок от Леа', price: 60, icon: '💡', type: 'consumable' }
        ],
        hats: [
            { id: 'hat_crown', name: 'Корона', description: 'Почувствуй себя королём знаний', price: 150, icon: '👑' },
            { id: 'hat_graduation', name: 'Выпускная шапка', description: 'Символ твоих стремлений', price: 100, icon: '🎓' },
            { id: 'hat_wizard', name: 'Шляпа мага', description: 'Магия грамотности!', price: 200, icon: '🧙' },
            { id: 'hat_party', name: 'Праздничный колпак', description: 'Каждый урок — праздник!', price: 80, icon: '🥳' },
            { id: 'hat_cowboy', name: 'Ковбойская шляпа', description: 'Йи-ха! Вперёд к знаниям!', price: 120, icon: '🤠' },
            { id: 'hat_santa', name: 'Шапка Деда Мороза', description: 'Новогоднее настроение', price: 90, icon: '🎅' },
            { id: 'hat_chef', name: 'Колпак шефа', description: 'Готовим грамотность!', price: 110, icon: '👨‍🍳' }
        ],
        glasses: [
            { id: 'glasses_nerd', name: 'Очки ботаника', description: 'Умный вид +100', price: 80, icon: '🤓' },
            { id: 'glasses_sun', name: 'Солнечные очки', description: 'Стильно и круто', price: 100, icon: '😎' },
            { id: 'glasses_3d', name: '3D очки', description: 'Ретро-стиль', price: 70, icon: '🥽' },
            { id: 'glasses_monocle', name: 'Монокль', description: 'Аристократично и умно', price: 150, icon: '🧐' },
            { id: 'glasses_heart', name: 'Сердечки', description: 'Всё в розовом цвете', price: 90, icon: '💕' },
            { id: 'glasses_star', name: 'Звёздные очки', description: 'Ты — звезда!', price: 130, icon: '⭐' }
        ],
        pets: [
            { id: 'pet_cat', name: 'Котёнок', description: 'Мурлыкает для мотивации', price: 200, icon: '🐱' },
            { id: 'pet_dog', name: 'Щенок', description: 'Лучший друг ученика', price: 200, icon: '🐶' },
            { id: 'pet_owl', name: 'Совёнок', description: 'Символ мудрости', price: 250, icon: '🦉' },
            { id: 'pet_dragon', name: 'Дракончик', description: 'Огненная мотивация', price: 300, icon: '🐲' },
            { id: 'pet_unicorn', name: 'Единорог', description: 'Магическая удача на экзамене', price: 350, icon: '🦄' },
            { id: 'pet_fox', name: 'Лисёнок', description: 'Хитрый помощник', price: 220, icon: '🦊' },
            { id: 'pet_panda', name: 'Панда', description: 'Спокойствие и мудрость', price: 280, icon: '🐼' },
            { id: 'pet_parrot', name: 'Попугай', description: 'Повторяет правила!', price: 180, icon: '🦜' }
        ],
        backgrounds: [
            { id: 'bg_fire', name: 'Огненный', description: 'Горячий настрой', price: 100, icon: '🔥', color: 'linear-gradient(135deg, #ff6b35, #f7931e)' },
            { id: 'bg_ocean', name: 'Океан', description: 'Спокойствие моря', price: 100, icon: '🌊', color: 'linear-gradient(135deg, #667eea, #764ba2)' },
            { id: 'bg_forest', name: 'Лесной', description: 'Природная сила', price: 100, icon: '🌲', color: 'linear-gradient(135deg, #56ab2f, #a8e063)' },
            { id: 'bg_sunset', name: 'Закат', description: 'Романтика вечера', price: 120, icon: '🌅', color: 'linear-gradient(135deg, #f093fb, #f5576c)' },
            { id: 'bg_space', name: 'Космос', description: 'Бесконечность знаний', price: 0, icon: '🚀', color: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' },
            { id: 'bg_gold', name: 'Золотой', description: 'Премиум-статус', price: 200, icon: '✨', color: 'linear-gradient(135deg, #f7971e, #ffd200)' },
            { id: 'bg_rainbow', name: 'Радуга', description: 'Все цвета успеха', price: 180, icon: '🌈', color: 'linear-gradient(135deg, #f093fb, #f5576c, #ffd200, #56ab2f, #667eea)' },
            { id: 'bg_night', name: 'Ночное небо', description: 'Мечтай о звёздах', price: 140, icon: '🌙', color: 'linear-gradient(135deg, #141e30, #243b55)' }
        ]
    }
};
