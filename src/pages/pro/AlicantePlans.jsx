import { useState } from "react";
import Card from "../../components/Card";
import { Search, Filter, MapPin, CloudRain, Baby, ExternalLink, Plus, Trash2, Euro } from "lucide-react";

export default function AlicantePlans({ data, setData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priceCategory: "Todos",
    environment: "Todos",
    rainFriendly: false,
    kidsFriendly: false
  });

  const filteredPlans = data.alicantePlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         plan.zone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = filters.priceCategory === "Todos" || plan.priceCategory === filters.priceCategory;
    const matchesEnv = filters.environment === "Todos" || plan.environment === filters.environment;
    const matchesRain = !filters.rainFriendly || plan.rainFriendly;
    const matchesKids = !filters.kidsFriendly || plan.kidsFriendly;

    return matchesSearch && matchesPrice && matchesEnv && matchesRain && matchesKids;
  });

  const removePlan = (id) => {
    setData({
      ...data,
      alicantePlans: data.alicantePlans.filter(p => p.id !== id)
    });
  };

  return (
    <div className="page alicante-page">
      <div className="section-header">
        <h1>Planes en Alicante</h1>
        <p>Tu base local de ocio y cultura</p>
      </div>

      <div className="controls-box">
        <div className="search-bar">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o zona..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-grid">
          <select value={filters.priceCategory} onChange={e => setFilters({...filters, priceCategory: e.target.value})}>
            <option value="Todos">Presupuesto (Todos)</option>
            <option value="Gratis">Gratis</option>
            <option value="Barato">Barato</option>
            <option value="Medio">Medio</option>
          </select>

          <select value={filters.environment} onChange={e => setFilters({...filters, environment: e.target.value})}>
            <option value="Todos">Ambiente (Todos)</option>
            <option value="Interior">Interior</option>
            <option value="Exterior">Exterior</option>
          </select>

          <button 
            className={`filter-btn ${filters.rainFriendly ? 'active' : ''}`}
            onClick={() => setFilters({...filters, rainFriendly: !filters.rainFriendly})}
          >
            <CloudRain size={16} /> Lluvia OK
          </button>

          <button 
            className={`filter-btn ${filters.kidsFriendly ? 'active' : ''}`}
            onClick={() => setFilters({...filters, kidsFriendly: !filters.kidsFriendly})}
          >
            <Baby size={16} /> Con Niña
          </button>
        </div>
      </div>

      <div className="plans-grid">
        {filteredPlans.map(plan => (
          <div key={plan.id} className="plan-card">
            <div className="plan-header">
              <div className="type-badge">{plan.type}</div>
              <button onClick={() => removePlan(plan.id)} className="del-btn"><Trash2 size={16} /></button>
            </div>
            
            <h3>{plan.name}</h3>
            
            <div className="plan-info">
              <div className="info-item"><MapPin size={14} /> {plan.zone}, {plan.municipality}</div>
              <div className="info-item"><Euro size={14} /> {plan.priceCategory} ({plan.estimatedPrice}€ aprox)</div>
              <div className="info-item"><Search size={14} /> {plan.duration} de duración</div>
            </div>

            <div className="tags">
              {plan.rainFriendly && <span className="tag rain"><CloudRain size={12} /> Apto Lluvia</span>}
              {plan.kidsFriendly && <span className="tag kids"><Baby size={12} /> Apto Niños</span>}
              <span className="tag env">{plan.environment}</span>
            </div>

            <p className="notes">{plan.notes}</p>

            {plan.link && (
              <a href={plan.link} target="_blank" rel="noreferrer" className="link-btn">
                Ver más <ExternalLink size={14} />
              </a>
            )}
          </div>
        ))}
        
        <button className="add-plan-card">
          <Plus size={32} />
          <span>Añadir nuevo plan</span>
        </button>
      </div>

      <style>{`
        .controls-box {
          background: var(--card);
          padding: 20px;
          border-radius: 16px;
          border: 1px solid var(--border);
          margin-bottom: 25px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .search-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg);
          padding: 10px 15px;
          border-radius: 10px;
          border: 1px solid var(--border);
        }
        .search-bar input { border: none; margin: 0; padding: 0; flex-grow: 1; }
        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 10px;
        }
        .filter-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--bg);
          font-size: 0.85em;
          transition: all 0.2s;
        }
        .filter-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .plan-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .plan-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .type-badge {
          background: var(--bg);
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75em;
          font-weight: bold;
          text-transform: uppercase;
          color: var(--primary);
        }
        .plan-card h3 { margin: 0; font-size: 1.2rem; }
        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85em;
          opacity: 0.8;
        }
        .tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .tag {
          font-size: 0.7em;
          padding: 2px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .tag.rain { background: #dbeafe; color: #1e40af; }
        .tag.kids { background: #fce7f3; color: #9d174d; }
        .tag.env { background: var(--bg); border: 1px solid var(--border); }
        .notes { font-size: 0.85em; opacity: 0.7; font-style: italic; margin: 5px 0; }
        .link-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--bg);
          padding: 10px;
          border-radius: 8px;
          font-size: 0.85em;
          text-decoration: none;
          color: var(--text);
          border: 1px solid var(--border);
        }
        .add-plan-card {
          border: 2px dashed var(--border);
          background: transparent;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 200px;
          color: var(--border);
          transition: all 0.2s;
        }
        .add-plan-card:hover { border-color: var(--primary); color: var(--primary); }
      `}</style>
    </div>
  );
}
