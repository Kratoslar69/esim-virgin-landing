document.addEventListener('DOMContentLoaded', function() {
    // Referencias a los elementos del DOM
    const bubble = document.getElementById('chatbotBubble');
    const window = document.getElementById('chatbotWindow');
    const closeBtn = document.getElementById('closeChat');
    const form = document.getElementById('chatbotForm');
    const input = document.getElementById('chatbotInput');
    const messagesContainer = document.getElementById('chatMessages');
    const quickReplies = document.querySelectorAll('.quick-reply-btn');

    // Función para abrir el chat
    function openChat() {
        bubble.classList.add('hidden');
        window.classList.add('open');
        // Enfocar el input
        setTimeout(() => input.focus(), 300);
    }

    // Función para cerrar el chat
    function closeChat() {
        window.classList.remove('open');
        bubble.classList.remove('hidden');
    }

    // Event Listeners
    bubble.addEventListener('click', openChat);
    closeBtn.addEventListener('click', closeChat);

    // Enviar mensaje
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const messageText = input.value.trim();
        
        if (messageText) {
            addMessage(messageText, 'user');
            input.value = '';
            
            // Simular respuesta del bot (borrar esto cuando conectes tu API real)
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addMessage("¡Gracias por escribirnos! En este momento estoy en modo demostración. Pronto podré responderte con IA real.", 'bot');
            }, 1500);
        }
    });

    // Clic en respuestas rápidas
    quickReplies.forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.innerText;
            addMessage(text, 'user');
            
            // Lógica simple para respuestas rápidas
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                if(text.includes('eSIM')) {
                    addMessage("Una eSIM es un chip virtual que ya viene en tu teléfono. ¡Te la enviamos por email y la activas con un código QR! Sin plásticos ni envíos.", 'bot');
                } else if(text.includes('Cobertura')) {
                    addMessage("Usamos la red compartida de Movistar y AT&T con tecnología 5G. Puedes verificar los mapas más arriba en esta página.", 'bot');
                } else {
                    addMessage("Claro, revisa nuestra sección de paquetes para ver las mejores ofertas.", 'bot');
                }
            }, 1000);
        });
    });

    // Funciones auxiliares de UI
    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        
        const avatar = sender === 'bot' ? '<div class="message-avatar">🤖</div>' : '';
        const content = `<div class="message-content"><p>${text}</p></div>`;
        
        div.innerHTML = sender === 'bot' ? avatar + content : content + avatar;
        messagesContainer.appendChild(div);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const div = document.createElement('div');
        div.classList.add('message', 'bot-message', 'typing-indicator');
        div.id = 'typingIndicator';
        div.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-dots"><span></span><span></span><span></span></div>
            </div>
        `;
        messagesContainer.appendChild(div);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});
