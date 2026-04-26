import { useState } from "react";
import Card from "../../components/Card";
import { Utensils, Baby, DollarSign, ShoppingBag, Save, Trash2, Plus } from "lucide-react";

export default function WeeklyMenuPro({ data, setData }) {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const dayNames = {
    monday: "Lunes", tuesday: "Martes", wednesday: "Miércoles", 
    thursday: "Jueves", friday: "Viernes", saturday: "Sábado", sunday: "Domingo"
  };

  const updateMenu = (day, field, value) => {
    setData({
      ...data,
      weeklyMenuPro: {
        ...data.weeklyMenuPro,
        [day]: { ...data.weeklyMenuPro[day], [field]: value }
      }
    });
  };

  const generateShoppingList = () => {
    const newItems = [];
    days.forEach(day => {
      const menu = data.weeklyMenuPro[day];
      if (menu.lunch) {
        newItems.push({
          id: crypto.randomUUID(),
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
          id: crypto.randomUUID(),
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
                <span>Comida</span>
                <input 
                  type="text" 
                  placeholder="¿Qué vas a comer?"
                  value={data.weeklyMenuPro[day].lunch}
                  onChange={e => updateMenu(day, 'lunch', e.target.value)}
                />
              </div>
              <div className="input-group">
                <span>Cena</span>
                <input 
                  type="text" 
                  placeholder="¿Qué vas a cenar?"
                  value={data.weeklyMenuPro[day].dinner}
                  onChange={e => updateMenu(day, 'dinner', e.target.value)}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

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
        .input-group span {
          display: block;
          font-size: 0.7em;
          text-transform: uppercase;
          font-weight: bold;
          margin-bottom: 4px;
          opacity: 0.6;
        }
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
