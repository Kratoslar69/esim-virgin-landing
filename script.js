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
document.querySelectorAll('.faq-question').forEach(button => {
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

// ===================================
// CHATBOT
// ===================================
const chatbotButton = document.getElementById('chatbot-button');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotBody = document.querySelector('.chatbot-body');
const chatbotInput = document.getElementById('chatbot-input-field');
const chatbotSend = document.getElementById('chatbot-send');

// Abrir/Cerrar chatbot
chatbotButton.addEventListener('click', () => {
    chatbotWindow.classList.toggle('active');
    if (chatbotWindow.classList.contains('active')) {
        chatbotInput.focus();
    }
});

chatbotClose.addEventListener('click', () => {
    chatbotWindow.classList.remove('active');
});

// Base de conocimientos del chatbot
const chatbotKnowledge = {
    "compatible": {
        keywords: ["compatible", "compatibilidad", "teléfono", "celular", "iphone", "android", "dispositivo", "modelo"],
        response: "Los dispositivos compatibles con eSIM incluyen:\n\n📱 iPhone: XR, XS, 11, 12, 13, 14, 15 y modelos más recientes\n📱 Samsung: Galaxy S20, S21, S22, S23, S24 y superiores\n📱 Google: Pixel 3, 4, 5, 6, 7, 8 y superiores\n📱 Motorola: Razr (2019 y posteriores)\n\n¿Tienes un modelo específico en mente?"
    },
    "paquete": {
        keywords: ["paquete", "plan", "recomendar", "mejor", "cuál", "elegir", "precio"],
        response: "Te ayudo a elegir el paquete perfecto:\n\n💡 Paquete $150 (15GB): Ideal si usas poco internet y principalmente redes sociales\n\n💡 Paquete $200 (21.5GB): Buena opción para uso moderado con video ocasional\n\n⭐ Paquete $250 (17GB): RECOMENDADO - El más popular, perfecto para uso regular\n\n💡 Paquete $300 (22GB): Para usuarios intensivos de redes sociales\n\n💡 Paquete $400 (34GB): Máximos datos para streaming y trabajo remoto\n\nTodos incluyen 4to mes gratis. ¿Cuántos GB usas al mes aproximadamente?"
    },
    "activar": {
        keywords: ["activar", "activación", "cómo", "proceso", "pasos", "instalar"],
        response: "¡Activar tu eSIM es muy fácil! 🚀\n\n1️⃣ Compra tu paquete haciendo clic en 'Comprar nuevo chip o eSIM'\n2️⃣ Completa tus datos (toma 2 minutos)\n3️⃣ Recibirás un código QR por email\n4️⃣ Ve a Configuración > Celular > Añadir plan celular\n5️⃣ Escanea el QR\n6️⃣ ¡Listo! Tu eSIM se activa al instante\n\n¿Tienes dudas sobre algún paso?"
    },
    "portar": {
        keywords: ["portar", "portabilidad", "conservar", "número", "cambiar"],
        response: "¡Claro que puedes portar tu número! 📱\n\n✅ Proceso 100% online\n✅ Sin costo adicional\n✅ Tarda aproximadamente 24 horas\n✅ ¡BONUS! 6 meses de beneficios extras\n\nNecesitas:\n- Tu NIP de portabilidad (pídelo a tu operador actual)\n- Una identificación oficial\n- Tu número actual activo\n\n¿Quieres iniciar el proceso?"
    },
    "cobertura": {
        keywords: ["cobertura", "señal", "funciona", "zona", "área", "red", "5g", "4g"],
        response: "Virgin Mobile opera sobre la red de Altán Redes 📡\n\n✅ Cobertura 4G LTE en todo México\n✅ Red 5G disponible en principales ciudades\n✅ Presente en todas las carreteras principales\n✅ Cobertura nacional garantizada\n\nPuedes consultar el mapa de cobertura detallado en virginmobile.mx/cobertura\n\n¿En qué ciudad te encuentras?"
    },
    "precio": {
        keywords: ["precio", "costo", "cuánto", "vale", "cuánto cuesta"],
        response: "Nuestros paquetes eSIM:\n\n💰 $150 - 15GB (26 días)\n💰 $200 - 21.5GB (30 días)\n💰 $250 - 17GB (31 días) ⭐ MÁS POPULAR\n💰 $300 - 22GB (31 días)\n💰 $400 - 34GB (31 días)\n\n✨ TODOS incluyen 4to mes gratis\n✨ Redes sociales y apps ilimitadas (según paquete)\n✨ Llamadas ilimitadas a México, USA y Canadá\n\n¿Cuál te interesa?"
    },
    "beneficios": {
        keywords: ["beneficio", "incluye", "gratis", "mes", "cuarto"],
        response: "🎁 Beneficios de nuestros paquetes:\n\n✨ 4to mes completamente GRATIS al mantener recarga activa 3 meses\n📱 Redes sociales ilimitadas (WhatsApp, Instagram, Facebook, etc.)\n🎬 GB dedicados para video (TikTok, YouTube, Netflix, etc.)\n📞 Llamadas y SMS ilimitados a MX, USA y Canadá\n🌐 Red 5G disponible\n♻️ Portabilidad sin costo\n\n¿Qué más te gustaría saber?"
    },
    "tiempo": {
        keywords: ["tiempo", "tarda", "rápido", "cuánto", "demora", "minutos"],
        response: "⚡ Proceso super rápido:\n\n🛒 Compra: 2-3 minutos\n📧 Recibes tu QR: Inmediato\n📱 Activación: 3-5 minutos\n\n⏱️ Total: ¡Menos de 10 minutos desde que compras hasta que ya estás usando tu línea!\n\nSi portas tu número, el proceso toma 24 horas adicionales.\n\n¿Listo para empezar?"
    },
    "whatsapp": {
        keywords: ["whatsapp", "contacto", "ayuda", "hablar", "asesor"],
        response: "¡Claro! Puedes contactarnos por WhatsApp 💬\n\nNuestros asesores están disponibles para ayudarte en:\n📱 WhatsApp: (55) 1234-5678\n\nTambién puedes:\n📧 Email: soporte@virginmobilemx.net\n\n¿Te gustaría que te redirija a WhatsApp?"
    }
};

// Función para encontrar respuesta
function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Buscar en la base de conocimientos
    for (const [key, data] of Object.entries(chatbotKnowledge)) {
        if (data.keywords.some(keyword => message.includes(keyword))) {
            return data.response;
        }
    }
    
    // Respuesta por defecto
    return "Disculpa, no estoy seguro de cómo responder a eso. 🤔\n\nPuedo ayudarte con:\n\n✅ Compatibilidad de dispositivos\n✅ Recomendación de paquetes\n✅ Proceso de activación\n✅ Portabilidad de número\n✅ Cobertura y señal\n✅ Precios y beneficios\n\n¿Sobre qué te gustaría saber más? O si prefieres, puedes contactar a un asesor en WhatsApp: (55) 1234-5678";
}

// Función para agregar mensaje al chat
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const messageP = document.createElement('p');
    messageP.innerHTML = message.replace(/\n/g, '<br>');
    
    messageDiv.appendChild(messageP);
    chatbotBody.appendChild(messageDiv);
    
    // Scroll al final
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

// Manejar envío de mensaje
function handleSendMessage() {
    const message = chatbotInput.value.trim();
    if (message === '') return;
    
    // Agregar mensaje del usuario
    addMessage(message, true);
    chatbotInput.value = '';
    
    // Simular "escribiendo..."
    setTimeout(() => {
        const response = getBotResponse(message);
        addMessage(response, false);
    }, 500);
}

// Event listeners para enviar mensaje
chatbotSend.addEventListener('click', handleSendMessage);
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
});

// Quick questions
document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const question = btn.getAttribute('data-question');
        addMessage(question, true);
        
        setTimeout(() => {
            const response = getBotResponse(question);
            addMessage(response, false);
        }, 500);
    });
});

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
document.querySelectorAll('.paquete-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.5s ease ${index * 0.1}s`;
    observer.observe(card);
});

// ===================================
// ANALYTICS (opcional)
// ===================================
// Trackear clics en botones de compra
document.querySelectorAll('.btn-comprar').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const paquete = btn.closest('.paquete-card').querySelector('.precio-monto').textContent;
        console.log(`Click en paquete: ${paquete}`);
        // Aquí puedes agregar Google Analytics o Facebook Pixel
        // gtag('event', 'purchase_intent', { 'paquete': paquete });
    });
});

// ===================================
// HEADER SCROLL EFFECT
// ===================================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15)';
    }
    
    lastScroll = currentScroll;
});

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log('%c¡Hola! 👋', 'font-size: 20px; color: #E10A17; font-weight: bold;');
console.log('%cSi estás viendo esto, probablemente te interesa la tecnología. 🚀', 'font-size: 14px; color: #1B2945;');
console.log('%c¿Quieres trabajar con nosotros? Contáctanos en soporte@virginmobilemx.net', 'font-size: 12px; color: #666;');
