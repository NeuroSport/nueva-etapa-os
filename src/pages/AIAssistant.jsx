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

export default function AIAssistant({ data }) {
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

  // BOTONES MAESTROS DE CONTROL
  const controlButtons = [
    { 
      id: "week", 
      label: "Planificar semana", 
      icon: Calendar, 
      color: "#3b82f6",
      prompt: `Analiza TODO mi sistema:
      - Calendario Custodia: ${JSON.stringify(data.daughterSystem.custodyCalendar)}
      - Tareas Pendientes: ${JSON.stringify(data.tasks.filter(t => t.status !== 'hecho'))}
      - Objetivos: ${JSON.stringify(data.goals)}
      Crea una hoja de ruta semanal equilibrada, priorizando los días con mi hija y mis metas estratégicas.`
    },
    { 
      id: "today", 
      label: "Qué hago hoy", 
      icon: Sparkles, 
      color: "#f59e0b",
      prompt: `Prioriza mi día de hoy basándote en:
      - Tareas para hoy: ${JSON.stringify(data.tasks.filter(t => t.plannedDate === new Date().toISOString().split('T')[0]))}
      - Eventos: ${JSON.stringify(data.calendarEvents)}
      - Metas: ${JSON.stringify(data.goals)}
      Dime las 3 acciones clave y calcula si tengo tiempo real para hacerlas.`
    },
    { 
      id: "daughter", 
      label: "Plan con mi hija", 
      icon: Heart, 
      color: "#ec4899",
      prompt: `Busca el mejor momento para estar con mi hija. 
      Datos: ${JSON.stringify(data.daughterSystem)} 
      Sugiéreme un plan creativo usando mis ideas y mi presupuesto actual de economía.`
    },
    { 
      id: "shop", 
      label: "Compra semanal", 
      icon: ShoppingCart, 
      color: "#10b981",
      prompt: `Cruza mi Menú Semanal (${JSON.stringify(data.weeklyMenu)}) con mi Lista de Compra (${JSON.stringify(data.shoppingList)}). 
      Dime qué me falta comprar y cómo optimizar el gasto en Consum/Mercadona/Lidl.`
    },
    { 
      id: "menu", 
      label: "Menú barato", 
      icon: Utensils, 
      color: "#f97316",
      prompt: `Mi situación económica es: ${JSON.stringify(data.income)} vs ${JSON.stringify(data.expenses)}. 
      Genérame un menú de 7 días nutritivo pero de bajísimo coste, adaptado al Modo Hija cuando toque.`
    },
    { 
      id: "economy", 
      label: "Revisar economía", 
      icon: Wallet, 
      color: "#6366f1",
      prompt: `Haz una auditoría de mis finanzas: 
      - Ingresos: ${JSON.stringify(data.income)}
      - Gastos fijos/variables: ${JSON.stringify(data.expenses)}
      - Necesidades pendientes: ${JSON.stringify(data.needs)}
      ¿Cuál es mi estado de salud financiera real?`
    },
    { 
      id: "stressed", 
      label: "Estoy agobiado", 
      icon: AlertCircle, 
      color: "#ef4444",
      prompt: `EMERGENCIA: Me siento superado. Analiza mis tareas (${JSON.stringify(data.tasks)}) y objetivos (${JSON.stringify(data.goals)}). 
      Dime qué 3 cosas puedo ignorar hoy sin consecuencias y en qué única cosa debo enfocarme.`
    },
    { 
      id: "alicante", 
      label: "Plan Alicante", 
      icon: MapPin, 
      color: "#06b6d4",
      prompt: `Sugiere un plan en Alicante usando mi base de datos: ${JSON.stringify(data.alicantePlans)}. 
      Ten en cuenta si voy con la niña y mi presupuesto disponible.`
    },
    { 
      id: "sunday", 
      label: "Revisión domingo", 
      icon: RefreshCcw, 
      color: "#8b5cf6",
      prompt: `Resumen de la semana:
      - Tareas completadas: ${JSON.stringify(data.tasks.filter(t => t.status === 'hecho'))}
      - Gastos realizados: ${JSON.stringify(data.expenses.filter(e => e.paid))}
      Dame feedback sobre mi productividad y ahorro. ¿Qué mejoramos el lunes?`
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
      const response = await chatWithAI([...messages, { role: "user", content: textToSend }]);
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

  return (
    <div className="page assistant-page">
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
              <div className="text">{msg.content}</div>
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
        .bubble .text { padding: 12px 16px; border-radius: 18px; font-size: 0.9em; line-height: 1.4; }
        .bubble.assistant .text { background: var(--bg); color: var(--text); border-bottom-left-radius: 4px; }
        .bubble.user .text { background: var(--primary); color: white; border-bottom-right-radius: 4px; }
        
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
