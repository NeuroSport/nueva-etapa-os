import React from 'react';
import { 
  Calendar, Check, X, Edit2, ClipboardList, 
  Euro, Target, Heart, Star, Info
} from 'lucide-react';

export default function AIActionCard({ action, onApply, onEdit, onDiscard }) {
  const { type, payload } = action;

  const getIcon = () => {
    switch (type) {
      case 'create_calendar_event': return <Calendar className="text-blue-500" size={18} />;
      case 'create_task': return <ClipboardList className="text-emerald-500" size={18} />;
      case 'create_expense': return <Euro className="text-orange-500" size={18} />;
      case 'create_need': return <Info className="text-purple-500" size={18} />;
      case 'create_goal': return <Target className="text-indigo-500" size={18} />;
      case 'create_daughter_plan': return <Heart className="text-pink-500" size={18} />;
      case 'save_alicante_plan': return <Star className="text-yellow-500" size={18} />;
      default: return <Info size={18} />;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'create_calendar_event': return "Evento de Calendario";
      case 'create_task': return "Nueva Tarea";
      case 'create_expense': return "Registro de Gasto";
      case 'create_need': return "Nueva Necesidad";
      case 'create_goal': return "Nuevo Objetivo";
      case 'create_daughter_plan': return "Plan con Hija";
      case 'save_alicante_plan': return "Guardar Plan Alicante";
      default: return "Acción IA";
    }
  };

  return (
    <div className="ai-action-card">
      <div className="action-header">
        <div className="action-type">
          {getIcon()}
          <span>{getLabel()}</span>
        </div>
      </div>
      
      <div className="action-content">
        <h4>{payload.title}</h4>
        <p>{payload.description || payload.notes || payload.date || "Propuesta de la IA"}</p>
        
        {payload.amount && <div className="action-meta">Importe: <strong>{payload.amount}€</strong></div>}
        {payload.date && <div className="action-meta">Fecha: <strong>{payload.date}</strong></div>}
      </div>

      <div className="action-footer">
        <button className="btn-discard" onClick={onDiscard} title="Descartar">
          <X size={14} />
        </button>
        <button className="btn-edit" onClick={onEdit} title="Editar">
          <Edit2 size={14} /> Revisar
        </button>
        <button className="btn-apply" onClick={onApply} title="Aplicar">
          <Check size={14} /> Aplicar
        </button>
      </div>

      <style>{`
        .ai-action-card {
          background: white; border: 1px solid #e2e8f0; border-radius: 16px;
          margin: 10px 0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          max-width: 280px;
        }
        .action-header { padding: 8px 12px; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
        .action-type { display: flex; align-items: center; gap: 8px; font-size: 0.65em; font-weight: 800; color: #64748b; text-transform: uppercase; }
        
        .action-content { padding: 12px; }
        .action-content h4 { margin: 0 0 4px; font-size: 0.9em; color: #1e293b; font-weight: 700; }
        .action-content p { margin: 0; font-size: 0.75em; color: #64748b; line-height: 1.4; }
        .action-meta { margin-top: 6px; font-size: 0.7em; color: #475569; }
        
        .action-footer { display: flex; padding: 8px; gap: 8px; background: #f8fafc; }
        .action-footer button { 
          height: 32px; border-radius: 8px; border: none; display: flex; align-items: center; justify-content: center;
          font-size: 0.7em; font-weight: bold; transition: all 0.2s; cursor: pointer;
        }
        .btn-discard { width: 32px; background: #fee2e2; color: #ef4444; }
        .btn-edit { flex: 1; background: #f1f5f9; color: #475569; gap: 4px; }
        .btn-apply { flex: 1; background: #1e293b; color: white; gap: 4px; }
        
        .btn-apply:hover { background: #0f172a; }
        .btn-edit:hover { background: #e2e8f0; }
        .btn-discard:hover { background: #fecaca; }
      `}</style>
    </div>
  );
}
