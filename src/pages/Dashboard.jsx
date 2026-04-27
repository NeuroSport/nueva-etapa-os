import { useState } from "react";
import { generateId } from "../utils";
import Card from "../components/Card";
import { Zap, ShieldCheck, TrendingUp, Calendar, Heart, Wallet, Plus, CheckSquare, Euro, Star, Sparkles, Search } from "lucide-react";
import AIWeekPlanner from "../components/AIWeekPlanner";

export default function Dashboard({ data, setData, setPage, showToast }) {
  const [quickTask, setQuickTask] = useState("");
  const [showAIPlanner, setShowAIPlanner] = useState(false);
  const pendingTasks = data.tasks.filter((task) => task.status !== 'hecho');
  const totalExpenses = data.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const savedPlans = data.savedPlans || [];

  const handleQuickTaskAdd = (e) => {
    e.preventDefault();
    if (!quickTask.trim()) return;
    
    const newTask = {
      id: generateId(),
      title: quickTask,
      plannedDate: new Date().toISOString().split('T')[0],
      status: 'pendiente',
      priority: 'media'
    };

    setData({
      ...data,
      tasks: [newTask, ...data.tasks]
    });
    setQuickTask("");
    showToast("Tarea añadida", "success");
  };

  const quickActions = [
    { label: "Tarea", icon: CheckSquare, color: "#3b82f6", page: "tasks" },
    { label: "Gasto", icon: Euro, color: "#ef4444", page: "economy" },
    { label: "Evento", icon: Calendar, color: "#10b981", page: "calendar" },
    { label: "Plan Hija", icon: Star, color: "#ec4899", page: "daughter" },
  ];

  return (
    <div className="page dashboard-page">
      <div className="v2-badge">SISTEMA V2.0 ACTIVO</div>
      
      <header className="dash-header">
        <h1>Buenos días.</h1>
        <p>Hoy es un buen día para avanzar.</p>
      </header>

      {/* ENTRADA RÁPIDA */}
      <form className="quick-input-box" onSubmit={handleQuickTaskAdd}>
        <input 
          type="text" 
          placeholder="Añadir tarea rápida..." 
          value={quickTask}
          onChange={e => setQuickTask(e.target.value)}
        />
        <button type="submit" className="quick-add-btn">
          <Plus size={24} />
        </button>
      </form>

      {/* BOTONES DE ACCIÓN RÁPIDA */}
      <div className="quick-actions-bar">
        {quickActions.map((act, i) => (
          <button key={i} className="action-circle-btn" onClick={() => setPage(act.page)} style={{ "--act-color": act.color }}>
            <act.icon size={20} />
            <span>{act.label}</span>
          </button>
        ))}
      </div>

      {/* BOTÓN MODO FOCO GIGANTE */}
      <div className="focus-hero" onClick={() => setPage('focus')}>
        <div className="hero-content">
          <Zap size={32} fill="#fbbf24" color="#fbbf24" />
          <div className="hero-text">
            <h2>Modo Foco Total</h2>
            <p>Solo las 3 tareas más importantes.</p>
          </div>
        </div>
        <div className="hero-action">Activar</div>
      </div>

      {/* BOTÓN IA PLANIFICADOR SEMANAL */}
      <div className="ai-planner-hero" onClick={() => setShowAIPlanner(true)}>
        <div className="hero-content">
          <div className="ai-icon-bg">
            <Sparkles size={24} color="white" fill="white" />
          </div>
          <div className="hero-text">
            <h2>Planificador Semanal PRO</h2>
            <p>IA analiza tu economía, tareas e hija.</p>
          </div>
        </div>
        <div className="hero-action-outline">Organizar</div>
      </div>

      {/* BOTÓN BUSCADOR INTELIGENTE */}
      <div className="search-hero-dash" onClick={() => setPage('search')}>
        <div className="hero-content">
          <div className="search-icon-bg">
            <Search size={24} color="white" />
          </div>
          <div className="hero-text">
            <h2>Buscador de Vida Real</h2>
            <p>Encuentra qué hacer hoy en Alicante.</p>
          </div>
        </div>
        <div className="hero-action-minimal">Explorar</div>
      </div>

      <div className="stats-mini-grid">
        <div className="mini-card" onClick={() => setPage('tasks')}>
          <div className="val">{pendingTasks.length}</div>
          <div className="lab">Tareas</div>
        </div>
        <div className="mini-card" onClick={() => setPage('economy')}>
          <div className="val">{data.settings?.privacyMode ? "•••" : totalExpenses}€</div>
          <div className="lab">Gastos</div>
        </div>
        <div className="mini-card" onClick={() => setPage('daughter')}>
          <div className="val">{data.daughterSystem.responsibilities.filter(r => !r.done).length}</div>
          <div className="lab">Hija</div>
        </div>
      </div>

      <Card title="Prioridades de hoy">
        {pendingTasks.slice(0, 3).length > 0 ? (
          pendingTasks.slice(0, 3).map((task) => (
            <div key={task.id} className="dash-task-item" onClick={() => setPage('tasks')}>
              <ShieldCheck size={18} color="#10b981" />
              <span>{data.settings?.privacyMode ? "••••••••" : task.title}</span>
            </div>
          ))
        ) : (
          <p className="empty-msg">No hay tareas urgentes. ¡Buen trabajo!</p>
        )}
      </Card>

      {savedPlans.length > 0 && (
        <Card title="Planes Guardados">
          <div className="saved-plans-dash">
            {savedPlans.slice(0, 3).map(plan => (
              <div key={plan.id} className="saved-plan-item" onClick={() => setPage('pro-alicante')}>
                <Heart size={16} fill="#db2777" color="#db2777" />
                <div className="plan-info">
                  <strong>{plan.title}</strong>
                  <span>{plan.location} • {plan.priceLevel}</span>
                </div>
              </div>
            ))}
            {savedPlans.length > 3 && (
              <button className="view-all-plans" onClick={() => setPage('pro-alicante')}>
                Ver todos ({savedPlans.length})
              </button>
            )}
          </div>
        </Card>
      )}

      <style>{`
        .dashboard-page { padding: 20px; background: #f8fafc; min-height: 100vh; padding-bottom: 120px; }
        .v2-badge { background: #1e293b; color: white; font-size: 0.6em; font-weight: 800; padding: 4px 10px; border-radius: 20px; display: inline-block; margin-bottom: 10px; letter-spacing: 1px; }
        .dash-header { margin-bottom: 20px; }
        .dash-header h1 { font-size: 2rem; margin: 0; font-weight: 800; color: #0f172a; }
        .dash-header p { margin: 5px 0 0 0; opacity: 0.5; font-size: 0.95rem; }

        .quick-input-box { display: flex; gap: 10px; margin-bottom: 20px; }
        .quick-input-box input { flex-grow: 1; margin: 0; border-radius: 18px; border: 2px solid #e2e8f0; padding: 12px 18px; }
        .quick-add-btn { width: 50px; height: 50px; background: #3b82f6; color: white; border: none; border-radius: 18px; display: flex; align-items: center; justify-content: center; }

        .quick-actions-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 25px; }
        .action-circle-btn { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 12px 5px; display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--act-color); transition: all 0.2s; }
        .action-circle-btn span { font-size: 0.65em; font-weight: bold; color: #64748b; }
        .action-circle-btn:active { background: #f1f5f9; transform: translateY(2px); }

        .focus-hero { background: #0f172a; color: white; padding: 25px; border-radius: 28px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px; cursor: pointer; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .hero-content { display: flex; align-items: center; gap: 20px; }
        .hero-text h2 { margin: 0; font-size: 1.1rem; }
        .hero-text p { margin: 2px 0 0 0; font-size: 0.75em; opacity: 0.5; }
        .hero-action { background: #3b82f6; padding: 8px 15px; border-radius: 12px; font-size: 0.75em; font-weight: bold; }

        .stats-mini-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 25px; }
        .mini-card { background: white; padding: 15px; border-radius: 20px; text-align: center; border: 1px solid #e2e8f0; cursor: pointer; }
        .mini-card .val { display: block; font-size: 1.3rem; font-weight: 800; color: #3b82f6; }
        .mini-card .lab { font-size: 0.65em; font-weight: bold; color: #64748b; text-transform: uppercase; margin-top: 4px; }

        .dash-task-item { display: flex; align-items: center; gap: 12px; padding: 15px 0; border-bottom: 1px solid #f1f5f9; cursor: pointer; }
        .dash-task-item:last-child { border: none; }
        .dash-task-item span { font-size: 0.95em; color: #334155; }
        
        .empty-msg { text-align: center; padding: 20px 0; color: #94a3b8; font-size: 0.9em; }

        .saved-plans-dash { display: flex; flex-direction: column; gap: 10px; }
        .saved-plan-item { display: flex; align-items: center; gap: 12px; background: #fdf2f8; padding: 12px; border-radius: 12px; cursor: pointer; border: 1px solid #fbcfe8; }
        .plan-info { display: flex; flex-direction: column; }
        .plan-info strong { font-size: 0.85em; color: #831843; }
        .plan-info span { font-size: 0.7em; color: #be185d; opacity: 0.8; }
        .view-all-plans { background: none; border: none; color: #db2777; font-size: 0.8em; font-weight: bold; margin-top: 5px; cursor: pointer; text-align: left; }

        .ai-planner-hero { 
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); 
          color: white; padding: 20px; border-radius: 28px; display: flex; 
          align-items: center; justify-content: space-between; margin-bottom: 25px; 
          cursor: pointer; box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.3);
        }
        .ai-icon-bg { background: rgba(255,255,255,0.2); width: 45px; height: 45px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .hero-action-outline { border: 1px solid rgba(255,255,255,0.5); padding: 8px 15px; border-radius: 12px; font-size: 0.75em; font-weight: bold; }

        .search-hero-dash { 
          background: white; border: 1px solid var(--border);
          color: var(--text); padding: 20px; border-radius: 28px; display: flex; 
          align-items: center; justify-content: space-between; margin-bottom: 25px; 
          cursor: pointer; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .search-icon-bg { background: #3b82f6; width: 45px; height: 45px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .hero-action-minimal { color: #3b82f6; font-weight: bold; font-size: 0.8em; }
      `}</style>
      
      {showAIPlanner && (
        <AIWeekPlanner 
          data={data} 
          setData={setData} 
          onClose={() => setShowAIPlanner(false)} 
          showToast={showToast}
        />
      )}
    </div>
  );
}