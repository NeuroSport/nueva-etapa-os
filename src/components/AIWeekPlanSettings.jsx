import React, { useState } from 'react';
import { Zap, Battery, Euro, Heart, Target, ShieldAlert, X } from 'lucide-react';

export default function AIWeekPlanSettings({ onGenerate, onClose }) {
  const [settings, setSettings] = useState({
    energy: 'media',
    budget: '',
    daughterDays: '',
    fixedHours: '',
    goal: '',
    mode: 'equilibrado'
  });

  const modes = [
    { id: 'suave', label: 'Suave', icon: Zap, color: '#10b981' },
    { id: 'equilibrado', label: 'Equilibrado', icon: Zap, color: '#3b82f6' },
    { id: 'intensivo', label: 'Intensivo', icon: Zap, color: '#8b5cf6' },
    { id: 'padre', label: 'Modo Padre', icon: Heart, color: '#ec4899' },
    { id: 'economia', label: 'Modo Economía', icon: Euro, color: '#f59e0b' },
    { id: 'emergencia', label: 'Emergencia', icon: ShieldAlert, color: '#ef4444' },
  ];

  return (
    <div className="ai-settings-panel">
      <div className="modal-header">
        <h2>Configurar Plan Semanal</h2>
        <button onClick={onClose} className="close-btn"><X /></button>
      </div>

      <div className="settings-scroll">
        <div className="form-group">
          <label><Battery size={16} /> Nivel de Energía</label>
          <div className="pill-selector">
            {['baja', 'media', 'alta'].map(e => (
              <button 
                key={e} 
                className={settings.energy === e ? 'active' : ''} 
                onClick={() => setSettings({...settings, energy: e})}
              >
                {e.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label><Target size={16} /> Objetivo Principal</label>
          <input 
            type="text" 
            placeholder="Ej: Terminar proyecto, ahorrar 50€..." 
            value={settings.goal}
            onChange={e => setSettings({...settings, goal: e.target.value})}
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label><Euro size={16} /> Presupuesto</label>
            <input type="number" placeholder="€ disponible" value={settings.budget} onChange={e => setSettings({...settings, budget: e.target.value})} />
          </div>
          <div className="form-group">
            <label><Heart size={16} /> Días Hija</label>
            <input type="text" placeholder="L, M, V..." value={settings.daughterDays} onChange={e => setSettings({...settings, daughterDays: e.target.value})} />
          </div>
        </div>

        <div className="form-group">
          <label>Modo de Planificación</label>
          <div className="mode-grid-small">
            {modes.map(m => (
              <button 
                key={m.id} 
                className={`mode-pill ${settings.mode === m.id ? 'active' : ''}`}
                onClick={() => setSettings({...settings, mode: m.id})}
                style={{ '--mode-color': m.color }}
              >
                <m.icon size={14} />
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="generate-btn" onClick={() => onGenerate(settings)}>
        <Zap size={20} fill="white" />
        Generar Propuesta con IA
      </button>

      <style>{`
        .ai-settings-panel { padding: 20px; display: flex; flex-direction: column; gap: 20px; }
        .settings-scroll { max-height: 60vh; overflow-y: auto; padding-right: 5px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: flex; align-items: center; gap: 8px; font-weight: bold; font-size: 0.85em; margin-bottom: 10px; opacity: 0.7; }
        .pill-selector { display: flex; gap: 8px; background: #f1f5f9; padding: 5px; border-radius: 12px; }
        .pill-selector button { flex: 1; padding: 8px; border: none; border-radius: 8px; background: none; font-size: 0.75em; font-weight: bold; }
        .pill-selector button.active { background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1); color: var(--primary); }
        
        input { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg); color: var(--text); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        
        .mode-grid-small { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .mode-pill { 
          display: flex; align-items: center; gap: 8px; padding: 10px; 
          border-radius: 12px; border: 1px solid var(--border); background: var(--bg);
          font-size: 0.75em; font-weight: bold; color: var(--text);
        }
        .mode-pill.active { border-color: var(--mode-color); background: var(--mode-color); color: white; }
        
        .generate-btn { 
          width: 100%; padding: 18px; border-radius: 15px; background: var(--primary);
          color: white; border: none; font-weight: bold; font-size: 1rem;
          display: flex; align-items: center; justify-content: center; gap: 12px;
          box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
        }
      `}</style>
    </div>
  );
}
