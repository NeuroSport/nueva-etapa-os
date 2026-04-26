import { useState, useMemo } from "react";
import Card from "../components/Card";
import { 
  MapPin, 
  Umbrella, 
  Baby, 
  Euro, 
  Clock, 
  Star, 
  Filter, 
  Search, 
  Plus, 
  X, 
  Map as MapIcon, 
  Info,
  Sun,
  Home,
  ChevronRight,
  Heart
} from "lucide-react";

const CATEGORIES = ["Parque / Naturaleza", "Cultura", "Gastronomía", "Ocio", "Deporte"];
const PRICE_CATEGORIES = ["Gratis", "Barato", "Medio", "Alto"];

export default function LocalPlans({ data, setData }) {
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Todos");
  const [filterRain, setFilterRain] = useState(false);
  const [filterKids, setFilterKids] = useState(false);

  const filteredPlans = useMemo(() => {
    return data.alicantePlans.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.zone.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === "Todos" || p.type === filterType;
      const matchRain = !filterRain || p.rainProof;
      const matchKids = !filterKids || p.kidsFriendly;
      return matchSearch && matchType && matchRain && matchKids;
    });
  }, [data.alicantePlans, searchTerm, filterType, filterRain, filterKids]);

  const handleAddPlan = () => {
    setEditingPlan({
      id: crypto.randomUUID(),
      name: "",
      zone: "",
      type: "Ocio",
      priceCategory: "Gratis",
      priceValue: 0,
      environment: "Exterior",
      rainProof: false,
      kidsFriendly: true,
      duration: "1h",
      favorite: false,
      notes: ""
    });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const exists = data.alicantePlans.find(p => p.id === editingPlan.id);
    if (exists) {
      setData({ ...data, alicantePlans: data.alicantePlans.map(p => p.id === editingPlan.id ? editingPlan : p) });
    } else {
      setData({ ...data, alicantePlans: [...data.alicantePlans, editingPlan] });
    }
    setShowModal(false);
  };

  const toggleFavorite = (id) => {
    setData({
      ...data,
      alicantePlans: data.alicantePlans.map(p => p.id === id ? { ...p, favorite: !p.favorite } : p)
    });
  };

  const deletePlan = (id) => {
    setData({ ...data, alicantePlans: data.alicantePlans.filter(p => p.id !== id) });
    setShowModal(false);
  };

  return (
    <div className="page plans-page">
      <div className="section-header pro-header">
        <h1>PLANES LOCALES v2.0</h1>
        <p>Tu guía inteligente de Alicante</p>
      </div>

      <div className="plans-tools">
        <div className="search-bar">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o zona..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="quick-filters">
          <button className={filterRain ? 'active' : ''} onClick={() => setFilterRain(!filterRain)}>
            <Umbrella size={16} /> Lluvia
          </button>
          <button className={filterKids ? 'active' : ''} onClick={() => setFilterKids(!filterKids)}>
            <Baby size={16} /> Niños
          </button>
          <button onClick={handleAddPlan} className="add-btn-round"><Plus /></button>
        </div>

        <div className="type-scroller">
          <button className={filterType === 'Todos' ? 'active' : ''} onClick={() => setFilterType('Todos')}>Todos</button>
          {CATEGORIES.map(c => (
            <button key={c} className={filterType === c ? 'active' : ''} onClick={() => setFilterType(c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className="plans-list">
        {filteredPlans.length === 0 && <p className="empty">No hay planes que coincidan con los filtros.</p>}
        {filteredPlans.map(plan => (
          <div key={plan.id} className="plan-card-v2">
            <div className="p-header" onClick={() => { setEditingPlan(plan); setShowModal(true); }}>
              <div className="p-title-area">
                <h3>{plan.name}</h3>
                <span className="p-zone"><MapPin size={12} /> {plan.zone}</span>
              </div>
              <button className={`fav-btn ${plan.favorite ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleFavorite(plan.id); }}>
                <Heart size={20} fill={plan.favorite ? "#ef4444" : "none"} color={plan.favorite ? "#ef4444" : "#94a3b8"} />
              </button>
            </div>

            <div className="p-tags">
              <span className={`tag ${plan.environment.toLowerCase()}`}>
                {plan.environment === 'Interior' ? <Home size={12} /> : <Sun size={12} />} {plan.environment}
              </span>
              <span className="tag price">{plan.priceCategory}</span>
              <span className="tag duration"><Clock size={12} /> {plan.duration}</span>
              {plan.rainProof && <span className="tag rain"><Umbrella size={12} /> Apto Lluvia</span>}
              {plan.kidsFriendly && <span className="tag kids"><Baby size={12} /> Niños</span>}
            </div>

            <p className="p-notes">{plan.notes}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="plan-modal">
            <div className="modal-header">
              <h3>{editingPlan.id ? 'Editar Plan' : 'Añadir Plan'}</h3>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            
            <form onSubmit={handleSave}>
              <input 
                className="main-input"
                type="text" 
                placeholder="Nombre del lugar o plan" 
                value={editingPlan.name} 
                onChange={e => setEditingPlan({...editingPlan, name: e.target.value})}
                required
              />
              
              <div className="form-grid">
                <div className="field">
                  <label>Zona</label>
                  <input type="text" placeholder="Ej: Centro" value={editingPlan.zone} onChange={e => setEditingPlan({...editingPlan, zone: e.target.value})} required />
                </div>
                <div className="field">
                  <label>Tipo</label>
                  <select value={editingPlan.type} onChange={e => setEditingPlan({...editingPlan, type: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Precio</label>
                  <select value={editingPlan.priceCategory} onChange={e => setEditingPlan({...editingPlan, priceCategory: e.target.value})}>
                    {PRICE_CATEGORIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Ambiente</label>
                  <select value={editingPlan.environment} onChange={e => setEditingPlan({...editingPlan, environment: e.target.value})}>
                    <option value="Interior">Interior</option>
                    <option value="Exterior">Exterior</option>
                  </select>
                </div>
              </div>

              <div className="toggle-row">
                <label className="checkbox">
                  <input type="checkbox" checked={editingPlan.rainProof} onChange={e => setEditingPlan({...editingPlan, rainProof: e.target.checked})} />
                  <span>Apto para Lluvia</span>
                </label>
                <label className="checkbox">
                  <input type="checkbox" checked={editingPlan.kidsFriendly} onChange={e => setEditingPlan({...editingPlan, kidsFriendly: e.target.checked})} />
                  <span>Apto para Niños</span>
                </label>
              </div>

              <div className="field">
                <label>Notas / Recomendaciones</label>
                <textarea 
                  placeholder="¿Qué hay que saber?" 
                  value={editingPlan.notes} 
                  onChange={e => setEditingPlan({...editingPlan, notes: e.target.value})}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="del-btn" onClick={() => deletePlan(editingPlan.id)}>Eliminar</button>
                <button type="submit" className="save-btn">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .plans-page { padding: 15px; padding-bottom: 90px; }
        .section-header.pro-header { 
          background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
          margin: -15px -15px 25px -15px;
          padding: 30px 20px;
          color: white;
        }
        .section-header.pro-header h1 { font-size: 1.2rem; letter-spacing: 1px; color: #dbeafe; margin: 0; }
        .section-header.pro-header p { font-size: 0.8em; opacity: 0.8; margin: 5px 0 0 0; }

        .plans-tools { display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px; }
        .search-bar { background: var(--card); border: 1px solid var(--border); padding: 12px; border-radius: 12px; display: flex; align-items: center; gap: 10px; }
        .search-bar input { border: none; background: transparent; width: 100%; margin: 0; }

        .quick-filters { display: flex; gap: 10px; }
        .quick-filters button { flex: 1; background: var(--bg); border: 1px solid var(--border); padding: 8px; border-radius: 10px; font-size: 0.8em; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .quick-filters button.active { background: #3b82f6; color: white; border-color: #3b82f6; }
        .add-btn-round { width: 40px !important; flex: none !important; background: var(--primary) !important; color: white !important; border: none !important; }

        .type-scroller { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 5px; }
        .type-scroller button { flex-shrink: 0; background: var(--card); border: 1px solid var(--border); padding: 6px 12px; border-radius: 20px; font-size: 0.75em; font-weight: bold; }
        .type-scroller button.active { background: #1e293b; color: white; border-color: #1e293b; }

        .plans-list { display: flex; flex-direction: column; gap: 15px; }
        .plan-card-v2 { background: var(--card); border: 1px solid var(--border); padding: 20px; border-radius: 24px; position: relative; }
        .p-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
        .p-title-area h3 { margin: 0; font-size: 1.1rem; }
        .p-zone { font-size: 0.75em; opacity: 0.5; display: flex; align-items: center; gap: 4px; margin-top: 2px; }
        
        .p-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
        .tag { font-size: 0.7em; font-weight: bold; padding: 4px 8px; border-radius: 8px; background: var(--bg); display: flex; align-items: center; gap: 4px; }
        .tag.exterior { background: #dcfce7; color: #16a34a; }
        .tag.interior { background: #fef3c7; color: #d97706; }
        .tag.price { background: #f1f5f9; color: #64748b; }
        .tag.rain { background: #dbeafe; color: #2563eb; }
        .tag.kids { background: #fff1f2; color: #ec4899; }

        .p-notes { font-size: 0.85em; opacity: 0.7; margin: 0; line-height: 1.4; border-top: 1px solid var(--border); padding-top: 10px; }

        /* MODAL */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; justify-content: center; z-index: 1000; }
        .plan-modal { background: var(--card); width: 100%; max-width: 500px; padding: 25px; border-radius: 24px 24px 0 0; max-height: 90vh; overflow-y: auto; }
        .main-input { width: 100%; font-size: 1.3rem; font-weight: bold; border: none; border-bottom: 2px solid var(--border); padding: 10px 0; margin-bottom: 20px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .field label { display: block; font-size: 0.75em; font-weight: bold; opacity: 0.5; margin-bottom: 5px; }
        .toggle-row { display: flex; gap: 20px; margin-bottom: 20px; }
        .checkbox { display: flex; align-items: center; gap: 8px; font-size: 0.85em; }

        .modal-actions { display: flex; gap: 10px; margin-top: 25px; }
        .save-btn { flex-grow: 1; background: #3b82f6; color: white; border: none; padding: 15px; border-radius: 12px; font-weight: bold; }
        .del-btn { background: #fee2e2; color: #ef4444; border: none; padding: 15px; border-radius: 12px; font-weight: bold; }
      `}</style>
    </div>
  );
}
