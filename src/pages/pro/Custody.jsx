import { useState } from "react";
import { generateId } from "../../utils";
import Card from "../../components/Card";
import { Calendar as CalendarIcon, Heart, Baby, Plus, Trash2, DollarSign, Stethoscope, School } from "lucide-react";

export default function Custody({ data, setData }) {
  const [newExpense, setNewExpense] = useState({ title: "", amount: "", category: "General" });
  const [newEvent, setNewEvent] = useState({ date: "", title: "", type: "hija" });

  const addExpense = () => {
    if (!newExpense.title || !newExpense.amount) return;
    const expense = {
      id: generateId(),
      ...newExpense,
      amount: parseFloat(newExpense.amount),
      date: new Date().toISOString().split('T')[0]
    };
    setData({
      ...data,
      custody: {
        ...data.custody,
        daughterExpenses: [expense, ...data.custody.daughterExpenses]
      }
    });
    setNewExpense({ title: "", amount: "", category: "General" });
  };

  const addEvent = () => {
    if (!newEvent.date || !newEvent.title) return;
    setData({
      ...data,
      custody: {
        ...data.custody,
        calendar: [...data.custody.calendar, { ...newEvent, id: generateId() }]
      }
    });
    setNewEvent({ date: "", title: "", type: "hija" });
  };

  const removeEvent = (id) => {
    setData({
      ...data,
      custody: {
        ...data.custody,
        calendar: data.custody.calendar.filter(e => e.id !== id)
      }
    });
  };

  const totalSpent = data.custody.daughterExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="page custody-page">
      <div className="section-header">
        <h1>Custodia y Tiempo Compartido</h1>
        <div className="badge"><Heart size={14} /> Tiempo de Calidad</div>
      </div>

      <div className="custody-grid">
        <div className="left-col">
          <Card title="Calendario y Eventos">
            <div className="event-form">
              <input 
                type="date" 
                value={newEvent.date} 
                onChange={e => setNewEvent({...newEvent, date: e.target.value})} 
              />
              <input 
                type="text" 
                placeholder="Título del evento (ej: Fin de semana)" 
                value={newEvent.title}
                onChange={e => setNewEvent({...newEvent, title: e.target.value})}
              />
              <select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})}>
                <option value="hija">Conmigo</option>
                <option value="escuela">Escuela</option>
                <option value="medico">Médico</option>
                <option value="vacaciones">Vacaciones</option>
              </select>
              <button className="add-btn" onClick={addEvent}><Plus size={20} /></button>
            </div>

            <div className="events-list">
              {data.custody.calendar.sort((a,b) => new Date(a.date) - new Date(b.date)).map(event => (
                <div key={event.id} className={`event-item ${event.type}`}>
                  <div className="event-date">{new Date(event.date).toLocaleDateString()}</div>
                  <div className="event-title">{event.title}</div>
                  <button onClick={() => removeEvent(event.id)} className="delete-btn"><Trash2 size={16} /></button>
                </div>
              ))}
              {data.custody.calendar.length === 0 && <p className="empty">No hay eventos programados.</p>}
            </div>
          </Card>
        </div>

        <div className="right-col">
          <Card title="Gastos Hija">
            <div className="total-badge">
              <DollarSign size={20} />
              <span>Total acumulado: {totalSpent}€</span>
            </div>

            <div className="expense-form">
              <input 
                type="text" 
                placeholder="Concepto (Ropa, comida...)" 
                value={newExpense.title}
                onChange={e => setNewExpense({...newExpense, title: e.target.value})}
              />
              <input 
                type="number" 
                placeholder="€" 
                value={newExpense.amount}
                onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
              />
              <button className="add-btn" onClick={addExpense}><Plus size={20} /></button>
            </div>

            <div className="expenses-list">
              {data.custody.daughterExpenses.map(exp => (
                <div key={exp.id} className="expense-item">
                  <div className="info">
                    <strong>{exp.title}</strong>
                    <span>{exp.date}</span>
                  </div>
                  <div className="amount">{exp.amount}€</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        .custody-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 900px) {
          .custody-grid {
            grid-template-columns: 1.5fr 1fr;
          }
        }
        .event-form, .expense-form {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .event-form input[type="text"] { flex-grow: 1; }
        .events-list, .expenses-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .event-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px;
          background: var(--bg);
          border-radius: 10px;
          border-left: 4px solid var(--primary);
        }
        .event-item.hija { border-left-color: #ec4899; }
        .event-item.medico { border-left-color: #ef4444; }
        .event-item.escuela { border-left-color: #3b82f6; }
        .event-item.vacaciones { border-left-color: #f59e0b; }
        
        .event-date { font-weight: bold; font-size: 0.85em; width: 90px; }
        .event-title { flex-grow: 1; }
        
        .expense-item {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          border-bottom: 1px solid var(--border);
        }
        .expense-item .info { display: flex; flex-direction: column; }
        .expense-item span { font-size: 0.75em; opacity: 0.6; }
        .expense-item .amount { font-weight: bold; color: var(--primary); }
        
        .total-badge {
          background: var(--primary);
          color: white;
          padding: 15px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
