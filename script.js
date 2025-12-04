/* =========================================
   JAVASCRIPT OPTIMIZADO PARA CONVERSIÓN
   Incluye: Temporizador, Stock dinámico, Exit popup, 
   Notificaciones, Animaciones de estadísticas
   ========================================= */

// ====================================
// 1. TEMPORIZADOR DE OFERTA
// ====================================
function startCountdown() {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    
    function update() {
        const now = new Date();
        let diff = end - now;
        
        // Si llegó a 0, reiniciar para mañana
        if (diff <= 0) {
            end.setDate(end.getDate() + 1);
            end.setHours(23, 59, 59, 999);
            diff = end - now;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }
    
    update();
    setInterval(update, 1000);
}

// ====================================
// 2. CONTADOR DE STOCK DINÁMICO
// ====================================
function updateStockCounters() {
    const counters = document.querySelectorAll('.stock-counter');
    
    counters.forEach(counter => {
        // Stock aleatorio entre 8 y 15
        const randomStock = Math.floor(Math.random() * (15 - 8 + 1)) + 8;
        counter.textContent = randomStock;
        
        // Animación de pulso cuando cambia
        counter.parentElement.parentElement.style.animation = 'none';
        setTimeout(() => {
            counter.parentElement.parentElement.style.animation = 'pulse-urgent 2s infinite';
        }, 10);
    });
}

// ====================================
// 3. ANIMACIÓN DE ESTADÍSTICAS
// ====================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                // Si tiene decimales, mostrarlos
                counter.textContent = target % 1 === 0 ? target : target.toFixed(1);
            }
        };
        
        // Animar solo cuando sea visible (Intersection Observer)
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// ====================================
// 4. POP-UP DE SALIDA (EXIT INTENT)
// ====================================
let exitShown = false;
let exitAttempts = 0;

// Detectar intento de salida (mouse sale por arriba)
document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0 && !exitShown && exitAttempts < 2) {
        showExitPopup();
    }
});

// También mostrar después de 30 segundos si no ha comprado
setTimeout(() => {
    if (!exitShown && !localStorage.getItem('exitPopupShown')) {
        showExitPopup();
    }
}, 30000);

function showExitPopup() {
    const popup = document.getElementById('exitPopup');
    
    if (!exitShown && !localStorage.getItem('exitPopupShown')) {
        popup.classList.add('show');
        exitShown = true;
        exitAttempts++;
        
        // Guardar que ya se mostró (válido por 24 horas)
        const tomorrow = new Date();
        tomorrow.setHours(23, 59, 59, 999);
        localStorage.setItem('exitPopupShown', tomorrow.getTime());
    }
}

function closeExitPopup() {
    const popup = document.getElementById('exitPopup');
    popup.classList.remove('show');
}

function submitExitForm(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Aquí enviarías el email a tu backend o servicio de email marketing
    console.log('📧 Email capturado para descuento:', email);
    
    // Simular envío exitoso
    alert('🎉 ¡Listo! Revisa tu correo en 5 minutos para recibir tu cupón de $50 de descuento.');
    
    closeExitPopup();
    
    // Opcional: Enviar a Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'lead_capture', {
            'event_category': 'Exit Popup',
            'event_label': email
        });
    }
}

// ====================================
// 5. NOTIFICACIONES DE COMPRA EN VIVO
// ====================================
const fakeCustomers = [
    { name: 'María de Guadalajara', package: '$250' },
    { name: 'Carlos de Monterrey', package: '$300' },
    { name: 'Ana de CDMX', package: '$250' },
    { name: 'Luis de Puebla', package: '$200' },
    { name: 'Sofia de Querétaro', package: '$400' },
    { name: 'Jorge de León', package: '$250' },
    { name: 'Laura de Tijuana', package: '$300' },
    { name: 'Pedro de Cancún', package: '$150' }
];

function showLiveNotification() {
    const notification = document.getElementById('liveNotification');
    const random = fakeCustomers[Math.floor(Math.random() * fakeCustomers.length)];
    
    // Actualizar contenido
    const nameEl = notification.querySelector('.notification-name');
    const actionEl = notification.querySelector('.notification-action');
    
    if (nameEl) nameEl.textContent = random.name;
    if (actionEl) actionEl.textContent = `acaba de comprar el paquete ${random.package}`;
    
    // Mostrar
    notification.classList.add('show');
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// Mostrar notificación cada 15-25 segundos aleatoriamente
function scheduleLiveNotifications() {
    function showNext() {
        showLiveNotification();
        const nextTime = Math.random() * (25000 - 15000) + 15000;
        setTimeout(showNext, nextTime);
    }
    
    // Primera notificación después de 8 segundos
    setTimeout(showNext, 8000);
}

// ====================================
// 6. LIMPIAR STORAGE CADUCADO
// ====================================
function cleanExpiredStorage() {
    const exitShownTime = localStorage.getItem('exitPopupShown');
    
    if (exitShownTime) {
        const now = new Date().getTime();
        if (now > parseInt(exitShownTime)) {
            localStorage.removeItem('exitPopupShown');
        }
    }
}

// ====================================
// 7. TRACKING DE CLICKS EN BOTONES
// ====================================
function trackPackageClicks() {
    const buyButtons = document.querySelectorAll('.btn-buy');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const packageCard = e.target.closest('.package-card');
            const price = packageCard.querySelector('.price').textContent;
            const gb = packageCard.querySelector('.big-gb').textContent;
            
            console.log(`📊 Click en paquete: ${gb} - ${price}`);
            
            // Google Analytics (si está configurado)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'package_click', {
                    'event_category': 'Packages',
                    'event_label': `${gb} - ${price}`,
                    'value': parseInt(price.replace('$', ''))
                });
            }
            
            // Facebook Pixel (si está configurado)
            if (typeof fbq !== 'undefined') {
                fbq('track', 'AddToCart', {
                    content_name: `Paquete ${gb}`,
                    value: parseInt(price.replace('$', '')),
                    currency: 'MXN'
                });
            }
        });
    });
}

// ====================================
// 8. SMOOTH SCROLL PARA ANCLAS
// ====================================
function enableSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ====================================
// 9. INICIALIZACIÓN AL CARGAR PÁGINA
// ====================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Landing Page Optimizada Cargada');
    
    // Limpiar storage caducado
    cleanExpiredStorage();
    
    // Iniciar temporizador
    startCountdown();
    
    // Actualizar stock inicial
    updateStockCounters();
    
    // Actualizar stock cada 45 segundos
    setInterval(updateStockCounters, 45000);
    
    // Animar estadísticas
    animateCounters();
    
    // Iniciar notificaciones en vivo
    scheduleLiveNotifications();
    
    // Tracking de clicks
    trackPackageClicks();
    
    // Smooth scroll
    enableSmoothScroll();
    
    console.log('✅ Todas las herramientas de conversión activas');
});

// ====================================
// 10. FUNCIONES GLOBALES (para HTML)
// ====================================
window.closeExitPopup = closeExitPopup;
window.submitExitForm = submitExitForm;
