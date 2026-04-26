import { useState, useRef, useEffect } from "react";
import Card from "../components/Card";
import { chatWithAI } from "../services/aiService";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  Calendar, 
  Wallet, 
  Heart, 
  ShoppingCart, 
  Utensils, 
  RefreshCcw, 
  MapPin,
  ClipboardList,
  Target,
  Zap,
  ChevronRight
} from "lucide-react";

import CalendarQuickAdd from "../components/CalendarQuickAdd";

export default function AIAssistant({ data, setData }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Centro de Control Operativo activado. He analizado todos tus módulos (Hija, Economía, Tareas, Comidas, Compra y Planes). ¿En qué área quieres que tome el control?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  // Estado para el modal de programación rápida
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [itemToSchedule, setItemToSchedule] = useState(null);

  // UTILIDAD PARA LIMITAR DATOS ENVIADOS A LA IA
  const getLimitedData = (source, limit = 5) => {
    if (!source) return "[]";
    const filtered = source.slice(0, limit).map(item => {
      // Eliminar campos pesados o innecesarios
      const { id, notes, description, ...rest } = item;
      return rest;
    });
    return JSON.stringify(filtered);
  };

  // BOTONES MAESTROS DE CONTROL
  const controlButtons = [
    { 
      id: "week", 
      label: "Planificar semana", 
      icon: Calendar, 
      color: "#3b82f6",
      prompt: `Analiza mi sistema (resumen):
      - Calendario Custodia: ${getLimitedData(data.daughterSystem.custodyCalendar, 7)}
      - Tareas: ${getLimitedData(data.tasks.filter(t => t.status !== 'hecho'), 10)}
      - Metas: ${getLimitedData(data.goals, 3)}
      Crea una hoja de ruta semanal equilibrada.`
    },
    { 
      id: "today", 
      label: "Qué hago hoy", 
      icon: Sparkles, 
      color: "#f59e0b",
      prompt: `Prioriza hoy:
      - Tareas Hoy: ${getLimitedData(data.tasks.filter(t => t.plannedDate === new Date().toISOString().split('T')[0]))}
      - Eventos: ${getLimitedData(data.calendarEvents, 5)}
      Dime las 3 acciones clave.`
    },
    { 
      id: "daughter", 
      label: "Plan con mi hija", 
      icon: Heart, 
      color: "#ec4899",
      prompt: `Día con mi hija. 
      Custodia: ${getLimitedData(data.daughterSystem.custodyCalendar, 3)} 
      Sugerencia creativa con presupuesto ajustado.`
    },
    { 
      id: "shop", 
      label: "Compra semanal", 
      icon: ShoppingCart, 
      color: "#10b981",
      prompt: `Optimiza compra:
      - Menú: ${JSON.stringify(data.weeklyMenuPro).substring(0, 500)}...
      - Lista: ${getLimitedData(data.shoppingListPro, 10)}`
    },
    { 
      id: "menu", 
      label: "Menú barato", 
      icon: Utensils, 
      color: "#f97316",
      prompt: `Menú ahorro:
      - Ingresos: ${data.budgetPro.income}
      - Gastos Variables: ${getLimitedData(data.expenses, 5)}
      Genera menú 7 días nutritivo bajo coste.`
    },
    { 
      id: "economy", 
      label: "Revisar economía", 
      icon: Wallet, 
      color: "#6366f1",
      prompt: `Auditoría financiera rápida: 
      - Ingresos: ${data.budgetPro.income}
      - Gastos: ${getLimitedData(data.expenses, 10)}
      - Necesidades: ${getLimitedData(data.needs, 5)}
      Estado de salud financiera real.`
    },
    { 
      id: "stressed", 
      label: "Estoy agobiado", 
      icon: AlertCircle, 
      color: "#ef4444",
      prompt: `EMERGENCIA: Me siento superado.
      - Tareas: ${getLimitedData(data.tasks, 8)}
      - Metas: ${getLimitedData(data.goals, 3)}
      ¿Qué 3 cosas ignoro hoy y en qué me enfoco?`
    },
    { 
      id: "alicante", 
      label: "Plan Alicante", 
      icon: MapPin, 
      color: "#06b6d4",
      prompt: `Sugerencia Alicante:
      - Mis planes: ${getLimitedData(data.alicantePlans, 5)}
      Plan para hoy.`
    },
    { 
      id: "sunday", 
      label: "Revisión domingo", 
      icon: RefreshCcw, 
      color: "#8b5cf6",
      prompt: `Resumen semanal:
      - Hecho: ${getLimitedData(data.tasks.filter(t => t.status === 'hecho'), 10)}
      - Pagado: ${getLimitedData(data.expenses.filter(e => e.paid), 10)}
      Feedback ahorro y productividad.`
    }
  ];


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customPrompt = null) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userLabel = customPrompt ? controlButtons.find(b => b.prompt === customPrompt).label : textToSend;
    const userMessage = { role: "user", content: userLabel };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const speedInstruction = "Responde de forma muy concisa, directa y estructurada para carga rápida.";
      const response = await chatWithAI([...messages, { role: "user", content: `${speedInstruction}\n${textToSend}` }]);
      let finalResponse = response;

      
      if (customPrompt && controlButtons.find(b => b.prompt === customPrompt).id === 'stressed') {
        finalResponse += "\n\n💡 He activado el análisis de emergencia. Si necesitas silencio total ahora mismo, pulsa el botón de 'MODO FOCO' en tu Dashboard principal.";
      }
      
      if (customPrompt && controlButtons.find(b => b.prompt === customPrompt).id === 'sunday') {
        finalResponse += "\n\n📊 He preparado un informe visual de tus logros de la semana. ¿Quieres verlo?";
      }

      setMessages(prev => [...prev, { role: "assistant", content: finalResponse }]);
    } catch (err) {
      setError("Error de conexión. Asegúrate de que el servidor IA esté activo (puerto 3001).");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSchedule = (title) => {
    setItemToSchedule({ title });
    setShowQuickAdd(true);
  };

  const saveQuickEvent = (event) => {
    setData({
      ...data,
      calendarEvents: [...(data.calendarEvents || []), event]
    });
  };


  return (
    <div className="page assistant-page page-transition">


      <div className="control-header">
        <div className="status-indicator">
          <Zap size={16} fill="#10b981" color="#10b981" />
          <span>SISTEMA V2.0 ONLINE</span>
        </div>
        <h1>Centro de Control IA</h1>
        <p>Analizando todos tus módulos en tiempo real</p>
      </div>

      <div className="control-grid">
        {controlButtons.map((btn) => (
          <button 
            key={btn.id} 
            className="control-btn" 
            style={{ "--btn-color": btn.color }}
            onClick={() => handleSend(btn.prompt)}
            disabled={isLoading}
          >
            <div className="icon-box">
              <btn.icon size={24} />
            </div>
            <span>{btn.label}</span>
          </button>
        ))}
      </div>

      <div className="chat-section">
        {error && (
          <div className="error-box">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="chat-window" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`bubble ${msg.role}`}>
              <div className="avatar">
                {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className="text-container">
                <div className="text">{msg.content}</div>
                {msg.role === 'assistant' && !isLoading && (
                  <button className="schedule-msg-btn" onClick={() => handleOpenSchedule(msg.content.substring(0, 30) + "...")}>
                    <Calendar size={14} /> Programar
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="bubble assistant loading">
              <Loader2 className="animate-spin" size={16} />
              <span>Procesando datos maestros...</span>
            </div>
          )}
        </div>

        <div className="input-bar">
          <input 
            type="text" 
            placeholder="Escribe una orden específica..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={() => handleSend()} disabled={isLoading || !input.trim()}>
            <Send size={20} />
          </button>
        </div>
      </div>

      <CalendarQuickAdd 
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onSave={saveQuickEvent}
        data={data}
        sourceType="ai"
        sourceId={`msg-${messages.length}`}
        defaultTitle={itemToSchedule?.title}
        defaultCategory="IA"
      />


      <style>{`
        .assistant-page { padding: 15px; padding-bottom: 90px; max-width: 600px; margin: 0 auto; }
        
        .control-header { margin-bottom: 25px; }
        .status-indicator { display: flex; align-items: center; gap: 6px; font-size: 0.7em; font-weight: bold; color: #10b981; margin-bottom: 8px; }
        .control-header h1 { font-size: 1.5rem; margin: 0; color: var(--text); }
        .control-header p { font-size: 0.85em; opacity: 0.6; margin: 5px 0 0 0; }

        .control-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 25px;
        }
        .control-btn {
          background: var(--card);
          border: 1px solid var(--border);
          padding: 15px 10px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          transition: all 0.2s;
        }
        .control-btn:active { transform: scale(0.95); background: var(--bg); }
        .control-btn .icon-box {
          width: 45px;
          height: 45px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.03);
          color: var(--btn-color);
        }
        .control-btn span { font-size: 0.7em; font-weight: bold; text-align: center; color: var(--text); }

        .chat-section { background: var(--card); border: 1px solid var(--border); border-radius: 28px; padding: 15px; }
        .chat-window { height: 300px; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 15px; margin-bottom: 15px; }
        
        .bubble { display: flex; gap: 10px; max-width: 90%; }
        .bubble.user { align-self: flex-end; flex-direction: row-reverse; }
        .bubble .avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--bg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .bubble.user .avatar { background: var(--primary); color: white; }
        .text-container { display: flex; flex-direction: column; gap: 5px; max-width: 85%; }
        .bubble .text { padding: 12px 16px; border-radius: 18px; font-size: 0.9em; line-height: 1.4; width: 100%; }
        .bubble.assistant .text { background: var(--bg); color: var(--text); border-bottom-left-radius: 4px; }
        .bubble.user .text { background: var(--primary); color: white; border-bottom-right-radius: 4px; }
        
        .schedule-msg-btn { 
          align-self: flex-start; 
          background: none; 
          border: 1px solid var(--border); 
          border-radius: 12px; 
          padding: 4px 10px; 
          font-size: 0.7em; 
          font-weight: bold; 
          display: flex; 
          align-items: center; 
          gap: 5px; 
          color: var(--muted); 
          cursor: pointer; 
          transition: all 0.2s; 
        }
        .schedule-msg-btn:hover { background: var(--primary); color: white; border-color: var(--primary); }
        
        .bubble.loading { align-items: center; font-style: italic; opacity: 0.7; }

        .input-bar { display: flex; gap: 10px; }
        .input-bar input { flex-grow: 1; border-radius: 25px; margin: 0; background: var(--bg); border: 1px solid var(--border); padding: 10px 20px; }
        .send-btn { width: 45px; height: 45px; border-radius: 50%; background: var(--primary); color: white; border: none; display: flex; align-items: center; justify-content: center; }

        .error-box { background: #fee2e2; color: #ef4444; padding: 10px; border-radius: 12px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; font-size: 0.8em; }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 400px) {
          .control-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .control-btn { padding: 10px 5px; }
          .control-btn .icon-box { width: 35px; height: 35px; }
        }
      `}</style>
    </div>
  );
}
