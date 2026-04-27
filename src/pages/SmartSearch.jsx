import React, { useState } from 'react';
import Card from '../components/Card';
import { 
  Search, MapPin, Baby, Euro, CloudRain, Sun, 
  Clock, Calendar, Star, Brain, Navigation, ChevronRight, X
} from 'lucide-react';
import { searchService } from '../services/searchService';

export default function SmartSearch({ data, setData, showToast }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    withKid: true,
    budget: 'barato',
    weather: 'sol',
    zone: 'Alicante Capital'
  });

  const handleSearch = async (quickQuery = null) => {
    const q = quickQuery || query;
    if (!q.trim()) return;
    
    setIsSearching(true);
    setResults([]); // Limpiar previos
    try {
      const found = await searchService.search(q, filters, {
        budget: data.settings?.privacyMode ? "medio" : "bajo",
        energy: "alta"
      });
      setResults(found);
    } catch (e) {
      showToast("Error en la búsqueda inteligente", "error");
    } finally {
      setIsSearching(false);
    }
  };

  const scheduleEvent = (item) => {
    const newEvent = {
      id: Date.now(),
      title: item.title,
      date: new Date().toISOString().split('T')[0],
      startTime: item.suggestedTime || "11:00",
      endTime: "13:00",
      category: "Ocio",
      notes: `${item.description}\nUbicación: ${item.location}`,
      important: false,
      completed: false
    };
    setData({ ...data, calendarEvents: [...(data.calendarEvents || []), newEvent] });
    showToast("Añadido al calendario", "success");
  };

  const quickButtons = [
    { label: "Plan Hija hoy", icon: Baby, query: "Qué hacer con mi hija hoy en Alicante" },
    { label: "Plan barato", icon: Euro, query: "Planes gratis o baratos Alicante" },
    { label: "Plan si llueve", icon: CloudRain, query: "Actividades interior Alicante lluvia" },
    { label: "Ruta corta", icon: Navigation, query: "Ruta senderismo fácil 3-5km Alicante" },
  ];

  return (
    <div className="page smart-search-page page-transition">
      <div className="search-hero">
        <div className="ia-badge">IA RECOMENDACIÓN ACTIVA</div>
        <h1>🔎 Buscador de Vida</h1>
        <p>Encuentra qué hacer hoy en Alicante según tu realidad.</p>
        
        <div className="search-bar-container">
          <input 
            type="text" 
            placeholder="Ej: plan con mi hija el sábado..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSearch()}
          />
          {query && <button className="clear-btn" onClick={() => setQuery("")}><X size={18} /></button>}
          <button className="main-search-btn" onClick={() => handleSearch()} disabled={isSearching}>
            {isSearching ? <div className="spinner-small" /> : <Search size={20} />}
          </button>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-scroll">
          <button className={`f-pill ${filters.withKid ? 'active' : ''}`} onClick={() => setFilters({...filters, withKid: !filters.withKid})}>
            <Baby size={14} /> Con Niña
          </button>
          <button className={`f-pill ${filters.weather === 'lluvia' ? 'active' : ''}`} onClick={() => setFilters({...filters, weather: filters.weather === 'lluvia' ? 'sol' : 'lluvia'})}>
            {filters.weather === 'lluvia' ? <CloudRain size={14} /> : <Sun size={14} />} Interior
          </button>
          <select className="f-select" value={filters.budget} onChange={e => setFilters({...filters, budget: e.target.value})}>
            <option value="gratis">Gratis</option>
            <option value="barato">Económico</option>
            <option value="medio">Presupuesto Medio</option>
          </select>
        </div>
      </div>

      <div className="quick-access-grid">
        {quickButtons.map((btn, i) => (
          <button key={i} className="qa-btn" onClick={() => handleSearch(btn.query)}>
            <div className="qa-icon"><btn.icon size={18} /></div>
            <span>{btn.label}</span>
          </button>
        ))}
      </div>

      <div className="search-results">
        {isSearching && (
          <div className="searching-state">
            <Brain className="pulse-icon" size={40} color="#6366f1" />
            <p>La IA está rastreando opciones para ti...</p>
          </div>
        )}

        {!isSearching && results.map((res, i) => (
          <Card key={i}>
            <div className="res-card">
              <div className="res-header">
                <h3>{res.title}</h3>
                <span className="res-type">{res.type}</span>
              </div>
              <p className="res-desc">{res.description}</p>
              <div className="res-meta">
                <div className="meta-item"><MapPin size={12} /> {res.location}</div>
                <div className="meta-item"><Euro size={12} /> {res.priceLevel}</div>
                <div className="meta-item"><Clock size={12} /> {res.duration}</div>
              </div>
              <div className="res-actions">
                <button className="btn-save"><Star size={16} /> Guardar</button>
                <button className="btn-plan" onClick={() => scheduleEvent(res)}>
                  <Calendar size={16} /> Programar
                </button>
              </div>
            </div>
          </Card>
        ))}

        {results.length === 0 && !isSearching && (
          <div className="search-placeholder">
            <Sparkles size={48} opacity={0.2} />
            <p>Escribe qué te apetece o usa un acceso rápido.</p>
          </div>
        )}
      </div>

      <style>{`
        .smart-search-page { padding: 15px; padding-bottom: 90px; }
        .search-hero { margin-bottom: 25px; text-align: center; }
        .ia-badge { display: inline-block; background: #e0e7ff; color: #4338ca; font-size: 0.6em; font-weight: 800; padding: 4px 12px; border-radius: 20px; margin-bottom: 10px; }
        .search-hero h1 { font-size: 1.8rem; margin: 0; font-weight: 800; color: #0f172a; }
        .search-hero p { font-size: 0.85em; opacity: 0.6; margin-top: 5px; }

        .search-bar-container { 
          margin-top: 20px; display: flex; gap: 10px; background: white; 
          padding: 8px; border-radius: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          border: 1px solid var(--border); align-items: center;
        }
        .search-bar-container input { flex-grow: 1; border: none; padding: 10px 15px; font-size: 1rem; outline: none; background: transparent; color: var(--text); }
        .clear-btn { background: none; border: none; opacity: 0.3; padding: 5px; }
        .main-search-btn { background: var(--primary); color: white; border: none; width: 48px; height: 48px; border-radius: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .main-search-btn:active { transform: scale(0.9); }

        .filter-section { margin-bottom: 20px; }
        .filter-scroll { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; }
        .f-pill { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: white; border: 1px solid var(--border); border-radius: 20px; font-size: 0.75em; font-weight: bold; white-space: nowrap; color: var(--text); }
        .f-pill.active { background: var(--primary); color: white; border-color: var(--primary); }
        .f-select { background: white; border: 1px solid var(--border); padding: 8px 12px; border-radius: 20px; font-size: 0.75em; font-weight: bold; color: var(--text); outline: none; }

        .quick-access-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 25px; }
        .qa-btn { background: none; border: none; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; }
        .qa-icon { width: 45px; height: 45px; background: white; border: 1px solid var(--border); border-radius: 15px; display: flex; align-items: center; justify-content: center; color: var(--primary); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .qa-btn span { font-size: 0.6em; font-weight: bold; color: #64748b; text-align: center; }
        
        .searching-state { text-align: center; padding: 40px 0; }
        .pulse-icon { animation: pulse 1.5s infinite; margin-bottom: 15px; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.1); } }

        .res-card { display: flex; flex-direction: column; gap: 12px; }
        .res-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .res-header h3 { margin: 0; font-size: 1.1rem; color: #1e293b; font-weight: 800; }
        .res-type { font-size: 0.6em; background: #e0f2fe; padding: 4px 10px; border-radius: 8px; font-weight: 900; color: #0369a1; text-transform: uppercase; }
        .res-desc { font-size: 0.85em; margin: 0; line-height: 1.4; color: #475569; }
        .res-meta { display: flex; flex-wrap: wrap; gap: 15px; padding: 10px; background: #f8fafc; border-radius: 12px; }
        .meta-item { display: flex; align-items: center; gap: 6px; font-size: 0.7em; font-weight: 700; color: #64748b; }
        
        .res-actions { display: flex; gap: 10px; margin-top: 5px; }
        .res-actions button { flex: 1; padding: 14px; border-radius: 14px; border: none; font-size: 0.8em; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
        .btn-save { background: #f1f5f9; color: #475569; }
        .btn-plan { background: #1e293b; color: white; box-shadow: 0 4px 12px rgba(30, 41, 59, 0.2); }
        .btn-plan:active { transform: scale(0.95); }

        .search-placeholder { text-align: center; padding: 80px 20px; opacity: 0.3; }
        .spinner-small { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
