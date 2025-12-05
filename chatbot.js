/* ===================================================================
   CHATBOT FRONTEND - JavaScript
   Archivo: chatbot.js (subir a la raíz de tu repo)
   =================================================================== */

class ChatbotWidget {
    constructor() {
        this.isOpen = false;
        this.conversationHistory = [];
        this.isTyping = false;
        
        this.init();
    }

    init() {
        this.createWidget();
        this.attachEventListeners();
        console.log('🤖 Chatbot inicializado');
    }

    createWidget() {
        // HTML del widget completo
        const widgetHTML = `
            <!-- Botón flotante -->
            <div class="chatbot-bubble" id="chatbotBubble">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span class="bubble-badge">¿Dudas?</span>
            </div>

            <!-- Ventana del chat -->
            <div class="chatbot-window" id="chatbotWindow">
                <div class="chatbot-header">
                    <div class="header-info">
                        <div class="header-avatar">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                            </svg>
                        </div>
                        <div class="header-text">
                            <div class="header-title">Asistente Virgin Mobile</div>
                            <div class="header-status">
                                <span class="status-dot"></span>
                                En línea
                            </div>
                        </div>
                    </div>
                    <button class="close-btn" id="closeChatbot">✕</button>
                </div>

                <div class="chatbot-messages" id="chatbotMessages">
                    <div class="message bot-message">
                        <div class="message-avatar">🤖</div>
                        <div class="message-content">
                            <p>¡Hola! 👋 Soy tu asistente de Virgin Mobile.</p>
                            <p>Puedo ayudarte a:</p>
                            <ul>
                                <li>Elegir el mejor paquete para ti</li>
                                <li>Verificar compatibilidad de tu dispositivo</li>
                                <li>Explicar el proceso de activación</li>
                                <li>Responder dudas sobre portabilidad</li>
                            </ul>
                            <p>¿En qué te puedo ayudar?</p>
                        </div>
                    </div>
                </div>

                <div class="chatbot-quick-replies" id="quickReplies">
                    <button class="quick-reply-btn" data-message="¿Cuál paquete me conviene?">
                        💡 ¿Cuál me conviene?
                    </button>
                    <button class="quick-reply-btn" data-message="¿Mi celular es compatible con eSIM?">
                        📱 ¿Es compatible?
                    </button>
                    <button class="quick-reply-btn" data-message="¿Cómo funciona la activación?">
                        ⚡ ¿Cómo activar?
                    </button>
                </div>

                <div class="chatbot-input-area">
                    <form id="chatbotForm">
                        <input 
                            type="text" 
                            id="chatbotInput" 
                            placeholder="Escribe tu pregunta..."
                            autocomplete="off"
                        />
                        <button type="submit" class="send-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        `;

        // Insertar en el body
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    attachEventListeners() {
        // Abrir/cerrar chatbot
        document.getElementById('chatbotBubble').addEventListener('click', () => {
            this.toggleChat();
        });

        document.getElementById('closeChatbot').addEventListener('click', () => {
            this.toggleChat();
        });

        // Enviar mensaje
        document.getElementById('chatbotForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        // Botones de respuesta rápida
        document.querySelectorAll('.quick-reply-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const message = e.target.getAttribute('data-message');
                this.sendQuickReply(message);
            });
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            const chatWindow = document.getElementById('chatbotWindow');
            const chatBubble = document.getElementById('chatbotBubble');
            
            if (this.isOpen && 
                !chatWindow.contains(e.target) && 
                !chatBubble.contains(e.target)) {
                this.toggleChat();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('chatbotWindow');
        const bubble = document.getElementById('chatbotBubble');

        if (this.isOpen) {
            window.classList.add('open');
            bubble.classList.add('hidden');
            document.getElementById('chatbotInput').focus();
        } else {
            window.classList.remove('open');
            bubble.classList.remove('hidden');
        }
    }

    sendQuickReply(message) {
        document.getElementById('chatbotInput').value = message;
        this.sendMessage();
        
        // Ocultar botones rápidos después del primer uso
        document.getElementById('quickReplies').style.display = 'none';
    }

    async sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();

        if (!message || this.isTyping) return;

        // Agregar mensaje del usuario
        this.addMessage(message, 'user');
        input.value = '';

        // Mostrar indicador de "escribiendo..."
        this.showTypingIndicator();

        try {
            // Llamar a la API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversationHistory: this.conversationHistory
                })
            });

            const data = await response.json();

            // Quitar indicador
            this.hideTypingIndicator();

            if (response.ok) {
                // Agregar respuesta del bot
                this.addMessage(data.response, 'bot');
                
                // Actualizar historial
                this.conversationHistory = data.conversationHistory || [];
            } else {
                // Error
                this.addMessage(
                    data.response || 'Lo siento, ocurrió un error. Por favor intenta de nuevo.',
                    'bot'
                );
            }

        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            this.hideTypingIndicator();
            this.addMessage(
                'No pude conectarme al servidor. Verifica tu conexión e intenta de nuevo.',
                'bot'
            );
        }
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbotMessages');
        
        const messageHTML = `
            <div class="message ${sender}-message">
                <div class="message-avatar">${sender === 'user' ? '👤' : '🤖'}</div>
                <div class="message-content">
                    ${this.formatMessage(text)}
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        
        // Scroll al final
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    formatMessage(text) {
        // Convertir URLs en links
        text = text.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank">$1</a>'
        );

        // Convertir **texto** en negrita
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Convertir saltos de línea
        text = text.replace(/\n/g, '<br>');

        return `<p>${text}</p>`;
    }

    showTypingIndicator() {
        this.isTyping = true;
        const messagesContainer = document.getElementById('chatbotMessages');
        
        const typingHTML = `
            <div class="message bot-message typing-indicator" id="typingIndicator">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }
}

// Inicializar chatbot cuando cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    new ChatbotWidget();
});
