// Анимации для всех фоновых элементов (точно как в animationHeader.js)
document.addEventListener('DOMContentLoaded', function() {
    console.log('animations.js загружен');
    
    // Получаем все элементы для анимации
    const thLeft = document.querySelector('.section-block-1-bg-th-l');
    const thRight = document.querySelector('.section-block-1-bg-th-r');
    const thDown = document.querySelector('.section-block-2-bg-th-d');
    const thUp = document.querySelector('.footer-bg-th-u');
    const thDownFooter = document.querySelector('.footer-bg-th-d');
    
    // Создаем observer как в header
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                console.log('Добавлен visible для:', entry.target.className);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px'
    });
    
    // Наблюдаем за каждым элементом
    if (thLeft) observer.observe(thLeft);
    if (thRight) observer.observe(thRight);
    if (thDown) observer.observe(thDown);
    if (thUp) observer.observe(thUp);
    if (thDownFooter) observer.observe(thDownFooter);
    
    // Элементы header (уже есть в animationHeader.js, но для проверки)
    const th1 = document.querySelector('.background-things-th1');
    const th2 = document.querySelector('.background-things-th2');
    if (th1) observer.observe(th1);
    if (th2) observer.observe(th2);
});