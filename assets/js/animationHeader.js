// Более современный подход с Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
    const th1 = document.querySelector('.background-things-th1');
    const th2 = document.querySelector('.background-things-th2');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Если хотите, чтобы анимация срабатывала только один раз
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2, // Срабатывает когда 20% элемента видимо
        rootMargin: '0px'
    });
    
    if (th1) observer.observe(th1);
    if (th2) observer.observe(th2);
});