import React, { useState } from 'react';
import AIWeekPlanSettings from './AIWeekPlanSettings';
import AIWeekPlanResult from './AIWeekPlanResult';
import { localAI } from '../services/localAIService';
import { chatWithAI } from '../services/aiService';
import { X, Loader2, Sparkles } from 'lucide-react';

export default function AIWeekPlanner({ data, setData, onClose, showToast }) {
  const [step, setStep] = useState('settings'); // 'settings', 'loading', 'result'
  const [proposal, setProposal] = useState(null);

  // Utilidad para resumir datos reales
  const summarizeAppData = () => {
    return {
      tasks: data.tasks.filter(t => t.status !== 'hecho').slice(0, 15).map(t => ({ title: t.title, priority: t.priority })),
      goals: data.goals.slice(0, 5).map(g => g.title),
      economy: { income: data.budgetPro.income, expenses: data.expenses.slice(0, 10).map(e => `${e.title}: ${e.amount}€`) },
      daughter: data.daughterSystem.custodyCalendar.slice(0, 5),
      menu: data.weeklyMenuPro,
      shopping: data.shoppingListPro.slice(0, 10)
    };
  };

  const generatePlan = async (settings) => {
    setStep('loading');
    const summarized = summarizeAppData();
    const activeMode = localStorage.getItem("active_ai_mode") || "remote";

    const prompt = `
      Actúa como asistente privado de organización vital. 
      OBJETIVO: Crear una semana realista, humana y sostenible.
      DATOS REALES DEL USUARIO: ${JSON.stringify(summarized)}
      AJUSTES DE PLANIFICACIÓN: ${JSON.stringify(settings)}
      
      REGLAS:
      1. No llenes el calendario. Deja margen.
      2. Prioriza la hija y pagos urgentes.
      3. Si energía es BAJA, pon pocas tareas.
      4. Si presupuesto es BAJO, propón planes gratis.
      5. MODO: ${settings.mode}.
      
      RESPONDE EXCLUSIVAMENTE EN JSON CON ESTE FORMATO:
      {
        "weekStart": "2026-04-27",
        "mode": "${settings.mode}",
        "summary": "Resumen corto de la estrategia semanal",
        "days": [
          {
            "date": "2026-04-27",
            "dayName": "Lunes",
            "mainGoal": "Objetivo del día",
            "energyAdvice": "Consejo según energía",
            "blocks": [
              { "time": "09:00-10:30", "title": "Tarea/Evento", "category": "Trabajo/Casa/Hija", "priority": "alta/media/baja", "notes": "" }
            ],
            "tasks": ["Tarea 1", "Tarea 2"],
            "daughter": ["Plan con hija"],
            "economy": ["Pago 1"],
            "selfCare": ["Cuidado personal"],
            "doNotDo": ["Qué evitar"]
          }
        ]
      }
    `;

    try {
      let response;
      if (activeMode === 'local') {
        if (!localAI.getLoaded()) {
          throw new Error("La IA Local no está cargada. Ve a 'Configuración IA' en el menú principal para iniciarla.");
        }
        response = await localAI.generate([{ role: "user", content: prompt }]);
      } else {
        response = await chatWithAI([{ role: "user", content: prompt }]);
      }

      // Intentar extraer JSON de la respuesta
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setProposal(parsed);
        setStep('result');
      } else {
        throw new Error("La IA no devolvió un formato válido.");
      }
    } catch (error) {
      console.error(error);
      showToast(`Error IA (${activeMode}): ` + error.message, "error");
      setStep('settings');
    }
  };

  const handleApply = (events) => {
    setData({
      ...data,
      calendarEvents: [...(data.calendarEvents || []), ...events]
    });
    showToast(`${events.length} eventos añadidos al calendario`, "success");
    onClose();
  };

  return (
    <div className="ai-planner-overlay">
      <div className="ai-planner-modal">
        {step === 'settings' && (
          <AIWeekPlanSettings 
            onGenerate={generatePlan} 
            onClose={onClose} 
          />
        )}

        {step === 'loading' && (
          <div className="planner-loading">
            <div className="ai-loader">
              <Sparkles className="spark-icon" size={40} />
              <Loader2 className="spinner-icon" size={60} />
            </div>
            <h2>El Cerebro IA está planificando...</h2>
            <p>Analizando tus tareas, economía y tiempo con tu hija para crear la semana perfecta.</p>
          </div>
        )}

        {step === 'result' && (
          <div className="result-container">
            <div className="modal-header">
              <h2><Sparkles size={20} /> Propuesta Semanal IA</h2>
              <button onClick={onClose} className="close-btn"><X /></button>
            </div>
            <div className="result-scroll">
              <AIWeekPlanResult plan={proposal} onApply={handleApply} />
            </div>
          </div>
        )}
      </div>

      <style>{`
        .ai-planner-overlay { 
          position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
          background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; z-index: 2000;
          padding: 15px;
        }
        .ai-planner-modal { 
          background: var(--card); width: 100%; max-width: 500px; 
          border-radius: 30px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          overflow: hidden; animation: slideUp 0.3s ease-out;
          border: 1px solid rgba(255,255,255,0.1);
        }
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .modal-header { padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
        .modal-header h2 { font-size: 1.1rem; margin: 0; display: flex; align-items: center; gap: 10px; }
        .close-btn { background: none; border: none; color: var(--text); opacity: 0.5; }

        .planner-loading { padding: 60px 30px; text-align: center; }
        .ai-loader { position: relative; width: 80px; height: 80px; margin: 0 auto 25px; }
        .spark-icon { position: absolute; top: 20px; left: 20px; color: var(--primary); animation: pulse 1.5s infinite; }
        .spinner-icon { color: var(--border); animation: spin 2s linear infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .result-container { display: flex; flex-direction: column; max-height: 90vh; }
        .result-scroll { overflow-y: auto; flex-grow: 1; }
      `}</style>
    </div>
  );
}
