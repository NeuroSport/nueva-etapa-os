import { useState } from "react";
import Card from "../../components/Card";
import { Wallet, ArrowDown, ArrowUp, Target, AlertCircle, TrendingDown, PiggyBank } from "lucide-react";

export default function BudgetPro({ data, setData }) {
  const [newFixed, setNewFixed] = useState({ title: "", amount: "" });
  const [newDebt, setNewDebt] = useState({ title: "", amount: "" });

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
    if (!newFixed.title || !newFixed.amount) return;
    setData({
      ...data,
      budgetPro: {
        ...data.budgetPro,
        fixedExpenses: [...data.budgetPro.fixedExpenses, { id: crypto.randomUUID(), title: newFixed.title, amount: parseFloat(newFixed.amount) }]
      }
    });
    setNewFixed({ title: "", amount: "" });
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
            <strong>{weeklyAvailable.toFixed(2)}€</strong>
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
                  <span>{e.title}</span>
                  <strong>{e.amount}€</strong>
                </div>
              ))}
              <div className="total-row">Total: {totalFixed}€</div>
            </div>
          </Card>

          <Card title="Deudas / Préstamos">
            <div className="fixed-list">
              {data.budgetPro.debts.map(e => (
                <div key={e.id} className="budget-item debt">
                  <span>{e.title}</span>
                  <strong>{e.amount}€</strong>
                </div>
              ))}
              {data.budgetPro.debts.length === 0 && <p className="empty">Sin deudas registradas. ¡Genial!</p>}
            </div>
          </Card>
        </div>

        <div className="right-col">
          <Card title="Desglose Mensual">
            <div className="breakdown">
              <div className="b-item"><span>Gastos Fijos</span> <span>-{totalFixed}€</span></div>
              <div className="b-item"><span>Gastos Variables</span> <span>-{totalVariable}€</span></div>
              <div className="b-item"><span>Gastos Hija</span> <span>-{totalDaughter}€</span></div>
              <div className="b-item"><span>Deudas</span> <span>-{totalDebts}€</span></div>
              <div className="b-item highlight"><span>Meta Ahorro</span> <span>-{data.budgetPro.savingsGoal}€</span></div>
              <hr />
              <div className="b-total" style={{ color: getStatusColor() }}>
                <span>DINERO DISPONIBLE</span>
                <span>{netAvailable.toFixed(2)}€</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

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
          padding: 10px;
          border-bottom: 1px solid var(--border);
        }
        .budget-item.debt { color: #ef4444; }
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
