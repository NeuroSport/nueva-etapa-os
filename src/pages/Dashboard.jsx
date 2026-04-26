import Card from "../components/Card";
import { Zap, ShieldCheck, TrendingUp, Calendar, Heart, Wallet } from "lucide-react";

export default function Dashboard({ data, setPage }) {
  const pendingTasks = data.tasks.filter((task) => task.status !== 'hecho');
  const totalExpenses = data.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className="page dashboard-page">
      <div className="v2-badge">SISTEMA V2.0 ACTIVO</div>
      
      <header className="dash-header">
        <h1>Buenos días.</h1>
        <p>Hoy es un buen día para avanzar.</p>
      </header>

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

      <div className="stats-mini-grid">
        <div className="mini-card" onClick={() => setPage('tasks')}>
          <div className="val">{pendingTasks.length}</div>
          <div className="lab">Tareas</div>
        </div>
        <div className="mini-card" onClick={() => setPage('economy')}>
          <div className="val">{totalExpenses}€</div>
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
              <span>{task.title}</span>
            </div>
          ))
        ) : (
          <p className="empty-msg">No hay tareas urgentes. ¡Buen trabajo!</p>
        )}
      </Card>

      {/* ACCESO AL INFORME SEMANAL */}
      <div className="review-shortcut" onClick={() => setPage('sunday-review')}>
        <div className="rs-icon"><TrendingUp size={24} color="#8b5cf6" /></div>
        <div className="rs-text">
          <h3>Informe Semanal</h3>
          <p>Mira tus logros, ahorros y tiempo con tu hija.</p>
        </div>
      </div>

      <Card title="Acceso Rápido">
        <div className="access-buttons">
          <button onClick={() => setPage('menu')} className="acc-btn"><Calendar size={18} /> Menú</button>
          <button onClick={() => setPage('plans')} className="acc-btn"><Heart size={18} /> Planes</button>
          <button onClick={() => setPage('shopping')} className="acc-btn"><Wallet size={18} /> Compra</button>
        </div>
      </Card>

      <style>{`
        .dashboard-page { padding: 20px; background: #f8fafc; min-height: 100vh; padding-bottom: 100px; }
        .v2-badge { background: #1e293b; color: white; font-size: 0.6em; font-weight: 800; padding: 4px 10px; border-radius: 20px; display: inline-block; margin-bottom: 10px; letter-spacing: 1px; }
        .dash-header { margin-bottom: 25px; }
        .dash-header h1 { font-size: 2rem; margin: 0; font-weight: 800; color: #0f172a; }
        .dash-header p { margin: 5px 0 0 0; opacity: 0.5; font-size: 0.95rem; }

        .focus-hero { background: #0f172a; color: white; padding: 25px; border-radius: 28px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px; cursor: pointer; transition: transform 0.2s; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .focus-hero:active { transform: scale(0.98); }
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

        .review-shortcut {
          background: #f5f3ff;
          border: 2px solid #ddd6fe;
          padding: 20px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
          cursor: pointer;
        }
        .rs-text h3 { margin: 0; font-size: 1rem; color: #5b21b6; }
        .rs-text p { margin: 2px 0 0 0; font-size: 0.75em; opacity: 0.7; color: #7c3aed; }

        .access-buttons { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 5px; }
        .acc-btn { background: #f1f5f9; border: none; padding: 12px; border-radius: 12px; font-size: 0.75em; font-weight: bold; display: flex; flex-direction: column; align-items: center; gap: 8px; color: #475569; }
        
        .empty-msg { text-align: center; padding: 20px 0; color: #94a3b8; font-size: 0.9em; }
      `}</style>
    </div>
  );
}