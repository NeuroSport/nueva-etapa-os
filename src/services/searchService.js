import { localAI } from './localAIService';

/**
 * Servicio de Búsqueda Inteligente (Híbrido)
 * Intenta conectar con API externa, si falla usa IA Local + Fallback de datos.
 */
export const searchService = {
  async search(query, filters, userData) {
    const context = {
      location: "Alicante capital y provincia",
      budget: userData.budget || "bajo",
      withKid: filters.withKid || false,
      weather: filters.weather || "sol",
      energy: userData.energy || "media"
    };

    console.log("🔍 Iniciando búsqueda inteligente:", { query, filters });

    // 1. Intentar llamada a API Real (Serverless / Vercel)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, filters, context })
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn("Backend /api/search no detectado o fuera de línea. Usando IA Local.");
    }

    // 2. FALLBACK: Procesamiento con IA Local (Soberanía Digital)
    const prompt = `
      Actúa como experto en ocio en Alicante capital y provincia. 
      USUARIO BUSCA: "${query}"
      REGLAS DE FILTRO:
      - Ubicación: Alicante y alrededores.
      - Presupuesto: ${context.budget}.
      - Niños: ${context.withKid ? "Obligatorio planes aptos para niños" : "Planes adultos o generales"}.
      - Clima: ${context.weather === 'lluvia' ? "Solo planes de INTERIOR" : "Cualquier plan"}.
      
      IMPORTANTE: No te inventes lugares genéricos. Cita lugares reales (Castillo Santa Bárbara, Museo Volvo, Palmeral, Cuevas Canelobre, Playas, etc.)
      
      RESPONDE EXCLUSIVAMENTE CON UN JSON EN ESTE FORMATO:
      [
        {
          "title": "Nombre del lugar o plan",
          "description": "Breve recomendación personalizada",
          "location": "Zona o barrio",
          "type": "Museo/Restaurante/Ruta/Playa",
          "priceLevel": "Gratis/Barato/Medio",
          "suitableForKids": true,
          "indoor": true,
          "duration": "2h",
          "suggestedTime": "11:00"
        }
      ]
      
      DA MÁXIMO 4 RESULTADOS.
    `;

    try {
      const aiResponse = await localAI.generate([{ role: "user", content: prompt }]);
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Formato IA no válido");
    } catch (error) {
      console.error("Error en fallback IA:", error);
      // Mock de emergencia si falla la IA
      return [
        {
          title: "Castillo de Santa Bárbara",
          description: "Vistas increíbles y paseo histórico. Ideal con niños.",
          location: "Alicante Centro",
          type: "Turismo",
          priceLevel: "Gratis",
          suitableForKids: true,
          indoor: false,
          duration: "2h",
          suggestedTime: "10:30"
        },
        {
          title: "Museo Ocean Race",
          description: "Museo moderno e interactivo en el puerto. Ideal si llueve.",
          location: "Puerto Alicante",
          type: "Museo",
          priceLevel: "Barato",
          suitableForKids: true,
          indoor: true,
          duration: "1.5h",
          suggestedTime: "17:00"
        }
      ];
    }
  }
};
