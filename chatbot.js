document.addEventListener('DOMContentLoaded', function() {
    // 1. SELECTORES: Identificamos las partes del chat en el HTML
    const chatBubble = document.getElementById('chatbotBubble');
    const chatWindow = document.getElementById('chatbotWindow');
    const closeBtn = document.getElementById('closeChat');
    const chatForm = document.getElementById('chatbotForm');
    const chatInput = document.getElementById('chatbotInput');
    const chatMessages = document.getElementById('chatMessages');
    const quickReplies = document.querySelectorAll('.quick-reply-btn');

    // 2. ABRIR Y CERRAR EL CHAT
    // Al hacer clic en la burbuja
    chatBubble.addEventListener('click', () => {
        chatWindow.classList.add('active');
        chatBubble.style.display = 'none'; // Oculta la burbuja
        chatInput.focus(); // Pone el cursor listo para escribir
    });

    // Al hacer clic en la X de cerrar
    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('active');
        chatBubble.style.display = 'flex'; // Vuelve a mostrar la burbuja
    });

    // 3. ENVIAR MENSAJES
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue
        const userText = chatInput.value.trim();
        
        if (userText) {
            addUserMessage(userText); // 1. Muestra lo que escribiste
            processBotResponse(userText); // 2. El bot piensa y responde
            chatInput.value = ''; // 3. Limpia la caja de texto
        }
    });

    // 4. BOTONES DE RESPUESTA RÁPIDA
    quickReplies.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const text = e.target.innerText.replace('📲 ', '').replace('🗺️ ', '').replace('💲 ', '');
            addUserMessage(text);
            processBotResponse(text);
        });
    });

    // ==========================================
    // FUNCIONES DEL CEREBRO (LÓGICA)
    // ==========================================

    function addUserMessage(text) {
        const div = document.createElement('div');
        div.className = 'message user-message';
        div.innerHTML = `<div class="message-content"><p>${text}</p></div>`;
        chatMessages.appendChild(div);
        scrollToBottom();
    }

    function addBotMessage(text) {
        const div = document.createElement('div');
        div.className = 'message bot-message';
        // El avatar del robot
        div.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content"><p>${text}</p></div>
        `;
        chatMessages.appendChild(div);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ==========================================
    // DICCIONARIO DE RESPUESTAS (AQUÍ ESTÁ LA MAGIA)
    // ==========================================
    function processBotResponse(input) {
        // Convertimos todo a minúsculas para que entienda igual "Hola" que "hola"
        const lowerInput = input.toLowerCase();
        let response = "";

        // LÓGICA DE RESPUESTAS
        
        // 1. Saludos
        if (lowerInput.includes('hola') || lowerInput.includes('buenos') || lowerInput.includes('buenas')) {
            response = "¡Hola! 👋 Soy Jarvis. ¿En qué puedo ayudarte hoy? Pregúntame sobre paquetes, eSIM o cobertura.";
        }
        
        // 2. eSIM
        else if (lowerInput.includes('esim') || lowerInput.includes('virtual') || lowerInput.includes('chip digital')) {
            response = "La eSIM es un chip virtual. 📲 Ya no necesitas el plástico físico. Te enviamos un código QR a tu correo, lo escaneas y ¡listo! Tienes señal en 5 minutos. ¿Quieres ver los paquetes compatibles?";
        }

        // 3. Precios y Paquetes
        else if (lowerInput.includes('precio') || lowerInput.includes('paquete') || lowerInput.includes('costo') || lowerInput.includes('planes')) {
            response = "Tenemos los mejores paquetes sin contrato: <br><br>💎 <b>$200 (Mejor Valor):</b> 21.5GB Totales + Redes.<br>⭐ <b>$250 (Popular):</b> 17GB + Redes Ilimitadas.<br>🚀 <b>$400 (Power):</b> 34GB + Todo ilimitado.<br><br>¡Y recuerda la promoción del 4to mes GRATIS!";
        }

        // 4. Promoción (¡NUEVO!)
        else if (lowerInput.includes('promo') || lowerInput.includes('gratis') || lowerInput.includes('oferta') || lowerInput.includes('cuarto') || lowerInput.includes('4to')) {
            response = "🎁 <b>¡Promoción Exclusiva!</b><br>Si recargas tu paquete ($150 a $400) durante 3 meses consecutivos, <b>el 4to mes te lo regalamos nosotros</b>. <br><small>Vigencia: Sep 2025 a Ene 2026.</small>";
        }

        // 5. Cobertura
        else if (lowerInput.includes('cobertura') || lowerInput.includes('señal') || lowerInput.includes('mapa') || lowerInput.includes('donde')) {
            response = "Usamos la red extendida de Movistar y AT&T con tecnología 5G. 📶 Tenemos cobertura garantizada en las principales ciudades y carreteras de México. Puedes verificar los mapas en la sección de abajo.";
        }

        // 6. HBO / Netflix / Video
        else if (lowerInput.includes('hbo') || lowerInput.includes('netflix') || lowerInput.includes('youtube') || lowerInput.includes('video')) {
            response = "¡Para los amantes del video! 🎬<br>Los paquetes desde <b>$300</b> incluyen más gigas dedicados para YouTube, Netflix y Prime Video. El de <b>$400</b> incluye también HBO Max.";
        }

        // 7. Portabilidad (Cambiar de compañía)
        else if (lowerInput.includes('portabilidad') || lowerInput.includes('cambiar') || lowerInput.includes('numero') || lowerInput.includes('número')) {
            response = "¡Vente con nosotros! Conservar tu número es gratis y rápido (24 hrs). Solo necesitas tu NIP de portabilidad y nosotros hacemos el trámite.";
        }

        // 8. Default (No entendió)
        else {
            response = "Mmm, no estoy seguro de haber entendido eso. 🤔 Intenta preguntarme sobre: <br>- 'Precios'<br>- 'Qué es eSIM'<br>- 'Cobertura'<br>- 'Promociones'";
        }

        // SIMULAR QUE ESTÁ ESCRIBIENDO (Retraso de 600ms)
        setTimeout(() => {
            addBotMessage(response);
        }, 600);
    }
});
