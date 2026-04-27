import React, { useState, useEffect } from 'react';
import { X, Loader2, Sparkles, CheckCheck, Trash2 } from 'lucide-react';
import { localAI } from '../services/localAIService';
import { chatWithAI } from '../services/aiService';
import AISuggestionCard from './AISuggestionCard';

export default function WeekOptimizerModal({ data, onClose, onApplySuggestion, onApplyAll }) {
  const [step, setStep] = useState('loading'); // 'loading', 'results', 'error'
  const [summary, setSummary] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    generateOptimization();
  }, []);

  const getOptimizerData = () => {
    // Current date logic (we need week start/end ideally, but we'll send a snapshot)
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    return {
      today: formattedDate,
      calendarEvents: data.calendarEvents?.slice(0, 30).map(e => ({ id: e.id, title: e.title, date: e.date, startTime: e.startTime, category: e.category, important: e.important })) || [],
      pendingTasks: data.tasks?.filter(t => t.status !== 'hecho').slice(0, 10).map(t => ({ id: t.id, title: t.title, priority: t.priority })) || [],
      daughterDays: data.daughterSystem?.custodyCalendar?.slice(0, 7) || [],
      budgetStatus: data.budgetPro?.status || 'unknown'
    };
  };

  const generateOptimization = async () => {
    setStep('loading');
    const snapshot = getOptimizerData();
    const activeMode = localStorage.getItem("active_ai_mode") || "remote";

    const prompt = `
      Actúa como Optimizador Semanal. Analiza los siguientes datos y detecta: días saturados, días vacíos, tareas pendientes sin fecha, falta de descansos.
      DATOS ACTUALES: ${JSON.stringify(snapshot)}
      
      REGLAS:
      1. Genera máximo 4 sugerencias muy útiles.
      2. No satures los días de la hija.
      3. Si el presupuesto es crítico, sugiere un 'add_budget_reminder'.
      4. Si un día tiene >3 eventos importantes, sugiere mover uno ('move_event') a un día vacío.
      5. Sugiere añadir descansos ('add_rest_block') en días largos.

      DEVUELVE UNICAMENTE JSON EN ESTE FORMATO EXACTO (sin markdown adicional):
      {
        "summary": "Resumen corto de tu análisis...",
        "suggestions": [
          {
            "id": "sugg-1",
            "type": "move_event",
            "eventId": "ID_DEL_EVENTO_A_MOVER",
            "reason": "El martes está muy saturado",
            "fromDate": "YYYY-MM-DD",
            "toDate": "YYYY-MM-DD",
            "newStartTime": "18:00",
            "newEndTime": "19:00"
          },
          {
            "id": "sugg-2",
            "type": "add_rest_block",
            "title": "Desconexión total",
            "date": "YYYY-MM-DD",
            "startTime": "20:00",
            "endTime": "21:00",
            "reason": "Llevas mucha carga acumulada"
          },
          {
            "id": "sugg-3",
            "type": "schedule_task",
            "taskId": "ID_DE_TAREA",
            "title": "Título tarea",
            "date": "YYYY-MM-DD",
            "startTime": "10:00",
            "endTime": "11:00",
            "reason": "Tarea urgente sin programar"
          }
        ]
      }
    `;

    try {
      let response = "";
      if (activeMode === 'local') {
        if (!localAI.getLoaded()) {
          throw new Error("La IA Local no está cargada. Ve a 'Configuración IA' en el menú principal para iniciarla.");
        }
        response = await localAI.generate([{ role: "user", content: prompt }]);
      } else {
        response = await chatWithAI([{ role: "user", content: prompt }]);
      }

      // Parse JSON safely
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Formato no reconocido.");
      
      const parsed = JSON.parse(jsonMatch[0]);
      setSummary(parsed.summary || "He analizado tu semana.");
      setSuggestions(parsed.suggestions || []);
      setStep('results');

    } catch (err) {
      console.error("Optimizer Error:", err);
      setErrorMsg(`Error conectando con la IA (${activeMode}): ${err.message}`);
      setStep('error');
    }
  };

  const handleAccept = (suggestion) => {
    onApplySuggestion(suggestion);
    setSuggestions(suggestions.filter(s => s.id !== suggestion.id));
    if (suggestions.length === 1) onClose(); // Auto-close if it was the last one
  };

  const handleReject = (suggestionId) => {
    setSuggestions(suggestions.filter(s => s.id !== suggestionId));
    if (suggestions.length === 1) onClose();
  };

  const handleAcceptAll = () => {
    onApplyAll(suggestions);
    onClose();
  };

  return (
    <div className="optimizer-overlay">
      <div className="optimizer-modal">
        <div className="modal-header">
          <h2><Sparkles size={20} color="#8b5cf6" /> Optimizador de Semana</h2>
          <button onClick={onClose} className="close-btn"><X /></button>
        </div>

        <div className="modal-content">
          {step === 'loading' && (
            <div className="optimizer-loading">
              <Loader2 className="spinner" size={50} />
              <p>Analizando la carga de tu semana, eventos importantes y prioridades...</p>
            </div>
          )}

          {step === 'error' && (
            <div className="optimizer-error">
              <p>{errorMsg}</p>
              <button className="retry-btn" onClick={generateOptimization}>Reintentar</button>
            </div>
          )}

          {step === 'results' && (
            <div className="optimizer-results">
              <div className="summary-box">
                <p>"{summary}"</p>
              </div>

              {suggestions.length === 0 ? (
                <div className="no-suggestions">
                  <CheckAll size={40} color="#10b981" />
                  <h3>¡Tu semana está perfecta!</h3>
                  <p>No he encontrado problemas de carga ni conflictos horarios.</p>
                </div>
              ) : (
                <>
                  <div className="global-actions">
                    <button className="accept-all-btn" onClick={handleAcceptAll}>
                      <CheckCheck size={18} /> Aceptar Todas las Sugerencias
                    </button>
                  </div>
                  
                  <div className="suggestions-list">
                    {suggestions.map(sugg => (
                      <AISuggestionCard 
                        key={sugg.id} 
                        suggestion={sugg} 
                        onAccept={handleAccept} 
                        onReject={handleReject} 
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .optimizer-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(8px);
          display: flex; align-items: flex-end; justify-content: center; z-index: 2000;
        }
        @media (min-width: 600px) { .optimizer-overlay { align-items: center; padding: 20px; } }
        
        .optimizer-modal {
          background: var(--bg); width: 100%; max-width: 600px;
          border-radius: 30px 30px 0 0;
          display: flex; flex-direction: column; max-height: 90vh;
          box-shadow: 0 -20px 25px -5px rgba(0,0,0,0.1);
        }
        @media (min-width: 600px) { .optimizer-modal { border-radius: 30px; } }

        .modal-header { padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); background: var(--card); border-radius: 30px 30px 0 0; }
        .modal-header h2 { font-size: 1.2rem; margin: 0; display: flex; align-items: center; gap: 10px; color: var(--text); }
        .close-btn { background: none; border: none; color: var(--text); opacity: 0.5; padding: 5px; }
        
        .modal-content { padding: 20px; overflow-y: auto; flex-grow: 1; }
        
        .optimizer-loading { padding: 60px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .spinner { color: #8b5cf6; animation: spin 1.5s linear infinite; }
        .optimizer-loading p { color: #64748b; font-size: 1.1em; line-height: 1.5; }
        
        .optimizer-error { padding: 40px 20px; text-align: center; color: #ef4444; }
        .retry-btn { margin-top: 20px; background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; }

        .summary-box { background: #f5f3ff; border-left: 4px solid #8b5cf6; padding: 15px; border-radius: 0 12px 12px 0; margin-bottom: 20px; color: #4c1d95; font-style: italic; font-weight: 500; }
        
        .global-actions { margin-bottom: 20px; }
        .accept-all-btn { width: 100%; background: #10b981; color: white; border: none; padding: 15px; border-radius: 15px; font-weight: bold; font-size: 1.1em; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3); transition: transform 0.1s; }
        .accept-all-btn:active { transform: scale(0.98); }

        .no-suggestions { text-align: center; padding: 40px 20px; color: #10b981; }
        .no-suggestions h3 { margin: 15px 0 5px; }
        .no-suggestions p { color: #64748b; }
      `}</style>
    </div>
  );
}
