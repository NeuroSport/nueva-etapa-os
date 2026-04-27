import React, { useState, useEffect } from 'react';
import { generateId } from '../utils';
import { X, Calendar as CalendarIcon, Clock, Star, AlertTriangle, Save } from 'lucide-react';

const CATEGORIES = {
  Hija: { color: "#10b981" },
  Trabajo: { color: "#3b82f6" },
  Economía: { color: "#f59e0b" },
  Personal: { color: "#8b5cf6" },
  Salud: { color: "#fb7185" },
  Casa: { color: "#64748b" },
  Legal: { color: "#facc15" },
  Ocio: { color: "#06b6d4" },
  Familia: { color: "#ec4899" },
  Urgente: { color: "#ef4444" }
};

const CalendarQuickAdd = ({ 
  isOpen, 
  onClose, 
  onSave, 
  data,
  sourceType, 
  sourceId, 
  defaultTitle = "", 
  defaultDescription = "", 
  defaultCategory = "Personal",
  defaultNotes = "" 
}) => {
  const [event, setEvent] = useState({
    id: generateId(),
    title: defaultTitle,
    description: defaultDescription,
    date: new Date().toISOString().split('T')[0],
    startTime: "10:00",
    endTime: "11:00",
    category: defaultCategory,
    priority: "Media",
    status: "Pendiente",
    important: false,
    completed: false,
    notes: defaultNotes,
    sourceType,
    sourceId
  });

  const [warning, setWarning] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Inteligencia de categorías según el origen
      let category = defaultCategory;
      if (sourceType === 'budget') category = 'Economía';
      if (sourceType === 'daughter' || sourceType === 'custody') category = 'Hija';
      if (sourceType === 'needs') category = 'Casa';
      if (sourceType === 'alicante') category = 'Ocio';
      if (sourceType === 'tasks' && defaultCategory === 'Personal') category = 'Personal';

      setEvent(prev => ({
        ...prev,
        id: generateId(),
        title: defaultTitle,
        description: defaultDescription,
        category: category,
        notes: defaultNotes,
        sourceType,
        sourceId
      }));
      setWarning(null);
    }
  }, [isOpen, sourceType, sourceId, defaultTitle, defaultDescription, defaultCategory, defaultNotes]);

  const checkDuplicate = () => {
    const existing = (data.calendarEvents || []).find(e => 
      e.sourceType === sourceType && 
      e.sourceId === sourceId && 
      e.date === event.date &&
      e.title === event.title
    );
    return existing;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!warning && checkDuplicate()) {
      setWarning("Ya existe un evento igual programado para este día. ¿Deseas duplicarlo?");
      return;
    }
    onSave(event);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="quick-add-overlay">
      <div className="quick-add-modal">
        <div className="qa-header">
          <div className="qa-title-group">
            <CalendarIcon size={20} className="qa-icon" />
            <h3>Programar en Calendario</h3>
          </div>
          <button className="close-btn" type="button" onClick={onClose}><X /></button>
        </div>

        <form onSubmit={handleSave}>
          <div className="qa-section">
            <label>Título del Compromiso</label>
            <input 
              type="text" 
              className="qa-input main-input" 
              value={event.title} 
              onChange={e => setEvent({...event, title: e.target.value})}
              required 
            />
          </div>

          <div className="qa-row">
            <div className="qa-section">
              <label>Fecha</label>
              <input 
                type="date" 
                className="qa-input" 
                value={event.date} 
                onChange={e => setEvent({...event, date: e.target.value})}
                required 
              />
            </div>
            <div className="qa-section">
              <label>Horario</label>
              <div className="time-inputs">
                <input 
                  type="time" 
                  className="qa-input small" 
                  value={event.startTime} 
                  onChange={e => setEvent({...event, startTime: e.target.value})} 
                />
                <span style={{color: 'var(--text)', opacity: 0.5}}>-</span>
                <input 
                  type="time" 
                  className="qa-input small" 
                  value={event.endTime} 
                  onChange={e => setEvent({...event, endTime: e.target.value})} 
                />
              </div>
            </div>
          </div>

          <div className="qa-row">
            <div className="qa-section">
              <label>Categoría</label>
              <select 
                className="qa-input" 
                value={event.category} 
                onChange={e => setEvent({...event, category: e.target.value})}
              >
                {Object.keys(CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="qa-section">
              <label>Prioridad</label>
              <select 
                className="qa-input" 
                value={event.priority} 
                onChange={e => setEvent({...event, priority: e.target.value})}
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>

          <div className="qa-checkboxes">
            <label className={`qa-check ${event.important ? 'active' : ''}`}>
              <input 
                type="checkbox" 
                checked={event.important} 
                onChange={e => setEvent({...event, important: e.target.checked})} 
              />
              <Star size={16} fill={event.important ? "#f59e0b" : "transparent"} color={event.important ? "#f59e0b" : "currentColor"} />
              <span>Marcar como Importante</span>
            </label>
          </div>

          {warning && (
            <div className="qa-warning">
              <AlertTriangle size={18} />
              <p>{warning}</p>
            </div>
          )}

          <button type="submit" className="qa-save-btn">
            <Save size={20} />
            {warning ? "Confirmar Duplicado" : "Guardar en Calendario"}
          </button>
        </form>
      </div>

      <style>{`
        .quick-add-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 2000;
          padding: 0;
        }
        @media (min-width: 600px) {
          .quick-add-overlay { align-items: center; padding: 20px; }
        }

        .quick-add-modal {
          background: var(--card);
          width: 100%;
          max-width: 500px;
          padding: 24px;
          border-radius: 24px 24px 0 0;
          box-shadow: 0 -10px 40px rgba(0,0,0,0.2);
          animation: slideUp 0.3s ease-out;
        }
        @media (min-width: 600px) {
          .quick-add-modal { border-radius: 24px; }
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .qa-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .qa-title-group { display: flex; align-items: center; gap: 10px; }
        .qa-icon { color: var(--primary); }
        .qa-header h3 { margin: 0; font-size: 1.2rem; color: var(--text); }
        .close-btn { background: var(--bg); border: none; padding: 8px; border-radius: 50%; color: var(--text); cursor: pointer; }

        .qa-section { margin-bottom: 18px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .qa-section label { font-size: 0.75rem; font-weight: bold; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text); }
        
        .qa-input {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: 1.5px solid var(--border);
          background: var(--bg);
          color: var(--text);
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .qa-input:focus { outline: none; border-color: var(--primary); }
        .qa-input.main-input { font-size: 1.1rem; font-weight: bold; }

        .qa-row { display: flex; gap: 12px; width: 100%; }
        .time-inputs { display: flex; align-items: center; gap: 8px; }
        .qa-input.small { padding: 10px; font-size: 0.9rem; }

        .qa-checkboxes { margin: 10px 0 24px 0; }
        .qa-check {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border-radius: 12px;
          background: var(--bg);
          border: 1.5px solid var(--border);
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text);
        }
        .qa-check.active { border-color: #f59e0b; background: rgba(245, 158, 11, 0.1); }
        .qa-check input { display: none; }
        .qa-check span { font-size: 0.9rem; font-weight: 500; }

        .qa-warning {
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid #fed7aa;
          color: #9a3412;
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 20px;
          display: flex;
          gap: 10px;
          align-items: center;
          font-size: 0.85rem;
        }

        .qa-save-btn {
          width: 100%;
          padding: 16px;
          border-radius: 16px;
          border: none;
          background: var(--primary);
          color: white;
          font-weight: bold;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
          transition: transform 0.1s;
          cursor: pointer;
        }
        .qa-save-btn:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
};

export default CalendarQuickAdd;
