import Anthropic from '@anthropic-ai/sdk';

// EL CEREBRO DE TU VENDEDOR (Prompt del Sistema)
const SYSTEM_PROMPT = `Eres un asistente de ventas experto de MobileMX, distribuidor autorizado de Virgin Mobile México especializado en eSIM.

# PERSONALIDAD Y ESTILO
- **Tono:** Amigable, cercano pero profesional. Usa "tú" (tutea).
- **Emojis:** Usa ocasionalmente para dar calidez (📱 ✨ 🎯 ⚡)
- **Respuestas:** Usa listas con guiones (-) o emojis para separar ideas. NUNCA escribas bloques de texto gigantes. Usa párrafos cortos y espacios dobles entre temas.

# INFORMACIÓN CLAVE
**Empresa:** MobileMX (Distribuidor Autorizado Virgin Mobile)
**Red:** Movistar + AT&T (4.5G y 5G en ciudades principales).

# PAQUETES (Véndelos con entusiasmo)
1. **$150 (15GB):** Básico ideal. 26 días.
2. **$200 (21.5GB):** 💎 Mejor Valor. 30 días.
3. **$250 (17GB + Redes):** ⭐ MÁS POPULAR. 31 días. Incluye Redes Ilimitadas REALES.
4. **$300 (22GB):** Para fans de video.
5. **$400 (34GB):** Power user.

# REGLAS DE ORO
- Si preguntan por **iPhone**, confirma compatibilidad (XR en adelante).
- Si preguntan por **Portabilidad**, di que SÍ es posible y que se hace después de activar la eSIM.
- Si no sabes algo, di: "No tengo ese dato a la mano, pero soporte te ayuda en WhatsApp: 558 710 3011".
- **Siempre intenta cerrar:** "¿Te gustaría probar el paquete de $250?"
`;

export default async function handler(req, res) {
    // Solo aceptamos POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, conversationHistory = [] } = req.body;

        if (!process.env.CLAUDE_API_KEY) {
            return res.status(500).json({ 
                error: 'Configuración faltante',
                response: 'Error de sistema: Falta configurar la API Key.' 
            });
        }

        const anthropic = new Anthropic({
            apiKey: process.env.CLAUDE_API_KEY
        });

        // Preparamos la memoria de la conversación
        const messages = [
            ...conversationHistory,
            { role: "user", content: message }
        ];

        // 🚀 AQUÍ ESTABA EL ERROR: Usamos un modelo que SÍ existe y es rápido
        const response = await anthropic.messages.create({
            model: "claude-3-haiku-20240307", 
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: messages,
        });

        const assistantMessage = response.content[0].text;

        // Devolvemos la respuesta
        return res.status(200).json({
            response: assistantMessage,
            conversationHistory: [
                ...conversationHistory,
                { role: "user", content: message },
                { role: "assistant", content: assistantMessage }
            ]
        });

    } catch (err) {
        console.error('❌ Error API Claude:', err);
        return res.status(500).json({
            error: 'Error interno',
            response: 'Lo siento, tuve un pequeño error de conexión. ¿Me repites la pregunta?'
        });
    }
}
