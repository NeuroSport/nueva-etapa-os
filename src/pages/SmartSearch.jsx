import React, { useState } from 'react';
import Card from '../components/Card';
import { generateId } from '../utils';
import { 
  Search, MapPin, Baby, Euro, CloudRain, Sun, 
  Clock, Calendar, Star, Brain, Navigation, ChevronRight, X, Heart, Map, Sparkles,
  ClipboardList, AlertCircle
} from 'lucide-react';
import { searchService } from '../services/searchService';
import { aiActionEngine } from '../services/aiActionEngine';

export default function SmartSearch({ data, setData, showToast }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState("");
  const [filters, setFilters] = useState({
    withKid: true,
    budget: 'barato',
    weather: 'sol',
    zone: 'Alicante Capital',
    type: 'ocio',
    duration: 'media'
  });

  const handleSearch = async (quickQuery = null) => {
    const q = quickQuery || query;
    if (!q.trim()) return;
    
    setIsSearching(true);
    setSearchStatus("Iniciando buscador híbrido...");
    setResults([]);
    try {
      const found = await searchService.search(
        q, 
        filters, 
        data.alicantePlans || [], 
        (status) => setSearchStatus(status)
      );
      setResults(found);
    } catch (e) {
      showToast("Error en la búsqueda inteligente", "error");
    } finally {
      setIsSearching(false);
    }
  };

  const applyAction = (type, item) => {
    const payload = {
      title: item.title,
      description: item.description,
      location: item.location,
      lat: item.lat,
      lon: item.lon,
      category: item.type,
      date: new Date().toISOString().split('T')[0], // Fallback inicial
    };

    if (type === 'calendar') {
      aiActionEngine.applyAction({ type: 'create_calendar_event', payload }, data, setData);
      showToast("Evento programado", "success");
    } else if (type === 'task') {
      aiActionEngine.applyAction({ type: 'create_task', payload }, data, setData);
      showToast("Tarea creada", "success");
    } else if (type === 'daughter') {
      aiActionEngine.applyAction({ type: 'create_daughter_plan', payload }, data, setData);
      showToast("Añadido a planes con hija", "success");
    }
  };

  const openMap = (lat, lon) => {
    window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`, '_blank');
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
        <div className="ia-badge">IA EXPLORACIÓN REAL ALICANTE</div>
        <h1>🔎 Buscador de Vida</h1>
        <p>Encuentra lugares reales. Nada de datos inventados.</p>
        
        <div className="search-bar-container">
          <input 
            type="text" 
            placeholder="Ej: parque con columpios cerca de mi..." 
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
          <select className="f-select" value={filters.zone} onChange={e => setFilters({...filters, zone: e.target.value})}>
            <option value="Alicante Capital">Alicante Capital</option>
            <option value="Alicante Provincia">Provincia (Alrededores)</option>
          </select>

          <button className={`f-pill ${filters.withKid ? 'active' : ''}`} onClick={() => setFilters({...filters, withKid: !filters.withKid})}>
            <Baby size={14} /> {filters.withKid ? 'Con Niña' : 'Solo / Adultos'}
          </button>
          
          <button className={`f-pill ${filters.weather === 'lluvia' ? 'active' : ''}`} onClick={() => setFilters({...filters, weather: filters.weather === 'lluvia' ? 'sol' : 'lluvia'})}>
            {filters.weather === 'lluvia' ? <CloudRain size={14} /> : <Sun size={14} />} {filters.weather === 'lluvia' ? 'Apto Lluvia' : 'Todo / Exterior'}
          </button>
          
          <select className="f-select" value={filters.budget} onChange={e => setFilters({...filters, budget: e.target.value})}>
            <option value="gratis">Gratis 100%</option>
            <option value="barato">Barato / Económico</option>
            <option value="medio">Presupuesto Medio</option>
          </select>

          <select className="f-select" value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
            <option value="ocio">Cualquier Ocio</option>
            <option value="parque">Parque / Naturaleza</option>
            <option value="museo">Museo / Cultura</option>
            <option value="restaurante">Restaurante / Comida</option>
            <option value="ruta">Ruta Senderismo</option>
            <option value="playa">Playa / Costa</option>
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
            <p>{searchStatus || "La IA está rastreando opciones reales..."}</p>
          </div>
        )}

        {!isSearching && results.map((res, i) => (
          <Card key={i}>
            <div className="res-card">
              <div className="res-header">
                <div className="res-title-group">
                  <h3>{res.title}</h3>
                  <div className="res-meta-line">
                    <span className="res-source-tag">{res.source}</span>
                    <span className="res-type-tag">{res.type}</span>
                  </div>
                </div>
                {res.lat && res.lon && (
                  <button className="mini-map-btn" onClick={() => openMap(res.lat, res.lon)}>
                    <Map size={18} />
                  </button>
                )}
              </div>
              
              <p className="res-desc">{res.description}</p>
              
              <div className="res-meta-tags">
                <div className="meta-tag"><MapPin size={12} /> {res.location || "Alicante"}</div>
                <div className="meta-tag"><Euro size={12} /> {res.priceLevel}</div>
                {res.suitableForKids && <div className="meta-tag"><Baby size={12} /> Niños ✓</div>}
                {res.indoor && <div className="meta-tag"><CloudRain size={12} /> Interior</div>}
              </div>

              {!res.verified && (
                <div className="verification-warning">
                  <AlertCircle size={12} /> Horario/Precio no verificado hoy
                </div>
              )}
              
              <div className="res-actions-grid">
                <button className="btn-action-light" onClick={() => saveFavorite(res)}>
                  <Heart size={14} /> Favorito
                </button>
                <button className="btn-action-light" onClick={() => applyAction('calendar', res)}>
                  <Calendar size={14} /> Calendario
                </button>
                <button className="btn-action-light" onClick={() => applyAction('task', res)}>
                  <ClipboardList size={14} /> Tarea
                </button>
                <button className="btn-action-light" onClick={() => applyAction('daughter', res)}>
                  <Star size={14} /> Plan Hija
                </button>
              </div>
            </div>
          </Card>
        ))}

        {results.length === 0 && !isSearching && (
          <div className="search-placeholder">
            <Sparkles size={48} opacity={0.2} />
            <p>Escribe qué buscas o usa un acceso rápido.</p>
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
        .res-title-group h3 { margin: 0; font-size: 1.1rem; color: #1e293b; font-weight: 800; }
        .res-meta-line { display: flex; gap: 8px; margin-top: 4px; }
        .res-source-tag { font-size: 0.6em; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-weight: bold; color: #64748b; }
        .res-type-tag { font-size: 0.6em; background: #e0f2fe; padding: 2px 8px; border-radius: 4px; font-weight: 800; color: #0369a1; text-transform: uppercase; }
        
        .mini-map-btn { background: #e0f2fe; color: #0284c7; border: none; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .res-desc { font-size: 0.85em; margin: 0; line-height: 1.4; color: #475569; }
        
        .res-meta-tags { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px; background: #f8fafc; border-radius: 12px; }
        .meta-tag { display: flex; align-items: center; gap: 4px; font-size: 0.7em; font-weight: 700; color: #64748b; background: white; padding: 4px 8px; border-radius: 6px; border: 1px solid #e2e8f0; }
        
        .verification-warning { display: flex; align-items: center; gap: 6px; font-size: 0.65em; color: #f59e0b; font-weight: bold; padding: 0 5px; }
        
        .res-actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 5px; }
        .btn-action-light { 
          padding: 10px; border-radius: 12px; border: 1px solid #e2e8f0; background: white; 
          font-size: 0.75em; font-weight: bold; color: #475569; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-action-light:active { background: #f1f5f9; }

        .search-placeholder { text-align: center; padding: 80px 20px; opacity: 0.3; }
        .spinner-small { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
