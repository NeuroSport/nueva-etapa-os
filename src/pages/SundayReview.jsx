import { useState, useMemo } from "react";
import Card from "../components/Card";
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Euro, 
  Heart, 
  Target, 
  ArrowRight, 
  Sparkles, 
  CalendarDays,
  TrendingUp,
  Award
} from "lucide-react";

export default function SundayReview({ data, setData, setPage }) {
  // Cálculos de la semana
  const stats = useMemo(() => {
    const doneTasks = (data.tasks || []).filter(t => t.status === 'hecho');
    const pendingTasks = (data.tasks || []).filter(t => t.status !== 'hecho');
    const weeklyExpenses = (data.expenses || []).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const daughterDays = Object.values(data.weeklyMenu || {}).filter(d => d.daughterMode).length;
    const goals = data.goals || [];
    const avgGoalProgress = goals.length > 0 
      ? goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length 
      : 0;

    return {
      doneTasks,
      pendingTasks,
      weeklyExpenses,
      daughterDays,
      avgGoalProgress: Math.round(avgGoalProgress)
    };
  }, [data]);

  return (
    <div className="page sunday-review">
      <div className="section-header pro-header">
        <h1>REVISIÓN DOMINICAL v2.0</h1>
        <p>Cerrando la semana con claridad y propósito</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card tasks">
          <CheckCircle2 size={24} />
          <div className="val">{stats.doneTasks.length}</div>
          <div className="lab">Logros</div>
        </div>
        <div className="stat-card money">
          <Euro size={24} />
          <div className="val">{stats.weeklyExpenses.toFixed(0)}€</div>
          <div className="lab">Inversión</div>
        </div>
        <div className="stat-card daughter">
          <Heart size={24} />
          <div className="val">{stats.daughterDays}</div>
          <div className="lab">Días Hija</div>
        </div>
        <div className="stat-card goals">
          <Target size={24} />
          <div className="val">{stats.avgGoalProgress}%</div>
          <div className="lab">Metas</div>
        </div>
      </div>

      <main className="review-content">
        <Card title="Tus Victorias de la Semana">
          <div className="wins-list">
            {stats.doneTasks.slice(0, 5).map(task => (
              <div key={task.id} className="win-item">
                <Award size={16} color="#f59e0b" />
                <span>{task.title}</span>
              </div>
            ))}
            {stats.doneTasks.length === 0 && <p className="empty">Esta semana ha sido de preparación. ¡A por la siguiente!</p>}
          </div>
        </Card>

        <Card title="Pendiente Crítico">
          <p className="hint">No los arrastres indefinidamente:</p>
          <div className="pending-list">
            {stats.pendingTasks.filter(t => t.priority === 'Alta' || t.priority === 'Crítica').slice(0, 3).map(task => (
              <div key={task.id} className="p-item">
                <div className="dot"></div>
                <span>{task.title}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="ia-planning-box">
          <div className="ia-info">
            <Sparkles size={24} color="#8b5cf6" />
            <div>
              <h3>Planificación IA</h3>
              <p>Basado en tus resultados, la IA preparará tu próximo lunes.</p>
            </div>
          </div>
          <button className="plan-btn" onClick={() => setPage('assistant')}>
            Generar Plan Lunes <ArrowRight size={18} />
          </button>
        </div>
      </main>

      <style>{`
        .sunday-review { padding: 15px; padding-bottom: 90px; }
        .section-header.pro-header { 
          background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
          margin: -15px -15px 25px -15px;
          padding: 30px 20px;
          color: white;
        }
        .section-header.pro-header h1 { font-size: 1.2rem; letter-spacing: 1px; color: #ede9fe; margin: 0; }
        .section-header.pro-header p { font-size: 0.8em; opacity: 0.8; margin: 5px 0 0 0; }

        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 25px; }
        .stat-card { padding: 20px; border-radius: 20px; color: white; display: flex; flex-direction: column; align-items: flex-start; gap: 5px; }
        .stat-card.tasks { background: #10b981; }
        .stat-card.money { background: #3b82f6; }
        .stat-card.daughter { background: #ec4899; }
        .stat-card.goals { background: #f59e0b; }
        .stat-card .val { font-size: 1.6rem; font-weight: 800; }
        .stat-card .lab { font-size: 0.75em; font-weight: bold; opacity: 0.8; text-transform: uppercase; }

        .wins-list, .pending-list { display: flex; flex-direction: column; gap: 12px; }
        .win-item { display: flex; align-items: center; gap: 10px; font-size: 0.9em; font-weight: 500; }
        .p-item { display: flex; align-items: center; gap: 10px; font-size: 0.9em; opacity: 0.7; }
        .p-item .dot { width: 6px; height: 6px; border-radius: 50%; background: #ef4444; }
        .hint { font-size: 0.75em; opacity: 0.5; margin-top: -10px; margin-bottom: 15px; }

        .ia-planning-box { background: #f5f3ff; border: 2px dashed #c4b5fd; padding: 25px; border-radius: 24px; margin-top: 25px; }
        .ia-info { display: flex; gap: 15px; align-items: center; margin-bottom: 20px; }
        .ia-info h3 { margin: 0; font-size: 1rem; color: #5b21b6; }
        .ia-info p { margin: 0; font-size: 0.8em; opacity: 0.7; }
        .plan-btn { width: 100%; background: #6d28d9; color: white; border: none; padding: 18px; border-radius: 14px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 1rem; box-shadow: 0 4px 12px rgba(109, 40, 217, 0.3); }
      `}</style>
    </div>
  );
}
