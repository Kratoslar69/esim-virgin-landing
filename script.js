document.addEventListener('DOMContentLoaded', function() {
    console.log("Iniciando carga del Chatbot...");

    // 1. DEFINIR EL HTML DEL CHAT
    const chatHTML = `
        <div id="chat-widget">
            <div id="chat-header">
                <span>Asistente Virgin</span>
                <button id="close-chat" style="background:none; border:none; color:white; font-size:1.5rem; cursor:pointer;">×</button>
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

    // 2. INYECTARLO EN EL DOM
    const chatContainer = document.createElement('div');
    chatContainer.innerHTML = chatHTML;
    document.body.appendChild(chatContainer);
    console.log("HTML del chat inyectado.");

    // 3. OBTENER ELEMENTOS (CON VERIFICACIÓN)
    const toggleBtn = document.getElementById('chat-toggle');
    const widget = document.getElementById('chat-widget');
    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-btn');
    const input = document.getElementById('user-input');
    const messages = document.getElementById('chat-messages');

    // Verificación de seguridad
    if (!toggleBtn || !widget || !closeBtn || !sendBtn || !input) {
        console.error("Error crítico: No se encontraron los elementos del chat.");
        return; // Detiene el script para evitar el error rojo
    }

    // 4. FUNCIONES
    function toggleChat() {
        const isVisible = widget.style.display === 'flex';
        widget.style.display = isVisible ? 'none' : 'flex';
        // Foco automático al abrir
        if (!isVisible) setTimeout(() => input.focus(), 100);
    }

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // UI Usuario
        addMessage(text, 'user');
        input.value = '';
        input.disabled = true;

        // UI Bot Pensando
        const loadingDiv = addMessage('Analizando...', 'bot loading');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            
            const data = await response.json();
            loadingDiv.remove(); // Quitar "Analizando..."
            
            if (data.reply) {
                addMessage(data.reply, 'bot');
            } else {
                addMessage('Lo siento, hubo un error de conexión. Intenta de nuevo.', 'bot');
            }
        } catch (error) {
            console.error(error);
            loadingDiv.remove();
            addMessage('Error técnico. Por favor refresca la página.', 'bot');
        }
        
        input.disabled = false;
        input.focus();
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        // Convertir links en clicables
        div.innerHTML = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color:white;text-decoration:underline;">$1</a>');
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    }

    // 5. EVENTOS
    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    console.log("Chatbot cargado y listo.");
});
####
