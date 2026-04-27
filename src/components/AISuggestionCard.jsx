import React from 'react';
import { Calendar as CalendarIcon, Clock, MoveRight, Plus, Check, X, Coffee, Baby, Wallet } from 'lucide-react';

export default function AISuggestionCard({ suggestion, onAccept, onReject }) {
  
  const getIcon = () => {
    switch(suggestion.type) {
      case 'move_event': return <MoveRight size={20} color="#3b82f6" />;
      case 'add_rest_block': return <Coffee size={20} color="#8b5cf6" />;
      case 'schedule_task': return <Plus size={20} color="#10b981" />;
      case 'add_daughter_plan': return <Baby size={20} color="#ec4899" />;
      case 'add_budget_reminder': return <Wallet size={20} color="#f59e0b" />;
      default: return <CalendarIcon size={20} color="#64748b" />;
    }
  };

  const getTitle = () => {
    switch(suggestion.type) {
      case 'move_event': return `Mover Evento`;
      case 'add_rest_block': return `Añadir Descanso`;
      case 'schedule_task': return `Programar Tarea`;
      case 'add_daughter_plan': return `Plan Hija`;
      case 'add_budget_reminder': return `Aviso Economía`;
      default: return `Sugerencia IA`;
    }
  };

  const renderDetails = () => {
    if (suggestion.type === 'move_event') {
      return (
        <div className="sugg-details">
          <div className="detail-row"><CalendarIcon size={14}/> <span>De: {suggestion.fromDate} → <strong>{suggestion.toDate}</strong></span></div>
          <div className="detail-row"><Clock size={14}/> <span>{suggestion.newStartTime} - {suggestion.newEndTime}</span></div>
        </div>
      );
    }
    
    return (
      <div className="sugg-details">
        <div className="detail-row"><strong>{suggestion.title}</strong></div>
        <div className="detail-row"><CalendarIcon size={14}/> <span>{suggestion.date}</span></div>
        <div className="detail-row"><Clock size={14}/> <span>{suggestion.startTime} - {suggestion.endTime}</span></div>
      </div>
    );
  };

  return (
    <div className={`ai-sugg-card type-${suggestion.type}`}>
      <div className="sugg-header">
        <div className="sugg-icon">{getIcon()}</div>
        <h3>{getTitle()}</h3>
      </div>
      
      <p className="sugg-reason">"{suggestion.reason}"</p>
      
      {renderDetails()}

      <div className="sugg-actions">
        <button className="reject-btn" onClick={() => onReject(suggestion.id)}>
          <X size={16} /> Rechazar
        </button>
        <button className="accept-btn" onClick={() => onAccept(suggestion)}>
          <Check size={16} /> Aceptar
        </button>
      </div>

      <style>{`
        .ai-sugg-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 15px;
          margin-bottom: 15px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          animation: slideIn 0.3s ease-out forwards;
        }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .sugg-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .sugg-icon { background: var(--bg); width: 35px; height: 35px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .sugg-header h3 { margin: 0; font-size: 1.1rem; color: var(--text); }
        
        .sugg-reason { font-size: 0.9em; font-style: italic; color: #64748b; margin: 0 0 15px 0; border-left: 3px solid var(--primary); padding-left: 10px; }
        
        .sugg-details { background: var(--bg); padding: 12px; border-radius: 10px; margin-bottom: 15px; display: flex; flex-direction: column; gap: 8px; }
        .detail-row { display: flex; align-items: center; gap: 8px; font-size: 0.85em; color: var(--text); }
        .detail-row strong { color: var(--primary); }
        
        .sugg-actions { display: flex; gap: 10px; }
        .sugg-actions button { flex: 1; padding: 10px; border-radius: 10px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 5px; border: none; cursor: pointer; transition: transform 0.1s; }
        .sugg-actions button:active { transform: scale(0.95); }
        .reject-btn { background: #fee2e2; color: #ef4444; }
        .accept-btn { background: #d1fae5; color: #10b981; }
      `}</style>
    </div>
  );
}
