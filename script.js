// ===================================
// SMOOTH SCROLL
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// FAQ ACCORDION
// ===================================
const faqQuestions = document.querySelectorAll('.faq-question');
if (faqQuestions.length > 0) {
    faqQuestions.forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Cerrar todos los demás
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle el actual
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// ===================================
// ANIMATIONS ON SCROLL
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animaciones a las tarjetas de paquetes
const paqueteCards = document.querySelectorAll('.paquete-card');
if (paqueteCards.length > 0) {
    paqueteCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// ===================================
// ANALYTICS (opcional)
// ===================================
// Trackear clics en botones de compra
const botonesComprar = document.querySelectorAll('.btn-comprar');
if (botonesComprar.length > 0) {
    botonesComprar.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const paqueteCard = btn.closest('.paquete-card');
            if (paqueteCard) {
                const precioElement = paqueteCard.querySelector('.precio-monto');
                if (precioElement) {
                    const paquete = precioElement.textContent;
                    console.log(`Click en paquete: ${paquete}`);
                    
                    // Google Analytics (si está configurado)
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'purchase_intent', { 'paquete': paquete });
                    }
                    
                    // Facebook Pixel (si está configurado)
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'AddToCart', { content_name: paquete });
                    }
                }
            }
        });
    });
}

// ===================================
// HEADER SCROLL EFFECT
// ===================================
let lastScroll = 0;
const header = document.querySelector('.header');

if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15)';
        }
        
        lastScroll = currentScroll;
    });
}

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log('%c¡Hola! 👋', 'font-size: 20px; color: #E10A17; font-weight: bold;');
console.log('%cSi estás viendo esto, probablemente te interesa la tecnología. 🚀', 'font-size: 14px; color: #1B2945;');
console.log('%c¿Quieres trabajar con nosotros? Contáctanos en soporte@virginmobilemx.net', 'font-size: 12px; color: #666;');
console.log('%c✅ Landing Page v2.0 cargada correctamente', 'font-size: 12px; color: #22c55e; font-weight: bold;');
