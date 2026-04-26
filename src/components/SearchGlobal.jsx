import { useState, useMemo } from "react";
import { Search, X, Calendar, CheckSquare, Euro, MapPin, Target, ChevronRight } from "lucide-react";

export default function SearchGlobal({ data, setPage, onClose }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    
    const matches = [];

    // Tareas
    data.tasks.forEach(t => {
      if (t.title.toLowerCase().includes(q)) {
        matches.push({ type: 'task', title: t.title, date: t.plannedDate, icon: CheckSquare, page: 'tasks', color: '#3b82f6' });
      }
    });

    // Calendario
    (data.calendarEvents || []).forEach(e => {
      if (e.title.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q)) {
        matches.push({ type: 'event', title: e.title, date: e.date, icon: Calendar, page: 'calendar', color: '#10b981' });
      }
    });

    // Gastos
    (data.expenses || []).forEach(e => {
      if (e.title.toLowerCase().includes(q)) {
        matches.push({ type: 'expense', title: e.title, date: e.date, icon: Euro, page: 'economy', color: '#ef4444', amount: e.amount });
      }
    });

    // Planes Alicante
    (data.alicantePlans || []).forEach(p => {
      if (p.name.toLowerCase().includes(q) || p.zone.toLowerCase().includes(q)) {
        matches.push({ type: 'plan', title: p.name, date: p.zone, icon: MapPin, page: 'pro-alicante', color: '#06b6d4' });
      }
    });

    // Objetivos
    (data.goals || []).forEach(g => {
      if (g.title.toLowerCase().includes(q)) {
        matches.push({ type: 'goal', title: g.title, date: g.category, icon: Target, page: 'goals', color: '#8b5cf6' });
      }
    });

    return matches;
  }, [query, data]);

  const handleGo = (page) => {
    setPage(page);
    onClose();
  };

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal modal-transition" onClick={e => e.stopPropagation()}>
        <div className="search-header">
          <Search size={20} color="var(--muted)" />
          <input 
            autoFocus
            type="text" 
            placeholder="Buscar tareas, eventos, gastos..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ border: 'none', margin: 0, padding: '10px 0' }}
          />
          <button onClick={onClose} style={{ width: 'auto', background: 'none', color: 'var(--muted)', padding: '5px' }}>
            <X size={20} />
          </button>
        </div>

        <div className="search-results">
          {query.length > 0 && query.length < 2 && <p style={{ textAlign: 'center', opacity: 0.5 }}>Escribe al menos 2 caracteres...</p>}
          
          {results.length > 0 ? (
            results.map((res, idx) => (
              <div key={idx} className="list-item tap-target" onClick={() => handleGo(res.page)}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ background: res.color + '15', padding: 8, borderRadius: 10, color: res.color }}>
                    <res.icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9em' }}>{res.title}</div>
                    <div style={{ fontSize: '0.75em', opacity: 0.6 }}>{res.date} {res.amount ? `· ${res.amount}€` : ''}</div>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--muted)" />
              </div>
            ))
          ) : query.length >= 2 && (
            <p style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>No se han encontrado resultados para "{query}"</p>
          )}
        </div>
      </div>

      <style>{`
        .list-item:active { background: var(--bg); }
      `}</style>
    </div>
  );
}
