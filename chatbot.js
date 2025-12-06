document.addEventListener('DOMContentLoaded', function() {
    // 1. Referencias
    const bubble = document.getElementById('chatbotBubble');
    const windowChat = document.getElementById('chatbotWindow'); 
    const closeBtn = document.getElementById('closeChat');
    const form = document.getElementById('chatbotForm');
    const input = document.getElementById('chatbotInput');
    const messagesContainer = document.getElementById('chatMessages');
    const quickReplies = document.querySelectorAll('.quick-reply-btn');

    let conversationHistory = [];

    // 2. MENSAJE DE BIENVENIDA (Compacto y bonito)
    // Nota: Está todo en una línea para que no se "desparrame"
    const welcomeMessage = '¡Hola! 👋 Soy tu experto virtual Jarvis Mobilemx.<br><br>Estoy aquí para ayudarte con:<ul style="margin: 5px 0 5px 20px; padding: 0;"><li>Dudas sobre eSIM 📱</li><li>Cobertura 🗺️</li><li>Paquetes y Precios 💲</li></ul>¿Qué necesitas saber hoy?';

    // 3. Función para agregar mensajes (CON TRADUCTOR DE SALTOS DE LÍNEA)
    function addMessage(text, sender, isHTML = false) {
        const div = document.createElement('div');
        div.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        
        let formattedText = text;

        // Si es el BOT y NO es el mensaje de bienvenida (o sea, es la IA)
        if (!isHTML && sender === 'bot') {
            formattedText = formattedText
                .replace(/\n/g, '<br>') // TRUCO: Convierte Enters en <br>
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Convierte Negritas
        }

        const avatar = sender === 'bot' ? '<div class="message-avatar">🤖</div>' : '';
        const content = `<div class="message-content"><p>${formattedText}</p></div>`;
        
        div.innerHTML = sender === 'bot' ? avatar + content : content + avatar;
        messagesContainer.appendChild(div);
        scrollToBottom();
    }

    // 4. Iniciar chat
    if (messagesContainer.children.length === 0) {
        addMessage(welcomeMessage, 'bot', true); 
    }

    // 5. Abrir/Cerrar
    function openChat() {
        bubble.classList.add('hidden');
        windowChat.classList.add('open');
        setTimeout(() => input.focus(), 300);
    }
    function closeChat() {
        windowChat.classList.remove('open');
        bubble.classList.remove('hidden');
    }
    bubble.addEventListener('click', openChat);
    closeBtn.addEventListener('click', closeChat);

    // 6. Enviar mensaje
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const messageText = input.value.trim();
        if (messageText) {
            addMessage(messageText, 'user');
            input.value = '';
            showTypingIndicator();
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: messageText, conversationHistory: conversationHistory })
                });
                const data = await response.json();
                removeTypingIndicator();
                if (data.response) {
                    addMessage(data.response, 'bot'); // Aquí entra el traductor automático
                    conversationHistory = data.conversationHistory || [];
                }
            } catch (error) {
                removeTypingIndicator();
                addMessage('Error de conexión.', 'bot');
            }
        }
    });

    // 7. Respuestas rápidas
    quickReplies.forEach(btn => {
        btn.addEventListener('click', async function() {
            const text = this.innerText;
            addMessage(text, 'user');
            showTypingIndicator();
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text, conversationHistory: conversationHistory })
                });
                const data = await response.json();
                removeTypingIndicator();
                if (data.response) {
                    addMessage(data.response, 'bot');
                    conversationHistory = data.conversationHistory || [];
                }
            } catch (error) {
                removeTypingIndicator();
            }
        });
    });

    function showTypingIndicator() {
        const div = document.createElement('div');
        div.classList.add('message', 'bot-message', 'typing-indicator');
        div.id = 'typingIndicator';
        div.innerHTML = `<div class="message-avatar">🤖</div><div class="message-content"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
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
