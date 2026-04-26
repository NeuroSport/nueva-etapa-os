import Card from "../../components/Card";
import { CheckCircle, Clock, Wallet, Heart, Target, ArrowRight, RefreshCcw } from "lucide-react";

export default function WeeklyReview({ data }) {
  const completedTasks = data.tasks.filter(t => t.done);
  const pendingTasks = data.tasks.filter(t => !t.done);
  const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);
  const daughterEvents = data.custody.calendar.filter(e => e.type === 'hija');
  const goalProgress = data.goals.reduce((sum, g) => sum + g.progress, 0) / (data.goals.length || 1);

  return (
    <div className="page review-page">
      <div className="section-header">
        <h1>Revisión Semanal (Domingo)</h1>
        <p>Analiza el pasado para conquistar el futuro</p>
      </div>

      <div className="review-stats">
        <div className="stat-box">
          <CheckCircle size={24} color="#10b981" />
          <div className="val">{completedTasks.length}</div>
          <div className="lab">Tareas completadas</div>
        </div>
        <div className="stat-box">
          <Heart size={24} color="#ec4899" />
          <div className="val">{daughterEvents.length}</div>
          <div className="lab">Momentos con Hija</div>
        </div>
        <div className="stat-box">
          <Wallet size={24} color="#f59e0b" />
          <div className="val">{totalExpenses}€</div>
          <div className="lab">Gastado esta semana</div>
        </div>
        <div className="stat-box">
          <Target size={24} color="#3b82f6" />
          <div className="val">{goalProgress.toFixed(0)}%</div>
          <div className="lab">Progreso Medio Metas</div>
        </div>
      </div>

      <div className="review-grid">
        <Card title="Lo que has logrado">
          <div className="log-list">
            {completedTasks.slice(0, 5).map(t => (
              <div key={t.id} className="log-item done">
                <CheckCircle size={16} /> {t.title}
              </div>
            ))}
            {completedTasks.length > 5 && <p className="more">...y {completedTasks.length - 5} tareas más.</p>}
            {completedTasks.length === 0 && <p className="empty">Esta semana no has marcado tareas como hechas.</p>}
          </div>
        </Card>

        <Card title="Pendiente para la próxima semana">
          <div className="log-list">
            {pendingTasks.slice(0, 5).map(t => (
              <div key={t.id} className="log-item">
                <Clock size={16} /> {t.title}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="next-steps">
        <Card title="💡 Plan Recomendado para Mañana">
          <div className="recommendation">
            <div className="rec-step">
              <span className="step-num">1</span>
              <p>Revisa la <strong>Lista de Compra PRO</strong> basada en el menú que has planeado.</p>
            </div>
            <div className="rec-step">
              <span className="step-num">2</span>
              <p>Tienes <strong>{pendingTasks.length} tareas</strong> pendientes. Elige las 3 más importantes antes de las 10:00 AM.</p>
            </div>
            <div className="rec-step">
              <span className="step-num">3</span>
              <p>Tu semáforo económico está en <strong>{data.budgetPro.status === 'green' ? 'VERDE' : 'ALERTA'}</strong>. Ajusta los gastos variables.</p>
            </div>
            <button className="action-btn-main">
              <RefreshCcw size={18} /> Iniciar Nueva Semana
            </button>
          </div>
        </Card>
      </div>

      <style>{`
        .review-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 25px;
        }
        .stat-box {
          background: var(--card);
          padding: 20px;
          border-radius: 16px;
          border: 1px solid var(--border);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }
        .stat-box .val { font-size: 1.8rem; font-weight: bold; }
        .stat-box .lab { font-size: 0.8em; opacity: 0.6; }
        
        .review-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-bottom: 25px;
        }
        @media (min-width: 800px) { .review-grid { grid-template-columns: 1fr 1fr; } }
        
        .log-list { display: flex; flex-direction: column; gap: 10px; }
        .log-item { display: flex; align-items: center; gap: 10px; font-size: 0.9em; opacity: 0.8; }
        .log-item.done { color: #10b981; opacity: 1; }
        
        .recommendation { display: flex; flex-direction: column; gap: 20px; }
        .rec-step { display: flex; gap: 15px; align-items: flex-start; }
        .step-num {
          background: var(--primary);
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-weight: bold;
        }
        .rec-step p { margin: 0; font-size: 0.95em; line-height: 1.4; }
        .action-btn-main {
          margin-top: 10px;
          background: var(--primary);
          color: white;
          border: none;
          padding: 15px;
          border-radius: 12px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
      `}</style>
    </div>
  );
}
