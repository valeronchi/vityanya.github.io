// Управление модальным окном и отправка в Telegram
document.addEventListener('DOMContentLoaded', function() {
    const modalOverlay = document.getElementById('modalOverlay');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const guestForm = document.getElementById('guestForm');
    const alcoholSelect = document.getElementById('alcohol');
    const otherAlcoholGroup = document.getElementById('otherAlcoholGroup');
    const otherAlcoholInput = document.getElementById('other_alcohol');
    
    // Конфигурация Telegram бота - ЗАМЕНИТЕ НА СВОИ!
    const TELEGRAM_CONFIG = {
        token: '8366919483:AAEJ9iSiUboymlLJHNEZwAVHcwbJRNBDJEw', // Токен от @BotFather
        chatId: '-1003654727725' // ID группы (с минусом!) от @getmyid_bot
    };
    
    // Открытие модального окна
    function openModal() {
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Закрытие модального окна
    function closeModal() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
        guestForm.reset();
        otherAlcoholGroup.style.display = 'none';
    }
    
    // Показать поле для другого алкоголя
    function showOtherAlcohol() {
        otherAlcoholGroup.style.display = 'block';
    }
    
    // Скрыть поле для другого алкоголя
    function hideOtherAlcohol() {
        otherAlcoholGroup.style.display = 'none';
        otherAlcoholInput.value = '';
    }
    
    // Функция отправки в Telegram
    async function sendToTelegram(formData) {
        const telegramToken = TELEGRAM_CONFIG.token;
        const chatId = TELEGRAM_CONFIG.chatId;
        
        // Формируем сообщение
        const attendanceText = {
            'yes': '✅ Да',
            'no': '❌ Нет',
            'unsure': '❓ Пока затрудняюсь'
        };
        
        const alcoholText = {
            'vine': '🍷 Вино',
            'champagne': '🥂 Шампанское',
            'whiskey': '🥃 Виски',
            'vodka': '🍸 Водка',
            'cocktails': '🍹 Коктейли',
            'none': '🚫 Не употребляю',
            'other': formData.otherAlcohol || 'Другое'
        };
        
        const message = `
🎉 <b>Новый ответ на приглашение!</b>

👤 <b>Имя:</b> ${formData.name}
💍 <b>Присутствие:</b> ${attendanceText[formData.attendance]}
🍾 <b>Алкоголь:</b> ${alcoholText[formData.alcohol] || formData.alcohol}
📅 <b>Дата:</b> ${new Date().toLocaleString('ru-RU')}
        `;
        
        try {
            const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            const data = await response.json();
            
            if (data.ok) {
                alert('✅ Спасибо! Ваш ответ отправлен организаторам.');
                return true;
            } else {
                console.error('Ошибка Telegram:', data);
                throw new Error(data.description);
            }
        } catch (error) {
            console.error('Ошибка отправки в Telegram:', error);
            alert('❌ Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с организаторами напрямую.');
            return false;
        }
    }
    
    // Обработчик изменения выбора алкоголя
    alcoholSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            showOtherAlcohol();
        } else {
            hideOtherAlcohol();
        }
    });
    
    // Открытие по кнопке
    openModalBtn.addEventListener('click', openModal);
    
    // Закрытие по крестику
    closeModalBtn.addEventListener('click', closeModal);
    
    // Закрытие по кнопке отмена
    cancelModalBtn.addEventListener('click', closeModal);
    
    // Закрытие по клику на оверлей
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
            closeModal();
        }
    });
    
    // Обработка отправки формы
    guestForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name');
        const attendance = document.querySelector('input[name="attendance"]:checked');
        
        if (!name.value.trim()) {
            alert('Пожалуйста, введите имя и фамилию');
            name.focus();
            return;
        }
        
        if (!attendance) {
            alert('Пожалуйста, укажите, будете ли вы присутствовать на свадьбе');
            return;
        }
        
        // Показываем индикатор загрузки
        const submitBtn = guestForm.querySelector('.modal-submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        // Собираем данные
        const formData = {
            name: name.value.trim(),
            attendance: attendance.value,
            alcohol: alcoholSelect.value,
            otherAlcohol: otherAlcoholInput.value.trim()
        };
        
        // Отправляем в Telegram
        const sent = await sendToTelegram(formData);
        
        if (sent) {
            closeModal();
        }
        
        // Возвращаем кнопку в исходное состояние
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
});