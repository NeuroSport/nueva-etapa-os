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
      Filtros actuales: ${JSON.stringify(filters)}.
      
      Categorías Overpass válidas: "park", "museum", "restaurant", "beach", "route" (senderismo), "entertainment" (cine/ocio interior), "generic".
      
      Identifica:
      1. 'overpassType': La categoría más cercana.
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
        aiResponse = await chatWithAI([{ role: "user", content: prompt }]);
      }
      
      const match = aiResponse.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
      throw new Error("Formato IA inválido");
    } catch (e) {
      console.warn("Fallo análisis de intención, usando heurística:", e);
      let type = "generic";
      if (query.toLowerCase().includes("parque") || query.toLowerCase().includes("niño")) type = "park";
      if (query.toLowerCase().includes("comer") || query.toLowerCase().includes("restaurante")) type = "restaurant";
      if (query.toLowerCase().includes("museo") || query.toLowerCase().includes("cultura")) type = "museum";
      return { overpassType: type, radius: filters.zone === 'Alicante Capital' ? 8000 : 25000, budget: filters.budget || "medio" };
    }
  },

  async fetchOverpass(intent, filters) {
    const cacheKey = `overpass_${intent.overpassType}_${intent.radius}_${filters.weather}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsedCache = JSON.parse(cached);
      if (Date.now() - parsedCache.time < CACHE_TIME) {
        return parsedCache.data;
      }
    }

    let osmQueries = [];
    switch (intent.overpassType) {
      case 'park': osmQueries = [`node["leisure"="park"]`, `node["leisure"="playground"]`]; break;
      case 'museum': osmQueries = [`node["tourism"="museum"]`, `node["tourism"="gallery"]`]; break;
      case 'restaurant': osmQueries = [`node["amenity"="restaurant"]`, `node["amenity"="cafe"]`]; break;
      case 'beach': osmQueries = [`node["natural"="beach"]`]; break;
      case 'route': osmQueries = [`way["route"="hiking"]`, `node["tourism"="viewpoint"]`]; break;
      case 'entertainment': osmQueries = [`node["amenity"="cinema"]`, `node["amenity"="theatre"]`]; break;
      default: osmQueries = [`node["tourism"="attraction"]`, `node["historic"]`];
    }

    const queryBody = osmQueries.map(q => `${q}(around:${intent.radius},${ALICANTE_COORDS.lat},${ALICANTE_COORDS.lon});`).join('\n');
    const query = `[out:json][timeout:15]; (${queryBody}); out center 50;`;

    try {
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`
      });
      if (!res.ok) throw new Error("Overpass Error " + res.status);
      const data = await res.json();
      const elements = (data.elements || []).sort(() => Math.random() - 0.5);
      localStorage.setItem(cacheKey, JSON.stringify({ time: Date.now(), data: elements }));
      return elements;
    } catch (error) {
      console.error("Overpass falló:", error);
      return []; 
    }
  },

  formatOverpassResults(elements, intent, weather, filters) {
    return elements
      .filter(el => (el.tags?.name || el.tags?.["name:es"]))
      .map(el => {
        const name = el.tags?.name || el.tags?.["name:es"] || "Lugar interesante";
        let price = "Gratis / Público";
        let isVerified = false;
        if (el.tags?.fee === "yes") { price = "De Pago"; isVerified = true; }
        if (el.tags?.fee === "no") { price = "Gratis"; isVerified = true; }
        
        const isIndoor = el.tags?.indoor === "yes" || el.tags?.covered === "yes" || 
                         ['museum', 'gallery', 'cinema', 'theatre', 'restaurant', 'cafe'].includes(intent.overpassType);

        return {
          id: el.id,
          title: name,
          description: el.tags?.description || el.tags?.note || `Lugar real en Alicante: ${name}.`,
          location: el.tags?.["addr:street"] || "Alicante",
          municipality: el.tags?.["addr:city"] || "Alicante",
          type: el.tags?.tourism || el.tags?.amenity || el.tags?.leisure || "Punto de interés",
          priceLevel: price,
          isPriceVerified: isVerified,
          indoor: isIndoor,
          suitableForKids: el.tags?.["backcountry"] !== "yes" && (el.tags?.playground || filters.withKid),
          duration: intent.overpassType === 'route' ? "3h+" : "1-2h",
          source: "OpenStreetMap",
          lat: el.lat || el.center?.lat,
          lon: el.lon || el.center?.lon,
          suggestedTime: "11:00"
        };
      })
      .slice(0, 10);
  },

  async search(query, filters, localDataFallback, onProgress) {
    if (onProgress) onProgress("Consultando clima...");
    const weather = await this.getWeather();
    if (onProgress) onProgress("Analizando intención con IA...");
    const intent = await this.analyzeIntent(query, filters);
    if (onProgress) onProgress(`Buscando ${intent.overpassType} reales...`);
    const elements = await this.fetchOverpass(intent, filters);
    
    if (elements.length > 0) {
      if (onProgress) onProgress("Procesando resultados reales...");
      return this.formatOverpassResults(elements, intent, weather, filters);
    } else {
      if (onProgress) onProgress("Sin resultados reales. Usando datos locales...");
      return (localDataFallback || []).slice(0, 5).map(f => ({
        ...f,
        source: "AlicantePlans Local",
        isLocalFallback: true,
        priceLevel: f.priceCategory || "Gratis"
      }));
    }
  }
};
