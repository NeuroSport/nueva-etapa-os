import { useState, useMemo } from "react";
import Card from "../components/Card";
import { 
  Baby, 
  Calendar, 
  Heart, 
  Shirt, 
  Stethoscope, 
  School, 
  Plus, 
  CheckCircle, 
  Circle, 
  Trash2, 
  Star,
  MapPin,
  ShoppingBag,
  Clock,
  ChevronRight,
  ClipboardList,
  Euro,
  X,
  Sparkles
} from "lucide-react";

export default function Daughter({ data, setData }) {
  const [activeTab, setActiveTab] = useState("custody");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'custody', 'plan', 'inventory', 'expense'
  const [editingItem, setEditingItem] = useState(null);

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
  const nextDayWithHer = useMemo(() => {
    const future = data.daughterSystem.custodyCalendar
      .filter(c => c.date >= todayStr && c.type === 'conmigo')
      .sort((a,b) => a.date.localeCompare(b.date))[0];
    return future ? future.date : "Sin fecha";
  }, [data.daughterSystem.custodyCalendar, todayStr]);

  const totalDaughterExpenses = data.daughterSystem.expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const handleToggleResponsibility = (id) => {
    setData({
      ...data,
      daughterSystem: {
        ...data.daughterSystem,
        responsibilities: data.daughterSystem.responsibilities.map(r => r.id === id ? { ...r, done: !r.done } : r)
      }
    });
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item || {
      id: crypto.randomUUID(),
      title: "",
      date: todayStr,
      type: type === 'custody' ? 'conmigo' : 'ocio',
      amount: "",
      status: 'ok',
      item: ""
    });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const system = { ...data.daughterSystem };
    
    if (modalType === 'custody') {
      const exists = system.custodyCalendar.find(c => c.id === editingItem.id);
      system.custodyCalendar = exists 
        ? system.custodyCalendar.map(c => c.id === editingItem.id ? editingItem : c)
        : [...system.custodyCalendar, editingItem];
    } else if (modalType === 'plan') {
      const exists = system.plans.ideas.find(p => p.id === editingItem.id);
      system.plans.ideas = exists 
        ? system.plans.ideas.map(p => p.id === editingItem.id ? editingItem : p)
        : [...system.plans.ideas, editingItem];
    } else if (modalType === 'inventory') {
      const exists = system.inventory.clothes.find(c => c.id === editingItem.id);
      system.inventory.clothes = exists 
        ? system.inventory.clothes.map(c => c.id === editingItem.id ? editingItem : c)
        : [...system.inventory.clothes, editingItem];
    } else if (modalType === 'expense') {
      const exists = system.expenses.find(ex => ex.id === editingItem.id);
      system.expenses = exists 
        ? system.expenses.map(ex => ex.id === editingItem.id ? editingItem : ex)
        : [...system.expenses, editingItem];
    }

    setData({ ...data, daughterSystem: system });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    const system = { ...data.daughterSystem };
    if (modalType === 'custody') system.custodyCalendar = system.custodyCalendar.filter(c => c.id !== id);
    if (modalType === 'plan') system.plans.ideas = system.plans.ideas.filter(p => p.id !== id);
    if (modalType === 'inventory') system.inventory.clothes = system.inventory.clothes.filter(c => c.id !== id);
    if (modalType === 'expense') system.expenses = system.expenses.filter(ex => ex.id !== id);
    
    setData({ ...data, daughterSystem: system });
    setShowModal(false);
  };

  return (
    <div className="page daughter-page">
      <div className="daughter-header">
        <div className="main-stat">
          <Baby size={32} color="#ec4899" />
          <div>
            <h1>Vida con mi Hija v2.0</h1>
            <p>Próximo día: <strong>{nextDayWithHer}</strong></p>
          </div>
        </div>
      </div>

      <div className="system-tabs">
        <button className={activeTab === 'custody' ? 'active' : ''} onClick={() => setActiveTab('custody')}>Custodia</button>
        <button className={activeTab === 'plans' ? 'active' : ''} onClick={() => setActiveTab('plans')}>Planes</button>
        <button className={activeTab === 'logistics' ? 'active' : ''} onClick={() => setActiveTab('logistics')}>Logística</button>
        <button className={activeTab === 'expenses' ? 'active' : ''} onClick={() => setActiveTab('expenses')}>Gastos</button>
      </div>

      <main className="daughter-content">
        {activeTab === 'custody' && (
          <div className="tab-section">
            <Card title="Calendario de Custodia">
              <div className="add-bar">
                <button className="add-btn-inline" onClick={() => openModal('custody')}><Plus size={16} /> Añadir día/evento</button>
              </div>
              <div className="custody-list">
                {data.daughterSystem.custodyCalendar.sort((a,b) => b.date.localeCompare(a.date)).slice(0, 5).map(c => (
                  <div key={c.id} className={`custody-item ${c.type}`} onClick={() => openModal('custody', c)}>
                    <div className="c-date">{c.date}</div>
                    <div className="c-info">
                      <div className="c-title">{c.title || (c.type === 'conmigo' ? 'Día conmigo' : c.type)}</div>
                    </div>
                    {c.type === 'conmigo' && <Heart size={16} fill="#ec4899" color="#ec4899" />}
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Checklist de Responsabilidades">
              <div className="checklist">
                {data.daughterSystem.responsibilities.map(r => (
                  <div key={r.id} className="check-item" onClick={() => handleToggleResponsibility(r.id)}>
                    {r.done ? <CheckCircle size={24} color="#10b981" /> : <Circle size={24} color="#94a3b8" />}
                    <span className={r.done ? 'done' : ''}>{r.title}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="tab-section">
            <Card title="Ideas de Planes">
              <div className="add-bar">
                <button className="add-btn-inline" onClick={() => openModal('plan')}><Plus size={16} /> Nueva idea</button>
              </div>
              <div className="plans-grid">
                {data.daughterSystem.plans.ideas.map(p => (
                  <div key={p.id} className="plan-card" onClick={() => openModal('plan', p)}>
                    <div className="p-header">
                      <Sparkles size={16} color="#f59e0b" />
                      <strong>{p.title}</strong>
                    </div>
                    <p>{p.description}</p>
                    <div className="p-footer">
                      <span>{p.category}</span>
                      <span>{p.cost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'logistics' && (
          <div className="tab-section">
            <Card title="Inventario de Ropa / Tallas">
              <div className="add-bar">
                <button className="add-btn-inline" onClick={() => openModal('inventory')}><Plus size={16} /> Añadir prenda</button>
              </div>
              <div className="inventory-list">
                {data.daughterSystem.inventory.clothes.map(c => (
                  <div key={c.id} className="inventory-item" onClick={() => openModal('inventory', c)}>
                    <Shirt size={18} />
                    <div className="i-details">
                      <strong>{c.item}</strong>
                      <span>Talla: {c.size}</span>
                    </div>
                    <div className={`i-status ${c.status}`}>{c.status}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="tab-section">
            <Card title="Gastos Asociados">
              <div className="total-expenses-banner">
                <Euro size={20} /> Total acumulado: {totalDaughterExpenses.toFixed(2)}€
              </div>
              <div className="add-bar">
                <button className="add-btn-inline" onClick={() => openModal('expense')}><Plus size={16} /> Registrar gasto</button>
              </div>
              <div className="expense-list">
                {data.daughterSystem.expenses.map(e => (
                  <div key={e.id} className="expense-item" onClick={() => openModal('expense', e)}>
                    <div className="e-date">{e.date}</div>
                    <div className="e-title">{e.title}</div>
                    <div className="e-amount">{e.amount}€</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="daughter-modal">
            <div className="modal-header">
              <h3>{editingItem.id ? 'Editar' : 'Añadir'}</h3>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            <form onSubmit={handleSave}>
              <input 
                className="main-input"
                type="text" 
                placeholder="Título / Concepto" 
                value={editingItem.title || editingItem.item || ""} 
                onChange={e => setEditingItem(modalType === 'inventory' ? {...editingItem, item: e.target.value} : {...editingItem, title: e.target.value})}
                required
              />

              {modalType === 'custody' && (
                <div className="form-grid">
                  <div className="field">
                    <label>Fecha</label>
                    <input type="date" value={editingItem.date} onChange={e => setEditingItem({...editingItem, date: e.target.value})} />
                  </div>
                  <div className="field">
                    <label>Tipo</label>
                    <select value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})}>
                      <option value="conmigo">Día conmigo</option>
                      <option value="escuela">Evento Escuela</option>
                      <option value="medico">Cita Médica</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>
              )}

              {modalType === 'plan' && (
                <div className="form-grid">
                  <div className="field">
                    <label>Categoría</label>
                    <select value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>
                      <option value="ocio">Ocio / Parque</option>
                      <option value="educacion">Educación</option>
                      <option value="casa">En casa</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Coste</label>
                    <select value={editingItem.cost} onChange={e => setEditingItem({...editingItem, cost: e.target.value})}>
                      <option value="Gratis">Gratis</option>
                      <option value="Bajo">Bajo</option>
                      <option value="Medio">Medio</option>
                      <option value="Alto">Alto</option>
                    </select>
                  </div>
                </div>
              )}

              {modalType === 'inventory' && (
                <div className="form-grid">
                  <div className="field">
                    <label>Talla</label>
                    <input type="text" value={editingItem.size} onChange={e => setEditingItem({...editingItem, size: e.target.value})} />
                  </div>
                  <div className="field">
                    <label>Estado</label>
                    <select value={editingItem.status} onChange={e => setEditingItem({...editingItem, status: e.target.value})}>
                      <option value="ok">Está bien</option>
                      <option value="pequeño">Se queda pequeño</option>
                      <option value="falta">Falta / Comprar</option>
                    </select>
                  </div>
                </div>
              )}

              {modalType === 'expense' && (
                <div className="form-grid">
                  <div className="field">
                    <label>Fecha</label>
                    <input type="date" value={editingItem.date} onChange={e => setEditingItem({...editingItem, date: e.target.value})} />
                  </div>
                  <div className="field">
                    <label>Cantidad (€)</label>
                    <input type="number" value={editingItem.amount} onChange={e => setEditingItem({...editingItem, amount: e.target.value})} />
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="del-btn" onClick={() => handleDelete(editingItem.id)}>Eliminar</button>
                <button type="submit" className="save-btn">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .daughter-page { padding: 15px; padding-bottom: 90px; }
        .daughter-header { background: #fff1f2; margin: -15px -15px 20px -15px; padding: 30px 20px; border-bottom: 1px solid #fecdd3; }
        .main-stat { display: flex; align-items: center; gap: 20px; }
        .main-stat h1 { font-size: 1.5rem; margin: 0; color: #881337; }
        .main-stat p { margin: 5px 0 0 0; font-size: 0.9em; color: #be123c; }

        .system-tabs { display: flex; gap: 8px; margin-bottom: 25px; overflow-x: auto; padding-bottom: 5px; }
        .system-tabs button {
          flex-shrink: 0;
          background: var(--bg);
          border: 1px solid var(--border);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85em;
          font-weight: bold;
          color: var(--text);
        }
        .system-tabs button.active { background: #ec4899; color: white; border-color: #ec4899; }

        .tab-section { display: flex; flex-direction: column; gap: 20px; }
        .add-bar { margin-bottom: 15px; }
        .add-btn-inline { background: var(--bg); border: 1px dashed var(--border); width: 100%; padding: 12px; border-radius: 12px; font-size: 0.85em; display: flex; align-items: center; justify-content: center; gap: 8px; }

        /* CUSTODIA */
        .custody-list { display: flex; flex-direction: column; gap: 10px; }
        .custody-item { display: flex; align-items: center; gap: 15px; padding: 15px; border-radius: 12px; background: var(--bg); border-left: 5px solid gray; }
        .custody-item.conmigo { border-left-color: #ec4899; background: #fff1f2; }
        .custody-item.medico { border-left-color: #ef4444; }
        .custody-item.escuela { border-left-color: #3b82f6; }
        .c-date { font-weight: bold; font-size: 0.8em; min-width: 85px; }
        .c-title { font-size: 0.95em; flex-grow: 1; }

        /* CHECKLIST */
        .checklist { display: flex; flex-direction: column; gap: 15px; }
        .check-item { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .check-item span.done { text-decoration: line-through; opacity: 0.5; }

        /* PLANS */
        .plans-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .plan-card { background: var(--bg); padding: 15px; border-radius: 16px; border: 1px solid var(--border); }
        .p-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .plan-card p { font-size: 0.85em; opacity: 0.7; margin: 0 0 10px 0; }
        .p-footer { display: flex; justify-content: space-between; font-size: 0.75em; font-weight: bold; opacity: 0.6; }

        /* INVENTORY */
        .inventory-list { display: flex; flex-direction: column; gap: 10px; }
        .inventory-item { display: flex; align-items: center; gap: 15px; background: var(--bg); padding: 12px; border-radius: 12px; }
        .i-details { flex-grow: 1; display: flex; flex-direction: column; }
        .i-details span { font-size: 0.75em; opacity: 0.6; }
        .i-status { font-size: 0.7em; font-weight: bold; text-transform: uppercase; padding: 4px 8px; border-radius: 8px; }
        .i-status.pequeño { background: #fee2e2; color: #ef4444; }
        .i-status.falta { background: #fef3c7; color: #d97706; }
        .i-status.ok { background: #dcfce7; color: #16a34a; }

        /* EXPENSES */
        .total-expenses-banner { background: #f1f5f9; padding: 15px; border-radius: 12px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; font-weight: bold; }
        .expense-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid var(--border); }
        .e-date { font-size: 0.75em; opacity: 0.5; }
        .e-amount { font-weight: bold; color: #ef4444; }

        /* MODAL */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; justify-content: center; z-index: 1000; }
        .daughter-modal { background: var(--card); width: 100%; max-width: 500px; padding: 25px; border-radius: 24px 24px 0 0; }
        .main-input { width: 100%; font-size: 1.3rem; font-weight: bold; border: none; border-bottom: 2px solid var(--border); padding: 10px 0; margin-bottom: 20px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .field label { display: block; font-size: 0.75em; font-weight: bold; opacity: 0.5; margin-bottom: 5px; }
        .modal-actions { display: flex; gap: 10px; margin-top: 20px; }
        .save-btn { flex-grow: 1; background: #ec4899; color: white; border: none; padding: 15px; border-radius: 12px; font-weight: bold; }
        .del-btn { background: #fee2e2; color: #ef4444; border: none; padding: 15px; border-radius: 12px; font-weight: bold; }
      `}</style>
    </div>
  );
}