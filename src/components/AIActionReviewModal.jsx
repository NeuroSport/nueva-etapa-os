import React, { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';

export default function AIActionReviewModal({ action, onApply, onClose }) {
  const [payload, setPayload] = useState({ ...action.payload });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPayload(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    onApply({ ...action, payload });
  };

  return (
    <div className="action-review-overlay">
      <div className="action-review-modal">
        <div className="review-header">
          <h3>Revisar Acción sugerida</h3>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        <div className="review-body">
          <div className="review-info-box">
            <AlertCircle size={16} />
            <p>La IA ha preparado esta propuesta. Edita cualquier campo si es necesario antes de guardarlo.</p>
          </div>

          <div className="form-group">
            <label>Título / Concepto</label>
            <input name="title" value={payload.title || ""} onChange={handleChange} />
          </div>

          {(payload.description !== undefined || payload.notes !== undefined) && (
            <div className="form-group">
              <label>Descripción / Notas</label>
              <textarea name="description" value={payload.description || payload.notes || ""} onChange={handleChange} rows="3" />
            </div>
          )}

          <div className="form-grid">
            {payload.date !== undefined && (
              <div className="form-group">
                <label>Fecha</label>
                <input type="date" name="date" value={payload.date || ""} onChange={handleChange} />
              </div>
            )}
            {payload.amount !== undefined && (
              <div className="form-group">
                <label>Importe (€)</label>
                <input type="number" name="amount" value={payload.amount || ""} onChange={handleChange} />
              </div>
            )}
            {payload.startTime !== undefined && (
              <div className="form-group">
                <label>Hora Inicio</label>
                <input type="time" name="startTime" value={payload.startTime || ""} onChange={handleChange} />
              </div>
            )}
          </div>
        </div>

        <div className="review-footer">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-confirm" onClick={handleSave}>
            <Check size={18} /> Confirmar y Guardar
          </button>
        </div>
      </div>

      <style>{`
        .action-review-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 3000;
          padding: 20px;
        }
        .action-review-modal {
          background: white; width: 100%; max-width: 450px; border-radius: 24px;
          overflow: hidden; animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        
        .review-header { padding: 20px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .review-header h3 { margin: 0; font-size: 1.1rem; font-weight: 800; color: #1e293b; }
        .close-btn { background: none; border: none; color: #64748b; }
        
        .review-body { padding: 20px; max-height: 60vh; overflow-y: auto; }
        .review-info-box { 
          background: #eff6ff; border: 1px solid #dbeafe; border-radius: 12px;
          padding: 12px; display: flex; gap: 12px; margin-bottom: 20px;
          color: #1e40af; font-size: 0.8em; line-height: 1.4;
        }
        .review-info-box p { margin: 0; }
        
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 0.75em; font-weight: bold; color: #64748b; margin-bottom: 6px; }
        .form-group input, .form-group textarea {
          width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0;
          font-size: 0.9em; outline: none; background: #f8fafc;
        }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        
        .review-footer { padding: 20px; background: #f8fafc; border-top: 1px solid #f1f5f9; display: flex; gap: 12px; }
        .review-footer button { 
          flex: 1; padding: 14px; border-radius: 12px; border: none; 
          font-size: 0.9em; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-cancel { background: #e2e8f0; color: #475569; }
        .btn-confirm { background: #1e293b; color: white; }
      `}</style>
    </div>
  );
}
