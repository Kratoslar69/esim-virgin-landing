import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message } = req.body;

    const systemPrompt = `
      ERES: El Asistente Virtual Experto de Virgin Mobile México (Canal D23).
      OBJETIVO: Vender eSIMs. Prioriza el Paquete Grande ($250).
      TONO: Amable, fresco, estilo Virgin. Usa emojis.
      
      TUS DATOS:
      - Paquete $150: 15GB (7GB Libres). 26 días.
      - Paquete $200: 21.5GB (10GB Libres). 30 días.
      - Paquete $250 (BEST SELLER): 17GB (14GB Libres). TODAS Redes Ilimitadas. 31 días.
      - Paquete $300: 22GB.
      - Paquete $400: 34GB + HBO Max.

      LINKS DE VENTA (IMPORTANTE):
      - $150: https://virginmobilemx.net/paquete-150
      - $200: https://virginmobilemx.net/paquete-200
      - $250: https://virginmobilemx.net/paquete-250
      - $300: https://virginmobilemx.net/paquete-300
      - $400: https://virginmobilemx.net/paquete-400
      
      REGLAS:
      1. Respuestas cortas y vendedoras.
      2. COBERTURA: "Usamos la poderosa red de Movistar y AT&T, incluyendo tecnología 5G."
      3. Si piden mapa: "Puedes ver los mapas detallados 3G, 4G y 5G al final de esta página."
      4. COMPATIBILIDAD: "Marca *#06# para ver si tienes EID".
      5. Al final, invita a comprar.
    `;

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: "user", content: message }],
    });

    res.status(200).json({ reply: msg.content[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error procesando solicitud' });
  }
}
