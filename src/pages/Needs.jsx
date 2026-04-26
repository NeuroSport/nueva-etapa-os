import { useState, useMemo } from "react";
import Card from "../components/Card";
import { 
  AlertCircle, 
  Plus, 
  CheckCircle, 
  Circle, 
  Euro, 
  Calendar, 
  Filter, 
  Trash2, 
  ChevronRight,
  MoreVertical,
  X,
  ShoppingBag,
  Tag,
  Clock,
  ArrowUpDown
} from "lucide-react";

const CATEGORIES = ["Hogar", "Hija", "Salud", "Coche", "Trabajo", "Otros"];
const PRIORITIES = ["Baja", "Media", "Alta", "Crítica"];

export default function Needs({ data, setData }) {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterCat, setFilterCat] = useState("Todas");
  const [sortBy, setSortBy] = useState("priority");

  // Utilidad de fecha segura
  const formatLocalDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatLocalDate(new Date());

  // Cálculos
  const totalCost = useMemo(() => {
    return data.needs.filter(n => !n.resolved).reduce((sum, n) => sum + Number(n.cost || 0), 0);
  }, [data.needs]);

  const filteredNeeds = useMemo(() => {
    return data.needs
      .filter(n => filterCat === "Todas" || n.category === filterCat)
      .sort((a, b) => {
        if (sortBy === "priority") {
          const pMap = { Crítica: 4, Alta: 3, Media: 2, Baja: 1 };
          return pMap[b.priority] - pMap[a.priority];
        }
        if (sortBy === "cost") return (Number(b.cost) || 0) - (Number(a.cost) || 0);
        return 0;
      });
  }, [data.needs, filterCat, sortBy]);

  const handleAddItem = () => {
    setEditingItem({
      id: crypto.randomUUID(),
      title: "",
      description: "",
      cost: "",
      priority: "Media",
      deadline: todayStr,
      category: "Hogar",
      status: "Pendiente",
      resolved: false
    });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const exists = data.needs.find(n => n.id === editingItem.id);
    if (exists) {
      setData({ ...data, needs: data.needs.map(n => n.id === editingItem.id ? editingItem : n) });
    } else {
      setData({ ...data, needs: [...data.needs, editingItem] });
    }
    setShowModal(false);
  };

  const toggleResolved = (id) => {
    setData({
      ...data,
      needs: data.needs.map(n => n.id === id ? { ...n, resolved: !n.resolved, status: !n.resolved ? "Resuelto" : "Pendiente" } : n)
    });
  };

  const deleteItem = (id) => {
    setData({ ...data, needs: data.needs.filter(n => n.id !== id) });
    setShowModal(false);
  };

  return (
    <div className="page needs-page">
      <div className="section-header">
        <h1>Necesidades v2.0</h1>
        <div className="total-badge">
          <Euro size={16} />
          <span>{totalCost.toFixed(2)}€ pendientes</span>
        </div>
      </div>

      <div className="needs-tools">
        <div className="tool">
          <Filter size={16} />
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="Todas">Categorías</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="tool">
          <ArrowUpDown size={16} />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="priority">Prioridad</option>
            <option value="cost">Coste</option>
          </select>
        </div>
        <button className="add-main" onClick={handleAddItem}><Plus /></button>
      </div>

      <div className="needs-list">
        {filteredNeeds.length === 0 && <p className="empty">No hay necesidades registradas.</p>}
        {filteredNeeds.map(item => (
          <div 
            key={item.id} 
            className={`need-card ${item.resolved ? 'resolved' : ''} ${item.priority.toLowerCase()}`}
            onClick={() => { setEditingItem(item); setShowModal(true); }}
          >
            <button className="res-btn" onClick={(e) => { e.stopPropagation(); toggleResolved(item.id); }}>
              {item.resolved ? <CheckCircle size={24} color="#10b981" /> : <Circle size={24} color="#94a3b8" />}
            </button>
            
            <div className="need-body">
              <div className="need-title-row">
                <h3>{item.title}</h3>
                {item.priority === "Crítica" && <AlertCircle size={16} color="#ef4444" />}
              </div>
              <div className="need-meta">
                <span><Tag size={12} /> {item.category}</span>
                <span><Calendar size={12} /> {item.deadline}</span>
              </div>
              <p className="need-desc">{item.description}</p>
            </div>

            <div className="need-cost">
              {item.cost ? `${item.cost}€` : '--'}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="need-modal">
            <div className="modal-header">
              <h3>{editingItem.id ? 'Editar Necesidad' : 'Nueva Necesidad'}</h3>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            
            <form onSubmit={handleSave}>
              <input 
                className="main-input"
                type="text" 
                placeholder="¿Qué falta? (ej: Ruedas coche)" 
                value={editingItem.title} 
                onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                required
              />
              
              <div className="form-grid">
                <div className="field">
                  <label>Prioridad</label>
                  <select value={editingItem.priority} onChange={e => setEditingItem({...editingItem, priority: e.target.value})}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Categoría</label>
                  <select value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Coste Est. (€)</label>
                  <input type="number" value={editingItem.cost} onChange={e => setEditingItem({...editingItem, cost: e.target.value})} />
                </div>
                <div className="field">
                  <label>Fecha Límite</label>
                  <input type="date" value={editingItem.deadline} onChange={e => setEditingItem({...editingItem, deadline: e.target.value})} />
                </div>
              </div>

              <textarea 
                placeholder="Detalles adicionales..." 
                value={editingItem.description} 
                onChange={e => setEditingItem({...editingItem, description: e.target.value})}
              />

              <div className="modal-actions">
                <button type="button" className="del-btn" onClick={() => deleteItem(editingItem.id)}>Eliminar</button>
                <button type="submit" className="save-btn">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .needs-page { padding: 15px; padding-bottom: 90px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .total-badge { background: #1e293b; color: white; padding: 8px 15px; border-radius: 20px; font-size: 0.85em; display: flex; align-items: center; gap: 8px; font-weight: bold; }

        .needs-tools { display: flex; gap: 10px; margin-bottom: 25px; }
        .tool { flex-grow: 1; display: flex; align-items: center; gap: 8px; background: var(--card); padding: 10px; border-radius: 12px; border: 1px solid var(--border); }
        .tool select { border: none; background: transparent; width: 100%; font-size: 0.85em; color: var(--text); }
        .add-main { width: 45px; height: 45px; background: var(--primary); color: white; border: none; border-radius: 12px; display: flex; align-items: center; justify-content: center; }

        .needs-list { display: flex; flex-direction: column; gap: 12px; }
        .need-card {
          background: var(--card);
          border: 1px solid var(--border);
          padding: 15px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: transform 0.1s;
        }
        .need-card:active { transform: scale(0.98); }
        .need-card.resolved { opacity: 0.5; }
        .need-card.crítica { border-left: 6px solid #ef4444; }
        .need-card.alta { border-left: 6px solid #f97316; }
        .need-card.media { border-left: 6px solid #3b82f6; }
        .need-card.baja { border-left: 6px solid #94a3b8; }
        
        .res-btn { background: none; border: none; padding: 0; }
        .need-body { flex-grow: 1; }
        .need-title-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        .need-title-row h3 { font-size: 1rem; margin: 0; }
        .need-meta { display: flex; gap: 10px; font-size: 0.75em; opacity: 0.5; margin-bottom: 6px; }
        .need-desc { font-size: 0.85em; opacity: 0.7; margin: 0; }
        .need-cost { font-weight: bold; font-size: 1.1rem; color: #ef4444; }

        /* MODAL */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; justify-content: center; z-index: 1000; }
        .need-modal { background: var(--card); width: 100%; max-width: 500px; padding: 25px; border-radius: 24px 24px 0 0; }
        .main-input { width: 100%; font-size: 1.3rem; font-weight: bold; border: none; border-bottom: 2px solid var(--border); padding: 10px 0; margin-bottom: 20px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .field label { display: block; font-size: 0.75em; font-weight: bold; opacity: 0.5; margin-bottom: 5px; }
        
        textarea { width: 100%; height: 60px; margin-bottom: 20px; border-radius: 12px; }
        .modal-actions { display: flex; gap: 10px; }
        .save-btn { flex-grow: 1; background: var(--primary); color: white; border: none; padding: 15px; border-radius: 12px; font-weight: bold; }
        .del-btn { background: #fee2e2; color: #ef4444; border: none; padding: 15px; border-radius: 12px; font-weight: bold; }
      `}</style>
    </div>
  );
}