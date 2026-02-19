// Навигация по секциям с принудительной прокруткой
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('sections-container');
    const sections = document.querySelectorAll('.section');
    const indicators = document.querySelectorAll('.indicator');
    let currentSection = 0;
    let isScrolling = false;
    let touchStartY = 0;
    let touchEndY = 0;
    let scrollTimeout;
    
    // Функция для обновления индикаторов
    function updateIndicators(index) {
        indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Функция для переключения на конкретную секцию
    function goToSection(index) {
        if (index < 0 || index >= sections.length || isScrolling) return;
        
        isScrolling = true;
        currentSection = index;
        
        sections[index].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        updateIndicators(index);
        
        // Сбрасываем флаг после завершения анимации
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 800);
    }
    
    // Обработчик колесика мыши
    container.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        if (isScrolling) return;
        
        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            // Скролл вниз
            goToSection(currentSection + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
            // Скролл вверх
            goToSection(currentSection - 1);
        }
    }, { passive: false });
    
    // Обработчики для свайпа на телефонах
    container.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    container.addEventListener('touchend', function(e) {
        if (isScrolling) return;
        
        touchEndY = e.changedTouches[0].screenY;
        const diff = touchStartY - touchEndY;
        
        // Минимальное расстояние свайпа - 30px
        if (Math.abs(diff) < 30) return;
        
        if (diff > 0 && currentSection < sections.length - 1) {
            // Свайп вверх (переход к следующей секции)
            goToSection(currentSection + 1);
        } else if (diff < 0 && currentSection > 0) {
            // Свайп вниз (переход к предыдущей секции)
            goToSection(currentSection - 1);
        }
    }, { passive: true });
    
    // Предотвращаем стандартный скролл на touchmove
    container.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    // Отслеживание текущей секции при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = parseInt(entry.target.getAttribute('data-index'));
                if (!isNaN(index) && !isScrolling) {
                    currentSection = index;
                    updateIndicators(index);
                }
            }
        });
    }, {
        threshold: 0.5
    });
    
    sections.forEach(section => observer.observe(section));
    
    // Клик по индикаторам
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSection(index);
        });
    });
    
    // Дополнительная защита от скролла страницы
    document.body.addEventListener('wheel', function(e) {
        if (!e.target.closest('.modal-overlay')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    document.body.addEventListener('touchmove', function(e) {
        if (!e.target.closest('.modal-overlay')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Инициализация первого индикатора
    updateIndicators(0);
});