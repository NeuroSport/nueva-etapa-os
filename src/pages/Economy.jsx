import { useState, useMemo } from "react";
import Card from "../components/Card";
import { 
  Plus, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  Calendar, 
  Filter, 
  CheckCircle, 
  Circle, 
  Trash2, 
  TrendingUp, 
  AlertCircle,
  MoreVertical,
  X,
  CreditCard,
  PiggyBank,
  ArrowUpDown
} from "lucide-react";

const CATEGORIES = {
  Casa: { color: "#64748b", icon: "🏠" },
  Comida: { color: "#10b981", icon: "🍎" },
  Hija: { color: "#ec4899", icon: "👶" },
  Transporte: { color: "#3b82f6", icon: "🚗" },
  Ocio: { color: "#8b5cf6", icon: "🎮" },
  Deuda: { color: "#ef4444", icon: "💸" },
  Otros: { color: "#94a3b8", icon: "📦" }
};

export default function Economy({ data, setData }) {
  const [activeTab, setActiveTab] = useState("expenses");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterCat, setFilterCat] = useState("Todas");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [sortBy, setSortBy] = useState("date"); // date, amount, priority

  // Utilidad de fecha segura
  const formatLocalDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Cálculos de Resumen
  const totals = useMemo(() => {
    const totalIncome = data.income.reduce((sum, i) => sum + Number(i.amount), 0);
    const totalExpenses = data.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const fixedExpenses = data.expenses.filter(e => e.type === "Fijo").reduce((sum, e) => sum + Number(e.amount), 0);
    const paidExpenses = data.expenses.filter(e => e.paid).reduce((sum, e) => sum + Number(e.amount), 0);
    
    const available = totalIncome - totalExpenses;
    const weeklyBudget = (totalIncome - fixedExpenses) / 4;
    
    let status = "green";
    if (available < 200) status = "red";
    else if (available < 500) status = "yellow";

    return { totalIncome, totalExpenses, available, weeklyBudget, status, paidExpenses };
  }, [data.income, data.expenses]);

  // Filtrado y Ordenación
  const filteredItems = useMemo(() => {
    const list = activeTab === "expenses" ? data.expenses : data.income;
    return list
      .filter(item => {
        const catMatch = filterCat === "Todas" || item.category === filterCat;
        const statusMatch = filterStatus === "Todos" || 
                           (filterStatus === "Pagados" && item.paid) ||
                           (filterStatus === "Pendientes" && !item.paid);
        return catMatch && statusMatch;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          const dateA = a.date || "";
          const dateB = b.date || "";
          return dateB.localeCompare(dateA);
        }
        if (sortBy === "amount") return (Number(b.amount) || 0) - (Number(a.amount) || 0);
        if (sortBy === "priority") {
          const pMap = { Alta: 3, Media: 2, Baja: 1 };
          return pMap[b.priority || "Baja"] - pMap[a.priority || "Baja"];
        }
        return 0;
      });
  }, [data.expenses, data.income, activeTab, filterCat, filterStatus, sortBy]);

  const handleAddItem = () => {
    const newItem = activeTab === "expenses" ? {
      id: crypto.randomUUID(),
      title: "",
      amount: "",
      date: formatLocalDate(new Date()),
      payDate: formatLocalDate(new Date()),
      category: "Comida",
      type: "Variable",
      method: "Tarjeta",
      paid: false,
      recurring: false,
      priority: "Media",
      description: ""
    } : {
      id: crypto.randomUUID(),
      title: "",
      amount: "",
      date: formatLocalDate(new Date()),
      type: "Nómina",
      recurring: true,
      notes: ""
    };
    setEditingItem(newItem);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const key = activeTab === "expenses" ? "expenses" : "income";
    const exists = data[key].find(i => i.id === editingItem.id);
    
    if (exists) {
      setData({ ...data, [key]: data[key].map(i => i.id === editingItem.id ? editingItem : i) });
    } else {
      setData({ ...data, [key]: [...data[key], editingItem] });
    }
    setShowModal(false);
  };

  const togglePaid = (id) => {
    setData({
      ...data,
      expenses: data.expenses.map(e => e.id === id ? { ...e, paid: !e.paid } : e)
    });
  };

  const handleDelete = (id) => {
    const key = activeTab === "expenses" ? "expenses" : "income";
    setData({ ...data, [key]: data[key].filter(i => i.id !== id) });
    setShowModal(false);
  };

  return (
    <div className="page economy-page page-transition">
      <div className="economy-header">
        <h1>Control Financiero</h1>
        <div className={`status-badge ${totals.status}`}>
          {totals.status === 'green' ? 'Saludable' : totals.status === 'yellow' ? 'Precaución' : 'Alerta'}
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card main-balance">
          <div className="label">Dinero Disponible</div>
          <div className="value">{data.settings?.privacyMode ? "••••" : totals.available.toFixed(2)}€</div>
          <div className="sub-value">Total mes: {data.settings?.privacyMode ? "••••" : totals.totalIncome}€</div>
        </div>
        <div className="summary-mini-grid">
          <div className="mini-card income">
            <TrendingUp size={16} />
            <span>Ingresos</span>
            <strong>{data.settings?.privacyMode ? "•••" : totals.totalIncome}€</strong>
          </div>
          <div className="mini-card budget">
            <PiggyBank size={16} />
            <span>Libre/Semana</span>
            <strong>{data.settings?.privacyMode ? "•••" : totals.weeklyBudget.toFixed(2)}€</strong>
          </div>
        </div>
      </div>

      <div className="economy-tabs">
        <button className={activeTab === 'expenses' ? 'active' : ''} onClick={() => setActiveTab('expenses')}>
          Gastos
        </button>
        <button className={activeTab === 'income' ? 'active' : ''} onClick={() => setActiveTab('income')}>
          Ingresos
        </button>
      </div>

      {/* FILTROS TIPO CHIP */}
      <div className="chips-container">
        <div 
          className={`chip ${filterStatus === 'Todos' ? 'active' : ''}`} 
          onClick={() => setFilterStatus('Todos')}
        >
          Todos
        </div>
        {activeTab === 'expenses' && (
          <>
            <div 
              className={`chip ${filterStatus === 'Pendientes' ? 'active' : ''}`} 
              onClick={() => setFilterStatus('Pendientes')}
            >
              Pendientes ⏳
            </div>
            <div 
              className={`chip ${filterStatus === 'Pagados' ? 'active' : ''}`} 
              onClick={() => setFilterStatus('Pagados')}
            >
              Pagados ✅
            </div>
          </>
        )}
        <div 
          className={`chip ${filterCat === 'Todas' ? 'active' : ''}`} 
          onClick={() => setFilterCat('Todas')}
        >
          Categorías
        </div>
        {Object.keys(CATEGORIES).map(c => (
          <div 
            key={c} 
            className={`chip ${filterCat === c ? 'active' : ''}`} 
            onClick={() => setFilterCat(c)}
          >
            {c}
          </div>
        ))}
      </div>

      <div className="tools-bar">
        <div className="sort-filter" style={{ flexGrow: 1 }}>
          <ArrowUpDown size={16} />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="date">Ordenar por Fecha</option>
            <option value="amount">Ordenar por Cantidad</option>
            <option value="priority">Ordenar por Prioridad</option>
          </select>
        </div>
        <button className="add-btn" onClick={handleAddItem}><Plus size={20} /></button>
      </div>


      <div className="transaction-list">
        {filteredItems.length === 0 && <p className="empty">No hay registros con estos filtros.</p>}
        {filteredItems.map(item => (
          <div 
            key={item.id} 
            className={`transaction-card ${activeTab === 'expenses' && item.paid ? 'paid' : ''}`}
            onClick={() => { setEditingItem(item); setShowModal(true); }}
          >
            <div className="t-icon">
              {activeTab === 'expenses' ? (
                <span style={{ backgroundColor: CATEGORIES[item.category]?.color + '22', color: CATEGORIES[item.category]?.color }}>
                  {CATEGORIES[item.category]?.icon || '💰'}
                </span>
              ) : (
                <ArrowUpCircle color="#10b981" />
              )}
            </div>
            <div className="t-info">
              <div className="t-title">{item.title}</div>
              <div className="t-meta">
                {item.date} • {item.category || item.type}
                {item.priority === "Alta" && <span className="prio-tag">Urgente</span>}
              </div>
            </div>
            <div className="t-amount" style={{ color: activeTab === 'expenses' ? '#ef4444' : '#10b981' }}>
              {activeTab === 'expenses' ? '-' : '+'}{item.amount}€
            </div>
            {activeTab === 'expenses' && (
              <button 
                className={`paid-check ${item.paid ? 'is-paid' : ''}`} 
                onClick={(e) => { e.stopPropagation(); togglePaid(item.id); }}
              >
                {item.paid ? <CheckCircle size={20} /> : <Circle size={20} />}
              </button>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="economy-modal">
            <div className="modal-header">
              <h3>{editingItem.id ? (activeTab === 'expenses' ? 'Editar Gasto' : 'Editar Ingreso') : 'Añadir Registro'}</h3>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            <form onSubmit={handleSave}>
              <input 
                className="main-input"
                type="text" 
                placeholder="Nombre (ej: Supermercado)" 
                value={editingItem.title} 
                onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                required
              />
              <div className="amount-row">
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  value={editingItem.amount} 
                  onChange={e => setEditingItem({...editingItem, amount: e.target.value})}
                  required
                />
                <span className="currency">€</span>
              </div>

              <div className="form-grid">
                <div className="field">
                  <label>Fecha</label>
                  <input type="date" value={editingItem.date} onChange={e => setEditingItem({...editingItem, date: e.target.value})} />
                </div>
                {activeTab === 'expenses' ? (
                  <>
                    <div className="field">
                      <label>Categoría</label>
                      <select value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>
                        {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Tipo</label>
                      <select value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})}>
                        <option value="Variable">Variable</option>
                        <option value="Fijo">Fijo</option>
                        <option value="Hija">Hija</option>
                        <option value="Deuda">Deuda</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Prioridad</label>
                      <select value={editingItem.priority} onChange={e => setEditingItem({...editingItem, priority: e.target.value})}>
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <div className="field">
                    <label>Tipo de Ingreso</label>
                    <select value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})}>
                      <option value="Nómina">Nómina</option>
                      <option value="Extra">Extra</option>
                      <option value="Ayuda">Ayuda</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="check-row">
                <label className="checkbox">
                  <input type="checkbox" checked={editingItem.recurring} onChange={e => setEditingItem({...editingItem, recurring: e.target.checked})} />
                  <span>Recurrente</span>
                </label>
                {activeTab === 'expenses' && (
                  <label className="checkbox">
                    <input type="checkbox" checked={editingItem.paid} onChange={e => setEditingItem({...editingItem, paid: e.target.checked})} />
                    <span>Pagado</span>
                  </label>
                )}
              </div>

              <textarea 
                placeholder="Notas o descripción..." 
                value={editingItem.description || editingItem.notes} 
                onChange={e => setEditingItem(activeTab === 'expenses' ? {...editingItem, description: e.target.value} : {...editingItem, notes: e.target.value})}
              />

              <div className="modal-actions">
                <button type="button" className="del-btn" onClick={() => handleDelete(editingItem.id)}>Eliminar</button>
                <button type="submit" className="save-btn">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .economy-page { padding: 15px; padding-bottom: 90px; }
        .economy-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .status-badge { padding: 6px 16px; border-radius: 20px; color: white; font-weight: bold; font-size: 0.8em; }
        .status-badge.green { background: #10b981; }
        .status-badge.yellow { background: #f59e0b; }
        .status-badge.red { background: #ef4444; }

        .summary-grid { display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px; }
        .summary-card.main-balance {
          background: #1e293b;
          color: white;
          padding: 25px;
          border-radius: 24px;
          text-align: center;
        }
        .main-balance .label { opacity: 0.7; font-size: 0.9em; margin-bottom: 8px; }
        .main-balance .value { font-size: 2.5rem; font-weight: bold; margin-bottom: 8px; }
        .main-balance .sub-value { opacity: 0.5; font-size: 0.8em; }
        
        .summary-mini-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .mini-card {
          background: var(--card);
          padding: 15px;
          border-radius: 16px;
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .mini-card span { font-size: 0.75em; opacity: 0.6; }
        .mini-card strong { font-size: 1.1rem; }
        .mini-card.income { color: #10b981; }

        .economy-tabs {
          display: flex;
          background: var(--bg);
          padding: 4px;
          border-radius: 12px;
          margin-bottom: 20px;
          border: 1px solid var(--border);
        }
        .economy-tabs button {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          font-weight: bold;
          font-size: 0.9em;
          border-radius: 10px;
          color: var(--text);
          opacity: 0.6;
        }
        .economy-tabs button.active { background: var(--card); opacity: 1; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

        .tools-bar { display: flex; gap: 10px; margin-bottom: 20px; align-items: center; }
        .search-filter, .sort-filter {
          flex-grow: 1;
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--card);
          padding: 8px 12px;
          border-radius: 10px;
          border: 1px solid var(--border);
        }
        .tools-bar select { border: none; background: transparent; font-size: 0.85em; width: 100%; color: var(--text); }
        .add-btn {
          width: 45px; height: 45px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .transaction-list { display: flex; flex-direction: column; gap: 10px; }
        .transaction-card {
          background: var(--card);
          padding: 15px;
          border-radius: 16px;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 12px;
          transition: transform 0.1s;
        }
        .transaction-card:active { transform: scale(0.98); }
        .transaction-card.paid { opacity: 0.5; }
        .t-icon span {
          width: 40px; height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        .t-info { flex-grow: 1; }
        .t-title { font-weight: bold; font-size: 0.95em; }
        .t-meta { font-size: 0.75em; opacity: 0.5; display: flex; align-items: center; gap: 8px; }
        .prio-tag { color: #ef4444; font-weight: bold; }
        .t-amount { font-weight: bold; font-size: 1rem; }
        .paid-check { background: none; border: none; padding: 5px; color: #94a3b8; }
        .paid-check.is-paid { color: #10b981; }

        /* MODAL */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 1000;
        }
        .economy-modal {
          background: var(--card);
          width: 100%;
          max-width: 500px;
          padding: 25px;
          border-radius: 24px 24px 0 0;
        }
        .main-input { width: 100%; font-size: 1.3rem; font-weight: bold; border: none; border-bottom: 2px solid var(--border); padding: 10px 0; margin-bottom: 15px; }
        .amount-row { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; background: var(--bg); padding: 10px 20px; border-radius: 12px; }
        .amount-row input { font-size: 2rem; font-weight: bold; border: none; background: transparent; width: 100%; }
        .amount-row .currency { font-size: 1.5rem; font-weight: bold; opacity: 0.5; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .field label { display: block; font-size: 0.75em; font-weight: bold; opacity: 0.5; margin-bottom: 5px; }
        .check-row { display: flex; gap: 20px; margin-bottom: 15px; }
        .checkbox { display: flex; align-items: center; gap: 8px; font-size: 0.85em; }
        textarea { width: 100%; height: 60px; margin-bottom: 20px; border-radius: 12px; }
        .modal-actions { display: flex; gap: 10px; }
        .save-btn { flex-grow: 1; background: var(--primary); color: white; border: none; padding: 15px; border-radius: 12px; font-weight: bold; }
        .del-btn { background: #fee2e2; color: #ef4444; border: none; padding: 15px; border-radius: 12px; font-weight: bold; }
      `}</style>
    </div>
  );
}