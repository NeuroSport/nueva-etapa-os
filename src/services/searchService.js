import { localAI } from './localAIService';

// Constantes Alicante
const ALICANTE_COORDS = { lat: 38.3452, lon: -0.4815 };

// Configuración Caché (15 minutos)
const CACHE_TIME = 15 * 60 * 1000;

export const searchService = {
  
  async getWeather() {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${ALICANTE_COORDS.lat}&longitude=${ALICANTE_COORDS.lon}&current_weather=true`);
      if (!res.ok) throw new Error("Weather API failed");
      const data = await res.json();
      return {
        temp: data.current_weather.temperature,
        code: data.current_weather.weathercode,
        isRaining: [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(data.current_weather.weathercode),
        description: data.current_weather.temperature + "°C"
      };
    } catch (error) {
      console.warn("No se pudo obtener el clima:", error);
      return { temp: 20, isRaining: false, description: "Desconocido (Error API)" };
    }
  },

  async analyzeIntent(query, filters) {
    const prompt = `
      Analiza esta búsqueda de ocio en Alicante: "${query}".
      Filtros: ${JSON.stringify(filters)}.
      Identifica:
      1. 'overpassType': "park", "museum", "restaurant", "beach", o "generic" (para monumentos/atracciones).
      2. 'radius': en metros (ej: 5000 para capital, 30000 para provincia).
      3. 'budget': "gratis", "barato", "medio".
      
      RESPONDE SOLO JSON:
      {"overpassType": "...", "radius": 5000, "budget": "..."}
    `;
    
    try {
      let aiResponse;
      if (localAI.getLoaded()) {
        aiResponse = await localAI.generate([{ role: "user", content: prompt }]);
      } else {
        // Fallback rápido si IA no cargó
        aiResponse = '{"overpassType": "generic", "radius": 10000, "budget": "medio"}';
      }
      
      const match = aiResponse.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
      throw new Error("Formato IA inválido");
    } catch (e) {
      console.warn("Fallo análisis de intención, usando default:", e);
      return { overpassType: "generic", radius: 10000, budget: filters.budget || "medio" };
    }
  },

  async fetchOverpass(intent) {
    const cacheKey = `overpass_${intent.overpassType}_${intent.radius}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsedCache = JSON.parse(cached);
      if (Date.now() - parsedCache.time < CACHE_TIME) {
        return parsedCache.data;
      }
    }

    let nodeQuery = `node["tourism"="attraction"]`;
    if (intent.overpassType === 'park') nodeQuery = `node["leisure"="park"]`;
    if (intent.overpassType === 'museum') nodeQuery = `node["tourism"="museum"]`;
    if (intent.overpassType === 'restaurant') nodeQuery = `node["amenity"="restaurant"]`;
    if (intent.overpassType === 'beach') nodeQuery = `node["natural"="beach"]`;

    // Radio centrado en Alicante
    const query = `
      [out:json][timeout:5];
      (
        ${nodeQuery}(around:${intent.radius},${ALICANTE_COORDS.lat},${ALICANTE_COORDS.lon});
      );
      out body 15;
    `;

    const url = "https://overpass-api.de/api/interpreter";
    try {
      const res = await fetch(url, {
        method: "POST",
        body: query
      });
      if (!res.ok) throw new Error("Overpass devolvió error");
      const data = await res.json();
      
      localStorage.setItem(cacheKey, JSON.stringify({ time: Date.now(), data: data.elements }));
      return data.elements;
    } catch (error) {
      console.error("Overpass falló:", error);
      return []; // Fallback empty
    }
  },

  formatOverpassResults(elements, intent, weather, filters) {
    return elements.map(el => {
      const name = el.tags?.name || "Lugar sin nombre";
      
      // Estimar precio
      let price = "Gratis";
      if (intent.budget === "barato" || intent.overpassType === 'restaurant') price = "Económico (Precio estimado)";
      if (intent.budget === "medio") price = "Pago Medio";

      return {
        id: el.id,
        title: name,
        description: `Encontrado vía satélite. Categoría: ${intent.overpassType}. ${weather.isRaining && filters.indoor ? 'Sugerido por ser apto para lluvia.' : ''}`,
        location: "Alicante",
        municipality: "Alicante",
        type: intent.overpassType === "generic" ? "Atracción" : intent.overpassType,
        priceLevel: price,
        indoor: intent.overpassType === "museum" || intent.overpassType === "restaurant",
        suitableForKids: filters.withKid,
        duration: "1.5h - 2h",
        source: "OpenStreetMap",
        lat: el.lat,
        lon: el.lon,
        suggestedTime: "11:00"
      };
    }).filter(el => el.title !== "Lugar sin nombre").slice(0, 5); // Max 5
  },

  async search(query, filters, localDataFallback, onProgress) {
    console.log("🔍 Buscador Real Iniciado:", { query, filters });
    
    // 1. Clima
    if (onProgress) onProgress("Consultando clima...");
    const weather = await this.getWeather();
    
    // 2. Intención IA
    if (onProgress) onProgress("Filtrando con IA...");
    const intent = await this.analyzeIntent(query, filters);
    
    // 3. API Geográfica
    if (onProgress) onProgress("Buscando lugares reales en OpenStreetMap...");
    const elements = await this.fetchOverpass(intent);
    
    // 4. Formatear y decidir Fallback
    if (elements.length > 0) {
      return this.formatOverpassResults(elements, intent, weather, filters);
    } else {
      if (onProgress) onProgress("Usando datos locales seguros...");
      // FALLBACK LOCAL
      const fallbacks = localDataFallback || [];
      return fallbacks.slice(0, 3).map(f => ({
        ...f,
        source: "AlicantePlans Local",
        description: f.notes || f.description,
        location: f.zone || f.location,
        priceLevel: f.priceCategory || "Gratis"
      }));
    }
  }
};
