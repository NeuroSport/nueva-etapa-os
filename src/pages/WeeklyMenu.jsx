import { useState } from "react";
import Card from "../components/Card";
import { 
  Utensils, 
  Coffee, 
  Sun, 
  Moon, 
  Baby, 
  Euro, 
  Plus, 
  ShoppingCart, 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Clock,
  HeartPulse,
  Coins
} from "lucide-react";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function WeeklyMenu({ data, setData }) {
  const [activeDay, setActiveDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [showModal, setShowModal] = useState(false);
  const [editingDay, setEditingDay] = useState(null);

  const handleEditDay = (day) => {
    setEditingDay({
      name: day,
      ...data.weeklyMenu[day]
    });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setData({
      ...data,
      weeklyMenu: {
        ...data.weeklyMenu,
        [editingDay.name]: {
          breakfast: editingDay.breakfast,
          lunch: editingDay.lunch,
          dinner: editingDay.dinner,
          daughterMode: editingDay.daughterMode,
          cost: editingDay.cost
        }
      }
    });
    setShowModal(false);
  };

  const totalWeeklyCost = Object.values(data.weeklyMenu).reduce((sum, d) => sum + (Number(d.cost) || 0), 0);

  return (
    <div className="page menu-page">
      <div className="section-header pro-header">
        <h1>MENÚ SEMANAL v2.0</h1>
        <div className="total-badge">
          <Euro size={16} />
          <span>{totalWeeklyCost.toFixed(2)}€ / semana</span>
        </div>
      </div>

      <div className="day-selector">
        {DAYS.map(d => (
          <button 
            key={d} 
            className={`${activeDay === d ? 'active' : ''} ${data.weeklyMenu[d].daughterMode ? 'hija' : ''}`}
            onClick={() => setActiveDay(d)}
          >
            {d.substring(0, 2)}
          </button>
        ))}
      </div>

      <main className="menu-content">
        <div className="active-day-card">
          <div className="day-title-row">
            <h2>{activeDay}</h2>
            {data.weeklyMenu[activeDay].daughterMode && (
              <div className="hija-tag">
                <Baby size={14} /> <span>Modo Hija</span>
              </div>
            )}
          </div>

          <div className="meals-list">
            <div className="meal-item" onClick={() => handleEditDay(activeDay)}>
              <Coffee size={20} color="#f59e0b" />
              <div className="m-info">
                <label>Desayuno</label>
                <p>{data.weeklyMenu[activeDay].breakfast || "No planeado"}</p>
              </div>
            </div>
            <div className="meal-item" onClick={() => handleEditDay(activeDay)}>
              <Sun size={20} color="#ef4444" />
              <div className="m-info">
                <label>Comida</label>
                <p>{data.weeklyMenu[activeDay].lunch || "No planeado"}</p>
              </div>
            </div>
            <div className="meal-item" onClick={() => handleEditDay(activeDay)}>
              <Moon size={20} color="#3b82f6" />
              <div className="m-info">
                <label>Cena</label>
                <p>{data.weeklyMenu[activeDay].dinner || "No planeado"}</p>
              </div>
            </div>
          </div>

          <div className="day-footer">
            <div className="cost-info">
              <Euro size={16} /> <span>Coste: {data.weeklyMenu[activeDay].cost}€</span>
            </div>
            <button className="edit-btn" onClick={() => handleEditDay(activeDay)}>Editar Día</button>
          </div>
        </div>

        <div className="ia-menu-tools">
          <h3>Sugerencias IA</h3>
          <div className="ia-grid">
            <button className="ia-btn cheap"><Coins size={16} /> Barato</button>
            <button className="ia-btn health"><HeartPulse size={16} /> Saludable</button>
            <button className="ia-btn quick"><Clock size={16} /> Rápido</button>
          </div>
          <button className="gen-list-btn"><ShoppingCart size={18} /> Generar Lista de Compra</button>
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="menu-modal">
            <div className="modal-header">
              <h3>Planificar {editingDay.name}</h3>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="field">
                <label><Coffee size={14} /> Desayuno</label>
                <input type="text" value={editingDay.breakfast} onChange={e => setEditingDay({...editingDay, breakfast: e.target.value})} />
              </div>
              <div className="field">
                <label><Sun size={14} /> Comida</label>
                <input type="text" value={editingDay.lunch} onChange={e => setEditingDay({...editingDay, lunch: e.target.value})} />
              </div>
              <div className="field">
                <label><Moon size={14} /> Cena</label>
                <input type="text" value={editingDay.dinner} onChange={e => setEditingDay({...editingDay, dinner: e.target.value})} />
              </div>
              
              <div className="form-grid">
                <div className="field">
                  <label>Coste Est. (€)</label>
                  <input type="number" value={editingDay.cost} onChange={e => setEditingDay({...editingDay, cost: e.target.value})} />
                </div>
                <div className="field daughter-toggle">
                  <label>Modo Hija</label>
                  <button 
                    type="button" 
                    className={editingDay.daughterMode ? 'active' : ''}
                    onClick={() => setEditingDay({...editingDay, daughterMode: !editingDay.daughterMode})}
                  >
                    <Baby size={18} /> {editingDay.daughterMode ? 'SI' : 'NO'}
                  </button>
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">Guardar Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .menu-page { padding: 15px; padding-bottom: 90px; }
        .section-header.pro-header { 
          background: linear-gradient(135deg, #f97316 0%, #c2410c 100%);
          margin: -15px -15px 25px -15px;
          padding: 30px 20px;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }
        .section-header.pro-header h1 { font-size: 1.2rem; letter-spacing: 1px; color: #fff7ed; margin: 0; }
        .total-badge { background: rgba(0,0,0,0.2); padding: 6px 12px; border-radius: 20px; font-size: 0.85em; display: flex; align-items: center; gap: 8px; }

        .day-selector { display: flex; justify-content: space-between; gap: 5px; margin-bottom: 25px; }
        .day-selector button {
          flex: 1;
          background: var(--card);
          border: 1px solid var(--border);
          padding: 10px 0;
          border-radius: 12px;
          font-size: 0.8em;
          font-weight: bold;
          color: var(--text);
        }
        .day-selector button.active { background: #f97316; color: white; border-color: #f97316; }
        .day-selector button.hija { border-bottom: 3px solid #ec4899; }

        .active-day-card { background: var(--card); border: 1px solid var(--border); border-radius: 24px; padding: 25px; margin-bottom: 25px; }
        .day-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .day-title-row h2 { margin: 0; font-size: 1.5rem; }
        .hija-tag { display: flex; align-items: center; gap: 5px; background: #fff1f2; color: #ec4899; padding: 4px 10px; border-radius: 20px; font-size: 0.75em; font-weight: bold; }

        .meals-list { display: flex; flex-direction: column; gap: 20px; }
        .meal-item { display: flex; gap: 15px; align-items: flex-start; cursor: pointer; }
        .m-info label { display: block; font-size: 0.7em; font-weight: bold; opacity: 0.5; text-transform: uppercase; margin-bottom: 2px; }
        .m-info p { margin: 0; font-size: 1rem; font-weight: 500; }

        .day-footer { margin-top: 25px; padding-top: 20px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .cost-info { display: flex; align-items: center; gap: 5px; font-size: 0.9em; opacity: 0.7; }
        .edit-btn { background: var(--bg); border: 1px solid var(--border); padding: 8px 15px; border-radius: 10px; font-size: 0.85em; font-weight: bold; }

        .ia-menu-tools { background: #f8fafc; padding: 20px; border-radius: 20px; border: 1px solid var(--border); }
        .ia-menu-tools h3 { margin: 0 0 15px 0; font-size: 0.9rem; opacity: 0.6; }
        .ia-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px; }
        .ia-btn { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 12px; border-radius: 12px; border: none; color: white; font-size: 0.75em; font-weight: bold; }
        .ia-btn.cheap { background: #10b981; }
        .ia-btn.health { background: #3b82f6; }
        .ia-btn.quick { background: #8b5cf6; }
        .gen-list-btn { width: 100%; background: #1e293b; color: white; border: none; padding: 15px; border-radius: 12px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px; }

        /* MODAL */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; justify-content: center; z-index: 1000; }
        .menu-modal { background: var(--card); width: 100%; max-width: 500px; padding: 25px; border-radius: 24px 24px 0 0; }
        .menu-modal .field { margin-bottom: 15px; }
        .menu-modal label { display: flex; align-items: center; gap: 8px; font-size: 0.8em; font-weight: bold; opacity: 0.5; margin-bottom: 8px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px; }
        .daughter-toggle button { width: 100%; height: 45px; border: 1px solid var(--border); background: var(--bg); border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: bold; }
        .daughter-toggle button.active { background: #fff1f2; color: #ec4899; border-color: #fecdd3; }
        .save-btn { width: 100%; background: #f97316; color: white; border: none; padding: 18px; border-radius: 12px; font-weight: bold; font-size: 1rem; margin-top: 10px; }
      `}</style>
    </div>
  );
}
