// Конфигурация
const config = {
    totalSlides: 11,
    currentSlide: 1,
    wishes: [
        "Крепкого кофе!",
        "Стабильных билдов!",
        "Зелёных регрессов!",
        "Чистого кода!",
        "Счастливого Нового года!",
        "Меньше ночных дежурств!",
        "Интересных задач!",
        "Багов поменьше!",
        "Автотестов побольше!"
    ],
    emojis: ["✨", "🎉", "🚀", "🌟", "🎊", "🥳", "🎇", "🎆", "💫"]
};

const snowConfig = {
    snowflakesCount: 50, // Количество снежинок
    minSize: 2,          // Минимальный размер снежинки
    maxSize: 6,          // Максимальный размер снежинки
    minSpeed: 5,         // Минимальная скорость падения
    maxSpeed: 15,        // Максимальная скорость падения
    colors: [            // Цвета снежинок
        'rgba(255, 255, 255, 0.9)',    // Белый
        'rgba(255, 255, 255, 0.7)',    // Полупрозрачный белый
        'rgba(200, 230, 255, 0.8)',    // Голубоватый
        'rgba(255, 255, 255, 0.6)',    // Более прозрачный
        'rgba(255, 255, 255, 0.8)'     // Яркий белый
    ]
};

// Обновите функцию инициализации:
document.addEventListener('DOMContentLoaded', () => {
    initSlides();
    setupEventListeners();
    showRandomWish();
    createSnowflakes(); // Добавьте эту строку
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initSlides();
    setupEventListeners();
    showRandomWish();
});

// Инициализация слайдов
function initSlides() {
    updateNavigation();

    // Устанавливаем правильные классы для неактивных слайдов
    for (let i = 2; i <= config.totalSlides; i++) {
        const slide = document.getElementById(`slide${i}`);
        if (slide) {
            slide.classList.add('next');
        }
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопки навигации
    document.getElementById('prevBtn').addEventListener('click', goToPrevSlide);
    document.getElementById('nextBtn').addEventListener('click', goToNextSlide);

    // Индикаторы
    document.querySelectorAll('.indicator-dot').forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index + 1));
    });

    // Клавиатура
    document.addEventListener('keydown', handleKeydown);

    // Свайпы на мобильных
    setupSwipeListeners();
}

// Навигация по слайдам
function goToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > config.totalSlides) return;
    if (slideNumber === config.currentSlide) return;

    const currentSlideElement = document.getElementById(`slide${config.currentSlide}`);
    const targetSlideElement = document.getElementById(`slide${slideNumber}`);

    // Удаляем все классы переходов
    currentSlideElement.classList.remove('active', 'previous', 'next');
    targetSlideElement.classList.remove('previous', 'next');

    // Определяем направление анимации
    if (slideNumber > config.currentSlide) {
        currentSlideElement.classList.add('previous');
        targetSlideElement.classList.add('active');
    } else {
        currentSlideElement.classList.add('next');
        targetSlideElement.classList.add('active');
    }

    config.currentSlide = slideNumber;
    updateNavigation();

    // Специальные эффекты
    if (config.currentSlide === 11) {
        showRandomWish();
        createConfetti();
    }
}

function goToPrevSlide() {
    if (config.currentSlide > 1) {
        goToSlide(config.currentSlide - 1);
    }
}

function goToNextSlide() {
    if (config.currentSlide < config.totalSlides) {
        goToSlide(config.currentSlide + 1);
    } else {
        // Если последний слайд, возвращаемся к первому
        goToSlide(1);
    }
}

// Обновление навигации
function updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Кнопки назад/вперед
    prevBtn.classList.toggle('disabled', config.currentSlide === 1);

    // Текст для последнего слайда
    if (config.currentSlide === config.totalSlides) {
        nextBtn.innerHTML = '<i class="fas fa-redo"></i>';
        nextBtn.title = "Начать заново";
    } else {
        nextBtn.innerHTML = '<i class="fas fa-arrow-right"></i>';
        nextBtn.title = "Следующий слайд";
    }

    // Индикаторы
    document.querySelectorAll('.indicator-dot').forEach((dot, index) => {
        const isActive = index === config.currentSlide - 1;
        dot.classList.toggle('active', isActive);

        // Обновляем data-атрибут для корректной работы
        dot.setAttribute('data-slide', index + 1);
    });
}

// Обработка клавиатуры
function handleKeydown(e) {
    switch(e.key) {
        case 'ArrowLeft':
            goToPrevSlide();
            break;
        case 'ArrowRight':
        case ' ':
            goToNextSlide();
            break;
        case 'Home':
            goToSlide(1);
            break;
        case 'End':
            goToSlide(config.totalSlides);
            break;
        case '1': case '2': case '3': case '4': case '5':
        case '6': case '7': case '8': case '9':
            const num = parseInt(e.key);
            if (num <= config.totalSlides) {
                goToSlide(num);
            }
            break;
    }
}

// Свайпы на мобильных
function setupSwipeListeners() {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                goToNextSlide(); // Свайп влево
            } else {
                goToPrevSlide(); // Свайп вправо
            }
        }
    }
}

// Случайное пожелание
function showRandomWish() {
    const wishElement = document.getElementById('wishText');
    if (!wishElement) return;

    const randomWish = config.wishes[Math.floor(Math.random() * config.wishes.length)];
    wishElement.textContent = randomWish;
}

// Конфетти-эффект
function createConfetti() {
    const slide = document.getElementById('slide11');
    if (!slide) return;

    const colors = ['#FFD700', '#FF6B6B', '#4FC3FF', '#FF8C00', '#9D4EDD', '#51FF51'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: 0;
            z-index: 1;
        `;

        slide.appendChild(confetti);

        // Анимация
        setTimeout(() => {
            confetti.style.transition = 'all 1s ease-out';
            confetti.style.opacity = '1';
            confetti.style.transform = `
                translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 + 100}px)
                rotate(${Math.random() * 360}deg)
            `;

            // Удаление через 1 секунду
            setTimeout(() => {
                confetti.remove();
            }, 1000);
        }, 10);
    }
}

function createSnowflakes() {
    const snowContainer = document.createElement('div');
    snowContainer.className = 'snowflakes';
    document.body.appendChild(snowContainer);

    // Создаем снежинки
    for (let i = 0; i < snowConfig.snowflakesCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';

        // Случайный размер
        const size = Math.random() * (snowConfig.maxSize - snowConfig.minSize) + snowConfig.minSize;

        // Случайная позиция
        const startX = Math.random() * 100;
        const startY = Math.random() * -50; // Начинают выше экрана

        // Случайная скорость
        const speed = Math.random() * (snowConfig.maxSpeed - snowConfig.minSpeed) + snowConfig.minSpeed;

        // Случайный цвет
        const color = snowConfig.colors[Math.floor(Math.random() * snowConfig.colors.length)];

        // Случайное мерцание
        const opacity = Math.random() * 0.4 + 0.6;

        // Случайное вращение
        const rotation = Math.random() * 720;

        // Применяем стили
        snowflake.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startX}%;
            top: ${startY}%;
            background: ${color};
            opacity: ${opacity};
            animation: fall ${speed}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;

        // Добавляем дополнительную анимацию для мерцания
        snowflake.style.animation += `, twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`;

        snowContainer.appendChild(snowflake);
    }

    // Добавляем стили для мерцания
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
        }
        
        @keyframes fall {
            0% {
                transform: translateY(-100px) rotate(0deg);
            }
            100% {
                transform: translateY(calc(100vh + 100px)) rotate(${Math.random() * 360}deg);
            }
        }
        
        /* Разные траектории для снежинок */
        .snowflake:nth-child(odd) {
            animation: fall ${Math.random() * 5 + 8}s linear infinite;
        }
        
        .snowflake:nth-child(even) {
            animation: fall ${Math.random() * 5 + 10}s linear infinite;
        }
    `;
    document.head.appendChild(style);
}



// Экспорт функций в глобальную область видимости
window.goToSlide = goToSlide;
window.goToPrevSlide = goToPrevSlide;
window.goToNextSlide = goToNextSlide;