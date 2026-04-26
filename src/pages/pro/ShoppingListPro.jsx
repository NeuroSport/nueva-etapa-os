import { Calendar } from "lucide-react";
import CalendarQuickAdd from "../../components/CalendarQuickAdd";

export default function ShoppingListPro({ data, setData }) {
  const [newItem, setNewItem] = useState({ item: "", category: "Supermercado", amount: "1", estimatedPrice: "" });
  
  // Estado para el modal de programación rápida
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [itemToSchedule, setItemToSchedule] = useState(null);

  const addItem = () => {
    const itemName = newItem.item.trim();
    if (!itemName) return alert("El nombre del producto es obligatorio");
    if (itemName.length > 40) return alert("El nombre es demasiado largo");
    
    // PREVENCIÓN DE DUPLICADOS
    const isDuplicate = data.shoppingListPro.some(i => 
      !i.done && 
      i.item.toLowerCase() === itemName.toLowerCase() && 
      i.category === newItem.category
    );

    if (isDuplicate) {
      if (!window.confirm("Este producto ya está en la lista. ¿Deseas añadirlo otra vez?")) {
        return;
      }
    }

    const item = {
      id: crypto.randomUUID(),
      ...newItem,
      item: itemName,
      estimatedPrice: parseFloat(newItem.estimatedPrice) || 0,
      frequent: false,
      done: false
    };
    setData({
      ...data,
      shoppingListPro: [...data.shoppingListPro, item]
    });
    setNewItem({ item: "", category: "Supermercado", amount: "1", estimatedPrice: "" });
  };

  const toggleDone = (id) => {
    setData({
      ...data,
      shoppingListPro: data.shoppingListPro.map(item => 
        item.id === id ? { ...item, done: !item.done } : item
      )
    });
  };

  const removeItem = (id) => {
    // PROTECCIÓN DE BORRADO
    if (window.confirm("¿Seguro que quieres eliminar este producto?")) {
      setData({
        ...data,
        shoppingListPro: data.shoppingListPro.filter(item => item.id !== id)
      });
    }
  };


  const toggleFrequent = (id) => {
    setData({
      ...data,
      shoppingListPro: data.shoppingListPro.map(item => 
        item.id === id ? { ...item, frequent: !item.frequent } : item
      )
    });
  };

  const clearDone = () => {
    setData({
      ...data,
      shoppingListPro: data.shoppingListPro.filter(item => !item.done)
    });
  };

  const handleOpenSchedule = (item, e) => {
    e.stopPropagation();
    setItemToSchedule(item);
    setShowQuickAdd(true);
  };

  const saveQuickEvent = (event) => {
    setData({
      ...data,
      calendarEvents: [...(data.calendarEvents || []), event]
    });
  };

  const isScheduled = (id) => {
    return (data.calendarEvents || []).some(e => e.sourceType === 'shopping' && e.sourceId === id);
  };

  const totalEstimated = data.shoppingListPro
    .filter(i => !i.done)
    .reduce((sum, i) => sum + i.estimatedPrice, 0);

  const categories = [...new Set(data.shoppingListPro.map(i => i.category))];


  return (
    <div className="page shopping-page">
      <div className="section-header">
        <h1>Lista de Compra PRO</h1>
        <div className="total-estimate">
          <Euro size={18} />
          <span>Pendiente: {data.settings?.privacyMode ? "•••,••" : totalEstimated.toFixed(2)}€</span>
        </div>
      </div>

      <div className="shopping-controls">
        <Card title="Añadir Producto">
          <div className="add-item-form">
            <input 
              type="text" 
              placeholder="Producto (ej: Huevos)" 
              value={newItem.item}
              onChange={e => setNewItem({...newItem, item: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Cant." 
              className="qty"
              value={newItem.amount}
              onChange={e => setNewItem({...newItem, amount: e.target.value})}
            />
            <input 
              type="number" 
              placeholder="€" 
              className="price"
              value={newItem.estimatedPrice}
              onChange={e => setNewItem({...newItem, estimatedPrice: e.target.value})}
            />
            <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
              <option value="Supermercado">Super</option>
              <option value="Frutería">Fruta/Verdura</option>
              <option value="Carnicería">Carne/Pescado</option>
              <option value="Hogar">Hogar/Limpieza</option>
              <option value="Hija">Hija</option>
            </select>
            <button className="add-btn" onClick={addItem}><Plus size={20} /></button>
          </div>
        </Card>
      </div>

      <div className="list-actions">
        <button className="action-btn clear" onClick={clearDone}>Limpiar comprados</button>
      </div>

      <div className="categories-container">
        {categories.length === 0 && <p className="empty">La lista está vacía. ¡Añade algo o genera desde el menú!</p>}
        
        {categories.sort().map(cat => (
          <div key={cat} className="category-section">
            <div className="cat-header">
              <h3><Tag size={16} /> {cat}</h3>
              <button className="schedule-item-btn small" onClick={(e) => handleOpenSchedule({ item: `Compra: ${cat}`, category: 'Supermercado', id: `cat-${cat}` }, e)}>
                <Calendar size={14} />
              </button>
            </div>
            <div className="items-list">
              {data.shoppingListPro.filter(i => i.category === cat).map(item => (
                <div key={item.id} className={`shopping-item ${item.done ? 'done' : ''}`}>
                  <button className="check-btn" onClick={() => toggleDone(item.id)}>
                    {item.done ? <CheckCircle size={20} /> : <Circle size={20} />}
                  </button>
                  
                  <div className="item-details">
                    <div className="item-title-row">
                      <span className="item-name">{data.settings?.privacyMode ? "••••••••" : item.item}</span>
                      {isScheduled(item.id) && <div className="scheduled-badge min"><Calendar size={8}/></div>}
                    </div>
                    <span className="item-meta">{item.amount} • {data.settings?.privacyMode ? "•,••" : item.estimatedPrice}€</span>
                  </div>

                  <div className="item-actions">
                    <button className="action-schedule-btn" onClick={(e) => handleOpenSchedule(item, e)}>
                      <Calendar size={16} />
                    </button>
                    <button 
                      className={`freq-btn ${item.frequent ? 'active' : ''}`}
                      onClick={() => toggleFrequent(item.id)}
                    >
                      <Star size={16} />
                    </button>
                    <button className="del-btn" onClick={() => removeItem(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <CalendarQuickAdd 
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onSave={saveQuickEvent}
        data={data}
        sourceType="shopping"
        sourceId={itemToSchedule?.id}
        defaultTitle={itemToSchedule?.item}
        defaultCategory="Economía"
      />


      <style>{`
        .total-estimate {
          background: #10b981;
          color: white;
          padding: 8px 15px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: bold;
        }
        .add-item-form {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .add-item-form input { flex-grow: 1; min-width: 120px; }
        .add-item-form .qty { width: 60px; flex-grow: 0; }
        .add-item-form .price { width: 60px; flex-grow: 0; }
        .add-item-form select { width: 120px; }
        
        .list-actions {
          margin: 15px 0;
          display: flex;
          justify-content: flex-end;
        }
        .action-btn {
          font-size: 0.8em;
          padding: 6px 12px;
          border-radius: 6px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--text);
        }
        .action-btn.clear:hover { background: #fee2e2; color: #b91c1c; border-color: #fca5a5; }

        .category-section { margin-bottom: 25px; }
        .cat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .cat-header h3 {
          font-size: 0.9em;
          text-transform: uppercase;
          letter-spacing: 1px;
          opacity: 0.6;
          margin-bottom: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .items-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .shopping-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          transition: all 0.2s;
        }
        .shopping-item.done { opacity: 0.5; background: var(--bg); }
        .shopping-item.done .item-name { text-decoration: line-through; }
        
        .check-btn { background: none; border: none; padding: 0; color: var(--primary); }
        .item-details { flex-grow: 1; display: flex; flex-direction: column; }
        .item-title-row { display: flex; align-items: center; gap: 8px; }
        .item-name { font-weight: 500; }
        .item-meta { font-size: 0.75em; opacity: 0.6; }
        
        .item-actions { display: flex; gap: 5px; align-items: center; }
        .action-schedule-btn { background: none; border: none; padding: 5px; color: var(--muted); opacity: 0.3; cursor: pointer; }
        .action-schedule-btn:hover { opacity: 1; color: var(--primary); }
        .freq-btn, .del-btn {
          background: none;
          border: none;
          padding: 5px;
          color: var(--text);
          opacity: 0.3;
          transition: all 0.2s;
        }
        .freq-btn.active { opacity: 1; color: #f59e0b; }
        .del-btn:hover { opacity: 1; color: #ef4444; }
        .freq-btn:hover { opacity: 1; }
      `}</style>
    </div>
  );
}
