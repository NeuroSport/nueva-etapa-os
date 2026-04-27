import { useState } from "react";
import { Calendar, ShoppingBag, Baby, DollarSign } from "lucide-react";
import CalendarQuickAdd from "../../components/CalendarQuickAdd";
import Card from "../../components/Card";
import { generateId } from "../../utils";

export default function WeeklyMenuPro({ data, setData }) {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const dayNames = {
    monday: "Lunes", tuesday: "Martes", wednesday: "Miércoles", 
    thursday: "Jueves", friday: "Viernes", saturday: "Sábado", sunday: "Domingo"
  };

  // Estado para el modal de programación rápida
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [mealToSchedule, setMealToSchedule] = useState(null);

  const updateMenu = (day, field, value) => {
    setData({
      ...data,
      weeklyMenuPro: {
        ...data.weeklyMenuPro,
        [day]: { ...data.weeklyMenuPro[day], [field]: value }
      }
    });
  };

  const handleOpenSchedule = (day, type, meal, e) => {
    e.stopPropagation();
    setMealToSchedule({ day, type, title: meal });
    setShowQuickAdd(true);
  };

  const saveQuickEvent = (event) => {
    setData({
      ...data,
      calendarEvents: [...(data.calendarEvents || []), event]
    });
  };

  const isScheduled = (day, type) => {
    const sourceId = `${day}-${type}`;
    return (data.calendarEvents || []).some(e => e.sourceType === 'menu' && e.sourceId === sourceId);
  };

  const generateShoppingList = () => {
    const newItems = [];
    days.forEach(day => {
      const menu = data.weeklyMenuPro[day];
      if (menu.lunch) {
        newItems.push({
          id: generateId(),
          item: `Ingredientes para: ${menu.lunch}`,
          category: "Supermercado",
          amount: "1",
          estimatedPrice: menu.cheap ? 5 : 10,
          frequent: false,
          done: false
        });
      }
      if (menu.dinner) {
        newItems.push({
          id: generateId(),
          item: `Ingredientes para: ${menu.dinner}`,
          category: "Supermercado",
          amount: "1",
          estimatedPrice: menu.cheap ? 3 : 7,
          frequent: false,
          done: false
        });
      }
    });

    setData({
      ...data,
      shoppingListPro: [...data.shoppingListPro, ...newItems]
    });
    alert("¡Lista de compra generada! Revisa la sección de Compra PRO.");
  };


  return (
    <div className="page menu-page">
      <div className="section-header">
        <h1>Menú Semanal PRO</h1>
        <button className="gen-btn" onClick={generateShoppingList}>
          <ShoppingBag size={18} /> Generar Compra
        </button>
      </div>

      <div className="menu-grid">
        {days.map(day => (
          <Card key={day} title={dayNames[day]}>
            <div className="day-options">
              <label className={`toggle ${data.weeklyMenuPro[day].daughterDay ? 'active' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={data.weeklyMenuPro[day].daughterDay}
                  onChange={e => updateMenu(day, 'daughterDay', e.target.checked)}
                />
                <Baby size={14} /> Con Hija
              </label>
              <label className={`toggle ${data.weeklyMenuPro[day].cheap ? 'active' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={data.weeklyMenuPro[day].cheap}
                  onChange={e => updateMenu(day, 'cheap', e.target.checked)}
                />
                <DollarSign size={14} /> Barato
              </label>
            </div>

            <div className="meal-inputs">
              <div className="input-group">
                <div className="label-row">
                  <span>Comida</span>
                  {isScheduled(day, 'lunch') && <div className="scheduled-badge min"><Calendar size={8}/></div>}
                  {data.weeklyMenuPro[day].lunch && (
                    <button className="meal-schedule-btn" onClick={(e) => handleOpenSchedule(day, 'lunch', data.weeklyMenuPro[day].lunch, e)}>
                      <Calendar size={14} />
                    </button>
                  )}
                </div>
                <input 
                  type="text" 
                  placeholder="¿Qué vas a comer?"
                  value={data.settings?.privacyMode ? "••••••••" : data.weeklyMenuPro[day].lunch}
                  onChange={e => updateMenu(day, 'lunch', e.target.value)}
                />
              </div>
              <div className="input-group">
                <div className="label-row">
                  <span>Cena</span>
                  {isScheduled(day, 'dinner') && <div className="scheduled-badge min"><Calendar size={8}/></div>}
                  {data.weeklyMenuPro[day].dinner && (
                    <button className="meal-schedule-btn" onClick={(e) => handleOpenSchedule(day, 'dinner', data.weeklyMenuPro[day].dinner, e)}>
                      <Calendar size={14} />
                    </button>
                  )}
                </div>
                <input 
                  type="text" 
                  placeholder="¿Qué vas a cenar?"
                  value={data.settings?.privacyMode ? "••••••••" : data.weeklyMenuPro[day].dinner}
                  onChange={e => updateMenu(day, 'dinner', e.target.value)}
                />

              </div>
            </div>
          </Card>
        ))}
      </div>

      <CalendarQuickAdd 
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onSave={saveQuickEvent}
        data={data}
        sourceType="menu"
        sourceId={mealToSchedule ? `${mealToSchedule.day}-${mealToSchedule.type}` : null}
        defaultTitle={`Menú: ${mealToSchedule?.title}`}
        defaultCategory="Hogar"
      />


      <style>{`
        .gen-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: bold;
          transition: all 0.2s;
        }
        .gen-btn:hover { transform: scale(1.05); box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .day-options {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }
        .toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75em;
          padding: 4px 10px;
          border-radius: 12px;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s;
          background: var(--bg);
        }
        .toggle.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .toggle input { display: none; }
        
        .meal-inputs {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .label-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
        .label-row span {
          display: block;
          font-size: 0.7em;
          text-transform: uppercase;
          font-weight: bold;
          margin-bottom: 0;
          opacity: 0.6;
        }
        .meal-schedule-btn { background: none; border: none; padding: 2px; color: var(--muted); cursor: pointer; opacity: 0.4; }
        .meal-schedule-btn:hover { opacity: 1; color: var(--primary); }
        .scheduled-badge.min { padding: 2px 4px; border-radius: 4px; }
        .input-group input {
          width: 100%;
          background: var(--bg);
          border: 1px solid var(--border);
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
}
