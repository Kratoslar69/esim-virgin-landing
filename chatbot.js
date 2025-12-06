document.addEventListener('DOMContentLoaded', function() {
    // Referencias a los elementos del DOM
    const bubble = document.getElementById('chatbotBubble');
    const window = document.getElementById('chatbotWindow');
    const closeBtn = document.getElementById('closeChat');
    const form = document.getElementById('chatbotForm');
    const input = document.getElementById('chatbotInput');
    const messagesContainer = document.getElementById('chatMessages');
    const quickReplies = document.querySelectorAll('.quick-reply-btn');

    // Historial de conversación para Claude
    let conversationHistory = [];

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
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const messageText = input.value.trim();
        
        if (messageText) {
            addMessage(messageText, 'user');
            input.value = '';
            
            // Llamar a la API real de Claude
            showTypingIndicator();
            
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: messageText,
                        conversationHistory: conversationHistory
                    })
                });

                const data = await response.json();
                
                removeTypingIndicator();
                
                if (data.response) {
                    addMessage(data.response, 'bot');
                    // Actualizar historial
                    conversationHistory = data.conversationHistory || [];
                } else {
                    addMessage('Ocurrió un error. Por favor intenta de nuevo o contacta soporte: 558 710 3011', 'bot');
                }
            } catch (error) {
                removeTypingIndicator();
                console.error('Error:', error);
                addMessage('No puedo conectarme en este momento. Contacta soporte: 558 710 3011 📱', 'bot');
            }
        }
    });

    // Clic en respuestas rápidas
    quickReplies.forEach(btn => {
        btn.addEventListener('click', async function() {
            const text = this.innerText;
            addMessage(text, 'user');
            
            showTypingIndicator();
            
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: text,
                        conversationHistory: conversationHistory
                    })
                });

                const data = await response.json();
                
                removeTypingIndicator();
                
                if (data.response) {
                    addMessage(data.response, 'bot');
                    conversationHistory = data.conversationHistory || [];
                } else {
                    addMessage('Ocurrió un error. Contacta soporte: 558 710 3011', 'bot');
                }
            } catch (error) {
                removeTypingIndicator();
                console.error('Error:', error);
                addMessage('No puedo conectarme. Contacta soporte: 558 710 3011 📱', 'bot');
            }
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
