import { useState, useMemo } from "react";
import { 
  Zap, 
  CheckCircle, 
  Circle, 
  ArrowLeft, 
  AlertCircle, 
  Target, 
  ShieldCheck,
  Brain
} from "lucide-react";

export default function FocusMode({ data, setData, setPage }) {
  // Algoritmo: Seleccionar las 3 tareas más prioritarias que no estén hechas
  const focusTasks = useMemo(() => {
    const pMap = { Crítica: 4, Alta: 3, Media: 2, Baja: 1 };
    return data.tasks
      .filter(t => t.status !== 'hecho')
      .sort((a, b) => pMap[b.priority] - pMap[a.priority])
      .slice(0, 3);
  }, [data.tasks]);

  const handleToggleTask = (id) => {
    setData({
      ...data,
      tasks: data.tasks.map(t => t.id === id ? { ...t, status: t.status === 'hecho' ? 'pendiente' : 'hecho' } : t)
    });
  };

  const completedCount = focusTasks.filter(t => t.status === 'hecho').length;
  const progressPercent = Math.round((completedCount / 3) * 100);

  return (
    <div className="focus-mode">
      <div className="focus-header">
        <button className="back-btn" onClick={() => setPage('dashboard')}>
          <ArrowLeft size={20} /> Volver
        </button>
        <div className="focus-badge">
          <Brain size={16} /> <span>MODO FOCO ACTIVO</span>
        </div>
      </div>

      <main className="focus-main">
        <div className="focus-intro">
          <h1>Solo estas 3 cosas.</h1>
          <p>Olvida el resto. Hoy solo importa esto para ganar el día.</p>
        </div>

        <div className="focus-progress-bar">
          <div className="progress-fill" style={{ width: `${(completedCount / 3) * 100}%` }}></div>
          <span className="progress-text">{completedCount} de 3 completadas</span>
        </div>

        <div className="focus-tasks-container">
          {focusTasks.length === 0 ? (
            <div className="focus-empty">
              <ShieldCheck size={48} color="#10b981" />
              <h2>¡Misión Cumplida!</h2>
              <p>Has terminado las prioridades de hoy. Respira y disfruta.</p>
            </div>
          ) : (
            focusTasks.map(task => (
              <div 
                key={task.id} 
                className={`focus-task-card ${task.status === 'hecho' ? 'done' : ''} ${task.priority.toLowerCase()}`}
                onClick={() => handleToggleTask(task.id)}
              >
                <div className="check-box">
                  {task.status === 'hecho' ? <CheckCircle size={32} color="#10b981" /> : <Circle size={32} color="#cbd5e1" />}
                </div>
                <div className="task-info">
                  <h3>{task.title}</h3>
                  <div className="task-meta">
                    <span className="priority-tag">{task.priority}</span>
                    <span className="cat-tag">{task.category}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="focus-message">
          <AlertCircle size={20} />
          <span>No mires el calendario. No mires el dinero. Solo acaba esto.</span>
        </div>
      </main>

      <style>{`
        .focus-mode {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: #0f172a;
          color: white;
          z-index: 2000;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .focus-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .back-btn { background: rgba(255,255,255,0.1); border: none; color: white; padding: 8px 15px; border-radius: 20px; display: flex; align-items: center; gap: 8px; font-size: 0.85em; }
        .focus-badge { display: flex; align-items: center; gap: 6px; font-size: 0.7em; font-weight: bold; color: #3b82f6; border: 1px solid #3b82f6; padding: 4px 12px; border-radius: 20px; }

        .focus-intro { margin-bottom: 30px; text-align: center; }
        .focus-intro h1 { font-size: 2rem; margin: 0; font-weight: 800; }
        .focus-intro p { font-size: 0.9em; opacity: 0.6; margin-top: 10px; }

        .focus-progress-bar { background: rgba(255,255,255,0.05); height: 40px; border-radius: 20px; position: relative; margin-bottom: 40px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
        .progress-fill { background: linear-gradient(90deg, #3b82f6, #10b981); height: 100%; transition: width 0.5s ease; }
        .progress-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.8em; font-weight: bold; }

        .focus-tasks-container { display: flex; flex-direction: column; gap: 20px; flex-grow: 1; }
        .focus-task-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 25px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.2s;
        }
        .focus-task-card.done { opacity: 0.3; border-color: #10b981; }
        .focus-task-card.crítica { border-left: 8px solid #ef4444; }
        .focus-task-card.alta { border-left: 8px solid #f97316; }

        .task-info h3 { margin: 0; font-size: 1.2rem; }
        .task-meta { display: flex; gap: 10px; margin-top: 5px; font-size: 0.7em; font-weight: bold; opacity: 0.5; }
        .priority-tag { color: #f97316; }

        .focus-empty { text-align: center; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; gap: 15px; }
        .focus-message { margin-top: auto; background: rgba(59, 130, 246, 0.1); padding: 20px; border-radius: 15px; display: flex; align-items: center; gap: 15px; font-size: 0.85em; opacity: 0.8; text-align: center; }

        @media (max-width: 400px) {
          .focus-intro h1 { font-size: 1.5rem; }
          .focus-task-card { padding: 15px; }
          .focus-task-card h3 { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
}
