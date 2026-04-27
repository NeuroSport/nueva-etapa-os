import { useState } from "react";
import { generateId } from "../../utils";
import Card from "../../components/Card";
import { ArrowUp, PiggyBank, Wallet, Calendar, Trash2 } from "lucide-react";
import CalendarQuickAdd from "../../components/CalendarQuickAdd";

export default function BudgetPro({ data, setData }) {
  const [newFixed, setNewFixed] = useState({ title: "", amount: "" });
  const [newDebt, setNewDebt] = useState({ title: "", amount: "" });

  // Estado para el modal de programación rápida
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [itemToSchedule, setItemToSchedule] = useState(null);

  const totalFixed = data.budgetPro.fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalDaughter = data.custody.daughterExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalVariable = data.expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalDebts = data.budgetPro.debts.reduce((sum, e) => sum + e.amount, 0);
  
  const totalExpenses = totalFixed + totalDaughter + totalVariable + totalDebts;
  const netAvailable = data.budgetPro.income - totalExpenses - data.budgetPro.savingsGoal;
  const weeklyAvailable = netAvailable / 4;

  const getStatusColor = () => {
    if (netAvailable > 500) return "#10b981"; // Verde
    if (netAvailable > 100) return "#f59e0b"; // Amarillo
    return "#ef4444"; // Rojo
  };

  const addFixed = () => {
    const title = newFixed.title.trim();
    const amount = parseFloat(newFixed.amount);

    if (!title || isNaN(amount)) return alert("Nombre y cantidad son obligatorios");

    // PREVENCIÓN DE DUPLICADOS
    const isDuplicate = data.budgetPro.fixedExpenses.some(e => e.title.toLowerCase() === title.toLowerCase());
    if (isDuplicate) {
      if (!window.confirm("Ya existe un gasto fijo con este nombre. ¿Deseas añadirlo igualmente?")) return;
    }

    setData({
      ...data,
      budgetPro: {
        ...data.budgetPro,
        fixedExpenses: [...data.budgetPro.fixedExpenses, { id: generateId(), title, amount }]
      }
    });
    setNewFixed({ title: "", amount: "" });
  };

  const removeFixed = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este gasto fijo?")) {
      setData({
        ...data,
        budgetPro: {
          ...data.budgetPro,
          fixedExpenses: data.budgetPro.fixedExpenses.filter(e => e.id !== id)
        }
      });
    }
  };


  const handleOpenSchedule = (item, type, e) => {
    e.stopPropagation();
    setItemToSchedule({ ...item, type });
    setShowQuickAdd(true);
  };

  const saveQuickEvent = (event) => {
    setData({
      ...data,
      calendarEvents: [...(data.calendarEvents || []), event]
    });
  };

  const isScheduled = (id, type) => {
    return (data.calendarEvents || []).some(e => e.sourceType === type && e.sourceId === id);
  };


  return (
    <div className="page budget-page">
      <div className="section-header">
        <h1>Presupuesto Mensual PRO</h1>
        <div className="traffic-light" style={{ backgroundColor: getStatusColor() }}>
          {netAvailable > 100 ? "Estado: Saludable" : "Estado: Crítico"}
        </div>
      </div>

      <div className="budget-summary">
        <div className="summary-card income">
          <ArrowUp size={24} />
          <div>
            <span>Ingresos</span>
            <input 
              type="number" 
              value={data.budgetPro.income} 
              onChange={e => setData({...data, budgetPro: {...data.budgetPro, income: parseFloat(e.target.value) || 0}})}
            />
          </div>
        </div>
        <div className="summary-card savings">
          <PiggyBank size={24} />
          <div>
            <span>Meta Ahorro</span>
            <input 
              type="number" 
              value={data.budgetPro.savingsGoal} 
              onChange={e => setData({...data, budgetPro: {...data.budgetPro, savingsGoal: parseFloat(e.target.value) || 0}})}
            />
          </div>
        </div>
        <div className="summary-card available">
          <Wallet size={24} />
          <div>
            <span>Libre Semanal</span>
            <strong>{data.settings?.privacyMode ? "•••,••€" : `${weeklyAvailable.toFixed(2)}€`}</strong>
          </div>
        </div>
      </div>

      <div className="budget-grid">
        <div className="left-col">
          <Card title="Gastos Fijos (Alquiler, Luz, etc)">
            <div className="mini-form">
              <input type="text" placeholder="Concepto" value={newFixed.title} onChange={e => setNewFixed({...newFixed, title: e.target.value})} />
              <input type="number" placeholder="€" value={newFixed.amount} onChange={e => setNewFixed({...newFixed, amount: e.target.value})} />
              <button onClick={addFixed} className="add-btn">Añadir</button>
            </div>
            <div className="fixed-list">
              {data.budgetPro.fixedExpenses.map(e => (
                <div key={e.id} className="budget-item">
                  <div className="b-info">
                    <span>{e.title}</span>
                    {isScheduled(e.id, 'budget-fixed') && <div className="scheduled-badge min"><Calendar size={8}/></div>}
                  </div>
                  <div className="b-actions">
                    <strong>{data.settings?.privacyMode ? "•••€" : `${e.amount}€`}</strong>
                    <button className="action-schedule-btn" onClick={(e_opt) => handleOpenSchedule(e, 'budget-fixed', e_opt)}>
                      <Calendar size={14} />
                    </button>
                    <button className="del-btn-min" onClick={() => removeFixed(e.id)}><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
              <div className="total-row">Total: {data.settings?.privacyMode ? "••••€" : `${totalFixed}€`}</div>
            </div>
          </Card>

          <Card title="Deudas / Préstamos">
            <div className="fixed-list">
              {data.budgetPro.debts.map(e => (
                <div key={e.id} className="budget-item debt">
                  <div className="b-info">
                    <span>{e.title}</span>
                    {isScheduled(e.id, 'budget-debt') && <div className="scheduled-badge min"><Calendar size={8}/></div>}
                  </div>
                  <div className="b-actions">
                    <strong>{e.amount}€</strong>
                    <button className="action-schedule-btn" onClick={(e_opt) => handleOpenSchedule(e, 'budget-debt', e_opt)}>
                      <Calendar size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {data.budgetPro.debts.length === 0 && <p className="empty">Sin deudas registradas. ¡Genial!</p>}
            </div>
          </Card>
        </div>

        <div className="right-col">
          <Card title="Desglose Mensual">
            <div className="breakdown">
              <div className="b-item"><span>Gastos Fijos</span> <span>{data.settings?.privacyMode ? "••••€" : `-${totalFixed}€`}</span></div>
              <div className="b-item"><span>Gastos Variables</span> <span>{data.settings?.privacyMode ? "••••€" : `-${totalVariable}€`}</span></div>
              <div className="b-item"><span>Gastos Hija</span> <span>{data.settings?.privacyMode ? "••••€" : `-${totalDaughter}€`}</span></div>
              <div className="b-item"><span>Deudas</span> <span>{data.settings?.privacyMode ? "••••€" : `-${totalDebts}€`}</span></div>
              <div className="b-item highlight"><span>Meta Ahorro</span> <span>{data.settings?.privacyMode ? "••••€" : `-${data.budgetPro.savingsGoal}€`}</span></div>
              <hr />
              <div className="b-total" style={{ color: getStatusColor() }}>
                <span>DINERO DISPONIBLE</span>
                <span>{data.settings?.privacyMode ? "••••,••€" : `${netAvailable.toFixed(2)}€`}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <CalendarQuickAdd 
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onSave={saveQuickEvent}
        data={data}
        sourceType={itemToSchedule?.type}
        sourceId={itemToSchedule?.id}
        defaultTitle={`Pago: ${itemToSchedule?.title}`}
        defaultCategory="Economía"
      />


      <style>{`
        .traffic-light {
          padding: 6px 15px;
          border-radius: 20px;
          color: white;
          font-weight: bold;
          font-size: 0.85em;
        }
        .budget-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 25px;
        }
        .summary-card {
          background: var(--card);
          padding: 20px;
          border-radius: 16px;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .summary-card.income { border-left: 5px solid #10b981; }
        .summary-card.savings { border-left: 5px solid #3b82f6; }
        .summary-card.available { border-left: 5px solid #8b5cf6; }
        
        .summary-card span { font-size: 0.8em; opacity: 0.6; display: block; }
        .summary-card input { 
          width: 100px; 
          font-size: 1.2rem; 
          font-weight: bold; 
          background: transparent; 
          border: none; 
          margin: 0; 
          padding: 0;
        }
        .summary-card strong { font-size: 1.2rem; }

        .budget-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 900px) { .budget-grid { grid-template-columns: 1fr 1fr; } }
        
        .mini-form { display: flex; gap: 8px; margin-bottom: 15px; }
        .mini-form input { flex-grow: 1; }
        
        .budget-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid var(--border);
        }
        .b-info { display: flex; align-items: center; gap: 8px; }
        .b-actions { display: flex; align-items: center; gap: 10px; }
        .action-schedule-btn { background: none; border: none; padding: 4px; color: var(--muted); cursor: pointer; opacity: 0.3; }
        .action-schedule-btn:hover { opacity: 1; color: var(--primary); }
        .scheduled-badge.min { padding: 2px 4px; border-radius: 4px; }
        .budget-item.debt { color: #ef4444; }
        .del-btn-min { background: none; border: none; padding: 4px; color: #ef4444; opacity: 0.3; cursor: pointer; transition: all 0.2s; }
        .del-btn-min:hover { opacity: 1; }
        .total-row { text-align: right; font-weight: bold; padding: 10px; opacity: 0.7; }
        
        .breakdown { display: flex; flex-direction: column; gap: 12px; }
        .b-item { display: flex; justify-content: space-between; font-size: 0.95em; }
        .b-item.highlight { color: #3b82f6; font-weight: 500; }
        .b-total {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          font-size: 1.1rem;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}
