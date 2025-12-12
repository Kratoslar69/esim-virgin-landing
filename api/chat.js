document.addEventListener('DOMContentLoaded', function() {
    const chatBubble = document.getElementById('chatbotBubble');
    const chatWindow = document.getElementById('chatbotWindow');
    const closeBtn = document.getElementById('closeChat');
    const chatForm = document.getElementById('chatbotForm');
    const chatInput = document.getElementById('chatbotInput');
    const chatMessages = document.getElementById('chatMessages');
    const quickReplies = document.querySelectorAll('.quick-reply-btn');

    // ABRIR/CERRAR
    chatBubble.addEventListener('click', () => {
        chatWindow.classList.add('active');
        chatBubble.style.display = 'none';
        chatInput.focus();
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('active');
        chatBubble.style.display = 'flex';
    });

    // ENVIAR MENSAJE
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userText = chatInput.value.trim();
        if (userText) {
            addUserMessage(userText);
            chatInput.value = '';
            processClaudeResponse(userText); // Llamada a la IA
        }
    });

    // BOTONES RÁPIDOS
    quickReplies.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const text = e.target.innerText.replace('📲 ', '').replace('🗺️ ', '').replace('💲 ', '');
            addUserMessage(text);
            processClaudeResponse(text);
        });
    });

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
        // Convertimos saltos de línea en <br> para que se vea bien
        const formattedText = text.replace(/\n/g, '<br>');
        div.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content"><p>${formattedText}</p></div>
        `;
        chatMessages.appendChild(div);
        scrollToBottom();
    }

    function addTypingIndicator() {
        const div = document.createElement('div');
        div.className = 'message bot-message typing';
        div.id = 'typingIndicator';
        div.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content"><p>Escribiendo...</p></div>
        `;
        chatMessages.appendChild(div);
        scrollToBottom();
        return div;
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // === CONEXIÓN CON CLAUDE VÍA VERCEL ===
    async function processClaudeResponse(message) {
        const typing = addTypingIndicator(); // Muestra "Escribiendo..."

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            
            // Borramos el indicador de escribiendo
            typing.remove();

            if (data.reply) {
                addBotMessage(data.reply);
            } else {
                addBotMessage("Lo siento, estoy teniendo problemas de conexión. Intenta más tarde.");
            }

        } catch (error) {
            typing.remove();
            addBotMessage("Error de red. Verifica tu conexión.");
        }
    }
});
