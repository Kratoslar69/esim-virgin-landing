document.addEventListener('DOMContentLoaded', function() {
    
    // 1. INYECTAR EL HTML DEL CHAT (Burbuja y Ventana)
    const chatHTML = `
        <div id="chat-widget">
            <div id="chat-header">
                <span>Asistente Virgin</span>
                <button id="close-chat">×</button>
            </div>
            <div id="chat-messages">
                <div class="message bot">
                    Hola 👋 Soy el experto virtual de Virgin Mobile.
                    <br><br>Puedo ayudarte con:
                    <br>• Cobertura y Mapas 🗺️
                    <br>• Precios de Paquetes 💲
                    <br>• Configuración de eSIM ⚙️
                    <br><br>¿Qué necesitas saber hoy?
                </div>
            </div>
            <div id="input-area">
                <input type="text" id="user-input" placeholder="Escribe tu duda aquí..." autocomplete="off">
                <button id="send-btn">➤</button>
            </div>
        </div>
        <button id="chat-toggle">💬 Asistente IA</button>
    `;
    
    // Crear el contenedor y pegarlo en el cuerpo de la página
    const div = document.createElement('div');
    div.id = 'chat-container';
    div.innerHTML = chatHTML;
    document.body.appendChild(div);

    // 2. OBTENER ELEMENTOS
    const toggleBtn = document.getElementById('chat-toggle');
    const widget = document.getElementById('chat-widget');
    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-btn');
    const input = document.getElementById('user-input');
    const messages = document.getElementById('chat-messages');

    // 3. FUNCIONES DE INTERACCIÓN
    // Abrir/Cerrar
    function toggleChat() {
        const isVisible = widget.style.display === 'flex';
        widget.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible) setTimeout(() => input.focus(), 100);
    }

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Enviar Mensaje
    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // Mostrar mensaje del usuario
        addMessage(text, 'user');
        input.value = '';
        input.disabled = true;

        // Mostrar "Escribiendo..."
        const loadingDiv = addMessage('Analizando...', 'bot loading');

        try {
            // Conectar con el cerebro (api/chat.js)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            
            const data = await response.json();
            
            // Quitar loading y mostrar respuesta
            loadingDiv.remove();
            
            if (data.error) {
                addMessage('Lo siento, tuve un pequeño error técnico. Intenta de nuevo.', 'bot');
            } else {
                addMessage(data.reply, 'bot');
            }
            
        } catch (error) {
            console.error('Error:', error);
            loadingDiv.remove();
            addMessage('Error de conexión. Revisa tu internet.', 'bot');
        }
        
        input.disabled = false;
        input.focus();
    }

    // Eventos de envío
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Función auxiliar para agregar mensajes al chat
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        
        // Convertir links en clicables
        const linkedText = text.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" style="color:white; text-decoration:underline;">$1</a>'
        );
        
        msgDiv.innerHTML = linkedText;
        messages.appendChild(msgDiv);
        
        // Auto-scroll hacia abajo
        messages.scrollTop = messages.scrollHeight;
        
        return msgDiv;
    }
});
