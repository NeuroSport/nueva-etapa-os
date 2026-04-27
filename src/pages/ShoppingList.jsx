import { useState, useMemo } from "react";
import { generateId } from "../utils";
import Card from "../components/Card";
import { 
  ShoppingCart, 
  Plus, 
  CheckCircle, 
  Circle, 
  ShoppingBag, 
  Store, 
  Euro, 
  Trash2, 
  Star, 
  ArrowUpDown,
  Filter,
  X,
  Zap,
  ChevronRight
} from "lucide-react";

const CATEGORIES = ["Alimentación", "Limpieza", "Hija", "Hogar", "Salud", "Otros"];
const STORES = ["Mercadona", "Consum", "Lidl", "Aldi", "Carrefour", "Amazon", "Otros"];

export default function ShoppingList({ data, setData }) {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterStore, setFilterStore] = useState("Todas");
  const [sortBy, setSortBy] = useState("category"); // category, store, price

  // Cálculos
  const totalEstimated = useMemo(() => {
    return data.shoppingList.filter(i => !i.bought).reduce((sum, i) => sum + (Number(i.price) || 0), 0);
  }, [data.shoppingList]);

  const filteredList = useMemo(() => {
    return data.shoppingList
      .filter(i => filterStore === "Todas" || i.store === filterStore)
      .sort((a, b) => {
        if (sortBy === "category") return a.category.localeCompare(b.category);
        if (sortBy === "store") return a.store.localeCompare(b.store);
        if (sortBy === "price") return (Number(b.price) || 0) - (Number(a.price) || 0);
        return 0;
      });
  }, [data.shoppingList, filterStore, sortBy]);

  const handleAddItem = () => {
    setEditingItem({
      id: generateId(),
      product: "",
      quantity: "1",
      price: "",
      category: "Alimentación",
      store: "Mercadona",
      bought: false,
      frequent: false
    });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const exists = data.shoppingList.find(i => i.id === editingItem.id);
    if (exists) {
      setData({ ...data, shoppingList: data.shoppingList.map(i => i.id === editingItem.id ? editingItem : i) });
    } else {
      setData({ ...data, shoppingList: [...data.shoppingList, editingItem] });
    }
    setShowModal(false);
  };

  const toggleBought = (id) => {
    setData({
      ...data,
      shoppingList: data.shoppingList.map(i => i.id === id ? { ...i, bought: !i.bought } : i)
    });
  };

  const deleteItem = (id) => {
    setData({ ...data, shoppingList: data.shoppingList.filter(i => i.id !== id) });
    setShowModal(false);
  };

  const clearBought = () => {
    if(confirm("¿Seguro que quieres borrar todos los productos comprados?")) {
      setData({ ...data, shoppingList: data.shoppingList.filter(i => !i.bought) });
    }
  };

  return (
    <div className="page shopping-page">
      <div className="section-header pro-header">
        <h1>LISTA DE COMPRA v2.0</h1>
        <div className="total-badge">
          <Euro size={16} />
          <span>{totalEstimated.toFixed(2)}€ est.</span>
        </div>
      </div>

      <div className="shopping-tools">
        <div className="tool">
          <Store size={16} />
          <select value={filterStore} onChange={e => setFilterStore(e.target.value)}>
            <option value="Todas">Tiendas</option>
            {STORES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button className="clean-btn" onClick={clearBought} title="Limpiar comprados"><Trash2 size={18} /></button>
        <button className="add-main" onClick={handleAddItem}><Plus /></button>
      </div>

      <div className="items-list">
        {filteredList.length === 0 && <p className="empty">La lista está vacía.</p>}
        {filteredList.map(item => (
          <div key={item.id} className={`shopping-card ${item.bought ? 'bought' : ''}`}>
            <button className="check-btn" onClick={() => toggleBought(item.id)}>
              {item.bought ? <CheckCircle size={28} color="#10b981" /> : <Circle size={28} color="#94a3b8" />}
            </button>
            
            <div className="item-body" onClick={() => { setEditingItem(item); setShowModal(true); }}>
              <div className="item-title-row">
                <h3>{item.product}</h3>
                {item.frequent && <Star size={14} fill="#f59e0b" color="#f59e0b" />}
              </div>
              <div className="item-meta">
                <span>{item.quantity}</span>
                <span className="dot">•</span>
                <span>{item.category}</span>
                <span className="dot">•</span>
                <span className="store-tag">{item.store}</span>
              </div>
            </div>

            <div className="item-price">
              {item.price ? `${item.price}€` : '--'}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="shopping-modal">
            <div className="modal-header">
              <h3>{editingItem.id ? 'Editar Producto' : 'Añadir a la lista'}</h3>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            
            <form onSubmit={handleSave}>
              <input 
                className="main-input"
                type="text" 
                placeholder="¿Qué necesitas comprar?" 
                value={editingItem.product} 
                onChange={e => setEditingItem({...editingItem, product: e.target.value})}
                required
              />
              
              <div className="form-grid">
                <div className="field">
                  <label>Cantidad</label>
                  <input type="text" placeholder="Ej: 2 packs" value={editingItem.quantity} onChange={e => setEditingItem({...editingItem, quantity: e.target.value})} />
                </div>
                <div className="field">
                  <label>Precio Est. (€)</label>
                  <input type="number" step="0.01" placeholder="0.00" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: e.target.value})} />
                </div>
                <div className="field">
                  <label>Tienda</label>
                  <select value={editingItem.store} onChange={e => setEditingItem({...editingItem, store: e.target.value})}>
                    {STORES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Categoría</label>
                  <select value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="check-row">
                <label className="checkbox">
                  <input type="checkbox" checked={editingItem.frequent} onChange={e => setEditingItem({...editingItem, frequent: e.target.checked})} />
                  <span>Producto Frecuente</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="del-btn" onClick={() => deleteItem(editingItem.id)}>Eliminar</button>
                <button type="submit" className="save-btn">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .shopping-page { padding: 15px; padding-bottom: 90px; }
        .section-header.pro-header { 
          background: linear-gradient(135deg, #059669 0%, #064e3b 100%);
          margin: -15px -15px 25px -15px;
          padding: 30px 20px;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }
        .section-header.pro-header h1 { font-size: 1.2rem; letter-spacing: 1px; color: #ecfdf5; margin: 0; }
        .total-badge { background: rgba(0,0,0,0.2); padding: 6px 12px; border-radius: 20px; font-size: 0.85em; display: flex; align-items: center; gap: 8px; }

        .shopping-tools { display: flex; gap: 10px; margin-bottom: 25px; }
        .tool { flex-grow: 1; display: flex; align-items: center; gap: 8px; background: var(--card); padding: 10px; border-radius: 12px; border: 1px solid var(--border); }
        .tool select { border: none; background: transparent; width: 100%; font-size: 0.85em; color: var(--text); }
        .clean-btn { width: 45px; height: 45px; background: #fee2e2; color: #ef4444; border: none; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .add-main { width: 45px; height: 45px; background: #059669; color: white; border: none; border-radius: 12px; display: flex; align-items: center; justify-content: center; }

        .items-list { display: flex; flex-direction: column; gap: 10px; }
        .shopping-card {
          background: var(--card);
          border: 1px solid var(--border);
          padding: 15px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .shopping-card.bought { opacity: 0.4; }
        .shopping-card.bought h3 { text-decoration: line-through; }
        
        .check-btn { background: none; border: none; padding: 0; }
        .item-body { flex-grow: 1; }
        .item-title-row { display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
        .item-title-row h3 { font-size: 1rem; margin: 0; }
        .item-meta { display: flex; align-items: center; gap: 6px; font-size: 0.75em; opacity: 0.5; }
        .store-tag { font-weight: bold; color: var(--primary); }
        .item-price { font-weight: bold; color: #059669; font-size: 1rem; }

        /* MODAL */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; justify-content: center; z-index: 1000; }
        .shopping-modal { background: var(--card); width: 100%; max-width: 500px; padding: 25px; border-radius: 24px 24px 0 0; }
        .main-input { width: 100%; font-size: 1.3rem; font-weight: bold; border: none; border-bottom: 2px solid var(--border); padding: 10px 0; margin-bottom: 20px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .field label { display: block; font-size: 0.75em; font-weight: bold; opacity: 0.5; margin-bottom: 5px; }
        .check-row { margin-bottom: 20px; }
        .checkbox { display: flex; align-items: center; gap: 8px; font-size: 0.85em; }

        .modal-actions { display: flex; gap: 10px; margin-top: 20px; }
        .save-btn { flex-grow: 1; background: #059669; color: white; border: none; padding: 15px; border-radius: 12px; font-weight: bold; }
        .del-btn { background: #fee2e2; color: #ef4444; border: none; padding: 15px; border-radius: 12px; font-weight: bold; }
      `}</style>
    </div>
  );
}
