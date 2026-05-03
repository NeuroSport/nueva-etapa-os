import { useState, useRef, useEffect } from "react";
import { chatWithAI } from "../services/aiService";
import { localAI } from "../services/localAIService";
import { 
  Send, User, Sparkles, Calendar, Wallet, Heart, 
  ShoppingCart, Utensils, RefreshCcw, MapPin, ClipboardList, 
  Target, Zap, ChevronRight, Search, AlertCircle, 
  ClipboardCheck, Info, Star, Euro
} from "lucide-react";

import AIWeekPlanner from "../components/AIWeekPlanner";
import { aiActionEngine } from "../services/aiActionEngine";
import AIActionCard from "../components/AIActionCard";
import AIActionReviewModal from "../components/AIActionReviewModal";

export default function AIAssistant({ data, setData, setPage, showToast }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Centro de Control Operativo activado. He analizado todos tus módulos. Puedo crear tareas, registrar gastos o buscar planes reales. ¿Qué necesitas hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAIPlanner, setShowAIPlanner] = useState(false);
  const [reviewAction, setReviewAction] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // UTILIDAD PARA LIMITAR DATOS ENVIADOS A LA IA
  const getLimitedData = (source, limit = 5) => {
    if (!source) return "[]";
    const filtered = source.slice(0, limit).map(item => {
      const { id, ...rest } = item;
      return rest;
    });
    return JSON.stringify(filtered);
  };

  const handleSendMessage = async (customPrompt = null) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = { role: "user", content: customPrompt ? "Comando Rápido" : textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const activeMode = localStorage.getItem("active_ai_mode") || "remote";
    
    const systemPrompt = `
      Eres el motor de acciones de Nueva Etapa OS. Ayudas a gestionar: calendario, tareas, gastos, necesidades y planes con la hija.
      
      IMPORTANTE:
      Si el usuario pide algo accionable, debes responder SIEMPRE con un JSON estructurado que incluya 'message' (string) y 'actions' (array).
      
      Acciones soportadas:
      - create_calendar_event {title, date, startTime, endTime, category, notes}
      - create_task {title, description, priority, dueDate, category}
      - create_expense {title, amount, date, category, paid}
      - create_need {title, description, estimatedCost, priority, deadline}
      - create_goal {title, target, deadline, category}
      - create_daughter_plan {title, description, cost, location, notes}
      
      Si el usuario pide buscar planes en Alicante:
      1. Menciona que vas a buscar datos reales. No inventes lugares.
      
      FORMATO DE RESPUESTA:
      {
        "message": "Texto explicativo...",
        "actions": [ { "type": "...", "payload": {...} } ]
      }
      
      Datos del usuario:
      - Tareas pendientes: ${getLimitedData(data.tasks.filter(t => t.status !== 'hecho'))}
      - Gastos: ${getLimitedData(data.expenses)}
      - Custodia: ${getLimitedData(data.daughterSystem.custodyCalendar)}
      - Fecha de hoy: ${aiActionEngine.getTodayStr()}
    `;

    try {
      let response;
      if (activeMode === 'local') {
        if (!localAI.getLoaded()) throw new Error("IA Local no cargada");
        response = await localAI.generate([{ role: "system", content: systemPrompt }, ...messages, userMsg]);
      } else {
        response = await chatWithAI([{ role: "system", content: systemPrompt }, ...messages, userMsg]);
      }

      const parsed = aiActionEngine.parseResponse(response);
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: parsed.message,
        actions: parsed.actions 
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: "system", 
        content: `Error del asistente (${activeMode}): ` + error.message 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeAction = (action) => {
    const success = aiActionEngine.applyAction(action, data, setData);
    if (success) {
      showToast("Acción aplicada correctamente", "success");
      setReviewAction(null);
    }
  };

  const controlButtons = [
    { id: "week", label: "Planificar", icon: Calendar, color: "#3b82f6", prompt: "Planifica mi semana equilibradamente." },
    { id: "today", label: "Hoy", icon: Sparkles, color: "#f59e0b", prompt: "Dime qué 3 cosas son clave hoy." },
    { id: "daughter", label: "Plan Hija", icon: Heart, color: "#ec4899", prompt: "Sugerencia creativa para hoy con mi hija." },
    { id: "alicante", label: "Plan Alicante", icon: MapPin, color: "#06b6d4", prompt: "Busca planes reales en Alicante para hoy." },
    { id: "shop", label: "Gasto", icon: Euro, color: "#10b981", prompt: "Ayúdame a registrar un gasto." },
    { id: "stressed", label: "Agobiado", icon: AlertCircle, color: "#ef4444", prompt: "Tengo demasiado trabajo, ¿qué ignoro hoy?" }
  ];

  return (
    <div className="page assistant-page page-transition">
      <div className="control-header">
        <div className="status-indicator">
          <Zap size={16} fill="#10b981" color="#10b981" />
          <span>SISTEMA V2.5 ONLINE</span>
        </div>
        <h1>Centro de Control IA</h1>
        <p>Analizando tus módulos en tiempo real</p>
      </div>

      <div className="control-grid">
        {controlButtons.map((btn) => (
          <button 
            key={btn.id} 
            className="control-btn" 
            style={{ "--btn-color": btn.color }}
            onClick={() => handleSendMessage(btn.prompt)}
            disabled={isLoading}
          >
            <div className="icon-box"><btn.icon size={24} /></div>
            <span>{btn.label}</span>
          </button>
        ))}
      </div>

      <div className="chat-section">
        <div className="chat-window" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`bubble ${msg.role}`}>
              <div className="avatar">
                {msg.role === 'assistant' ? <Sparkles size={16} /> : <User size={16} />}
              </div>
              <div className="text-container">
                <div className="text">{msg.content}</div>
                {msg.actions && msg.actions.length > 0 && (
                  <div className="actions-list" style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {msg.actions.map((action, i) => (
                      <AIActionCard 
                        key={i} 
                        action={action} 
                        onApply={() => executeAction(action)}
                        onEdit={() => setReviewAction(action)}
                        onDiscard={() => {
                          const newMessages = [...messages];
                          newMessages[idx].actions = newMessages[idx].actions.filter((_, aidx) => aidx !== i);
                          setMessages(newMessages);
                        }}
                      />
                    ))}
                  </div>
                )}
                {msg.role === 'assistant' && (!msg.actions || msg.actions.length === 0) && !isLoading && (
                  <button className="schedule-msg-btn" onClick={() => setReviewAction({ type: 'create_calendar_event', payload: { title: msg.content.substring(0, 50), date: aiActionEngine.getTodayStr() } })}>
                    <Calendar size={14} /> Programar
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="bubble assistant loading">
              <Sparkles className="animate-spin" size={16} />
              <span>Procesando datos maestros...</span>
            </div>
          )}
        </div>

        <div className="input-bar">
          <input 
            type="text" 
            placeholder="Escribe una orden..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          />
          <button className="send-btn" onClick={() => handleSendMessage()} disabled={isLoading || !input.trim()}>
            <Send size={20} />
          </button>
        </div>
      </div>

      {showAIPlanner && (
        <AIWeekPlanner 
          data={data} 
          setData={setData} 
          onClose={() => setShowAIPlanner(false)} 
          showToast={showToast}
        />
      )}

      {reviewAction && (
        <AIActionReviewModal 
          action={reviewAction}
          onApply={executeAction}
          onClose={() => setReviewAction(null)}
        />
      )}

      <style>{`
        .assistant-page { padding: 15px; padding-bottom: 90px; max-width: 600px; margin: 0 auto; }
        .control-header { margin-bottom: 25px; }
        .status-indicator { display: flex; align-items: center; gap: 6px; font-size: 0.7em; font-weight: bold; color: #10b981; margin-bottom: 8px; }
        .control-header h1 { font-size: 1.5rem; margin: 0; color: var(--text); }
        .control-header p { font-size: 0.85em; opacity: 0.6; margin: 5px 0 0 0; }

        .control-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 25px; }
        .control-btn { background: white; border: 1px solid var(--border); padding: 15px 10px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; gap: 10px; transition: all 0.2s; }
        .control-btn .icon-box { width: 45px; height: 45px; border-radius: 15px; display: flex; align-items: center; justify-content: center; background: #f8fafc; color: var(--btn-color); }
        .control-btn span { font-size: 0.7em; font-weight: bold; text-align: center; color: var(--text); }

        .chat-section { background: white; border: 1px solid var(--border); border-radius: 28px; padding: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .chat-window { height: 400px; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 20px; margin-bottom: 15px; }
        
        .bubble { display: flex; gap: 12px; max-width: 95%; }
        .bubble.user { align-self: flex-end; flex-direction: row-reverse; }
        .bubble .avatar { width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .bubble.user .avatar { background: var(--primary); color: white; }
        .text-container { display: flex; flex-direction: column; gap: 8px; max-width: 85%; }
        .bubble .text { padding: 14px 18px; border-radius: 20px; font-size: 0.9em; line-height: 1.5; }
        .bubble.assistant .text { background: #f8fafc; color: #1e293b; border-bottom-left-radius: 4px; }
        .bubble.user .text { background: var(--primary); color: white; border-bottom-right-radius: 4px; }
        
        .schedule-msg-btn { align-self: flex-start; background: none; border: 1px solid #e2e8f0; border-radius: 10px; padding: 4px 12px; font-size: 0.7em; font-weight: bold; display: flex; align-items: center; gap: 6px; color: #64748b; }
        
        .input-bar { display: flex; gap: 10px; }
        .input-bar input { flex-grow: 1; border-radius: 25px; border: 1px solid #e2e8f0; padding: 12px 20px; outline: none; }
        .send-btn { width: 48px; height: 48px; border-radius: 50%; background: var(--primary); color: white; border: none; display: flex; align-items: center; justify-content: center; }

        .animate-spin { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
