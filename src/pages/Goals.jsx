import { useState, useMemo } from "react";
import Card from "../components/Card";
import { 
  Trophy, 
  Plus, 
  CheckCircle, 
  Circle, 
  Target, 
  Calendar, 
  TrendingUp, 
  AlertOctagon, 
  X,
  ChevronRight,
  ClipboardList,
  Sparkles,
  MoreVertical,
  Flag
} from "lucide-react";

const CATEGORIES = ["Salud", "Trabajo", "Finanzas", "Hija", "Personal", "Otros"];
const STATUSES = ["En curso", "Pausado", "Logrado"];

import CalendarQuickAdd from "../components/CalendarQuickAdd";

export default function Goals({ data, setData }) {
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filterCat, setFilterCat] = useState("Todas");

  // Estado para el modal de programación rápida
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [itemToSchedule, setItemToSchedule] = useState(null);

  // Utilidad de fecha segura
  const formatLocalDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatLocalDate(new Date());

  const filteredGoals = useMemo(() => {
    return data.goals.filter(g => filterCat === "Todas" || g.category === filterCat);
  }, [data.goals, filterCat]);

  const handleAddGoal = () => {
    setEditingGoal({
      id: crypto.randomUUID(),
      title: "",
      reason: "",
      category: "Personal",
      startDate: todayStr,
      targetDate: todayStr,
      progress: 0,
      status: "En curso",
      miniActions: [],
      obstacles: ""
    });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const title = editingGoal.title.trim();
    const reason = editingGoal.reason.trim();

    // VALIDACIÓN DE INPUTS
    if (!title) return alert("El título del objetivo es obligatorio");
    if (!reason) return alert("Debes definir un motivo o motivación");
    if (title.length > 60) return alert("El título es demasiado largo (máximo 60 caracteres)");

    // PREVENCIÓN DE DUPLICADOS
    const isDuplicate = data.goals.some(g => 
      g.id !== editingGoal.id && 
      g.title.toLowerCase() === title.toLowerCase()
    );

    if (isDuplicate) {
      if (!window.confirm("Ya tienes un objetivo con este nombre. ¿Deseas crear otro igual?")) {
        return;
      }
    }

    const goalToSave = { ...editingGoal, title, reason };
    const exists = data.goals.find(g => g.id === editingGoal.id);
    if (exists) {
      setData({ ...data, goals: data.goals.map(g => g.id === editingGoal.id ? goalToSave : g) });
    } else {
      setData({ ...data, goals: [...data.goals, goalToSave] });
    }
    setShowModal(false);
  };

  const addMiniAction = () => {
    const title = prompt("Nombre de la mini-acción:");
    if (title && title.trim()) {
      const newActions = [...editingGoal.miniActions, { id: crypto.randomUUID(), title: title.trim(), done: false }];
      // Auto-calcular progreso basado en acciones
      const progress = Math.round((newActions.filter(a => a.done).length / newActions.length) * 100);
      setEditingGoal({ ...editingGoal, miniActions: newActions, progress });
    }
  };

  const toggleMiniActionInList = (goalId, actionId) => {
    setData({
      ...data,
      goals: data.goals.map(g => {
        if (g.id === goalId) {
          const newActions = g.miniActions.map(a => a.id === actionId ? { ...a, done: !a.done } : a);
          const progress = Math.round((newActions.filter(a => a.done).length / newActions.length) * 100);
          return { ...g, miniActions: newActions, progress };
        }
        return g;
      })
    });
  };

  const deleteGoal = (id) => {
    // PROTECCIÓN DE BORRADO
    if (window.confirm("¿Seguro que quieres eliminar este objetivo estratégico? Se borrará todo su progreso y acciones.")) {
      setData({ ...data, goals: data.goals.filter(g => g.id !== id) });
      setShowModal(false);
    }
  };


  const handleOpenSchedule = (item, type, e) => {
    e.stopPropagation();
    setItemToSchedule({ ...item, type });
    setShowQuickAdd(true);
  };

  const saveQuickEvent = (event) => {
    setData({
      ...data,
      calendarEvents: [...(data.calendarEvents || []), event]
    });
  };

  const isScheduled = (id, type) => {
    return (data.calendarEvents || []).some(e => e.sourceType === type && e.sourceId === id);
  };

  return (
    <div className="page goals-page">
      <div className="section-header pro-header">
        <h1>SISTEMA ESTRATÉGICO DE METAS v2.0</h1>
        <div className="stat-pill">
          <Trophy size={16} />
          <span>{data.goals.filter(g => g.status === 'Logrado').length} Logrados</span>
        </div>
      </div>

      <div className="goals-tools">
        <div className="tool">
          <Target size={16} />
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="Todas">Categorías</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button className="add-main" onClick={handleAddGoal}><Plus /></button>
      </div>

      <div className="goals-list">
        {filteredGoals.length === 0 && <p className="empty">No hay objetivos en esta categoría.</p>}
        {filteredGoals.map(goal => (
          <div key={goal.id} className={`goal-card ${goal.status === 'Logrado' ? 'achieved' : ''}`}>
            <div className="goal-header" onClick={() => { setEditingGoal(goal); setShowModal(true); }}>
              <div className="goal-progress-circle">
                <svg viewBox="0 0 36 36">
                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle" strokeDasharray={`${goal.progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span>{goal.progress}%</span>
              </div>
              <div className="goal-title-info">
                <div className="title-row">
                  <h3>{data.settings?.privacyMode ? "••••••••" : goal.title}</h3>
                  {isScheduled(goal.id, 'goals') && <div className="scheduled-badge"><Calendar size={10}/></div>}
                </div>
                <div className="goal-meta">
                  <span><Flag size={12} /> {goal.targetDate}</span>
                  <span className="cat-tag">{goal.category}</span>
                </div>
              </div>
              <div className="goal-actions">
                <button className="schedule-item-btn small" onClick={(e) => handleOpenSchedule(goal, 'goals', e)}>
                  <Calendar size={14} />
                </button>
                <ChevronRight size={20} opacity={0.3} />
              </div>
            </div>

            <div className="goal-reason">
              <strong>Motivo:</strong> {data.settings?.privacyMode ? "Censurado por privacidad" : goal.reason}
            </div>


            {goal.miniActions.length > 0 && (
              <div className="mini-actions-preview">
                {goal.miniActions.slice(0, 3).map(action => (
                  <div key={action.id} className="action-row">
                    <div className="action-item" onClick={() => toggleMiniActionInList(goal.id, action.id)}>
                      {action.done ? <CheckCircle size={16} color="#10b981" /> : <Circle size={16} color="#94a3b8" />}
                      <span className={action.done ? 'done' : ''}>{action.title}</span>
                      {isScheduled(action.id, 'goals-action') && <div className="scheduled-badge min"><Calendar size={8}/></div>}
                    </div>
                    <button className="action-schedule-btn" onClick={(e) => handleOpenSchedule(action, 'goals-action', e)}>
                      <Calendar size={12} />
                    </button>
                  </div>
                ))}
                {goal.miniActions.length > 3 && <div className="more-actions">+{goal.miniActions.length - 3} más...</div>}
              </div>
            )}
          </div>
        ))}
      </div>

      <CalendarQuickAdd 
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onSave={saveQuickEvent}
        data={data}
        sourceType={itemToSchedule?.type}
        sourceId={itemToSchedule?.id}
        defaultTitle={itemToSchedule?.title || itemToSchedule?.name}
        defaultCategory={itemToSchedule?.category || "Personal"}
      />


      {showModal && (
        <div className="modal-overlay">
          <div className="goal-modal">
            <div className="modal-header">
              <h3>{editingGoal.id ? 'Editar Objetivo' : 'Nuevo Objetivo'}</h3>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            
            <form onSubmit={handleSave}>
              <input 
                className="main-input"
                type="text" 
                placeholder="¿Qué quieres lograr?" 
                value={editingGoal.title} 
                onChange={e => setEditingGoal({...editingGoal, title: e.target.value})}
                required
              />
              
              <textarea 
                className="reason-input"
                placeholder="¿Por qué es importante para ti? (Motivación)" 
                value={editingGoal.reason} 
                onChange={e => setEditingGoal({...editingGoal, reason: e.target.value})}
                required
              />

              <div className="form-grid">
                <div className="field">
                  <label>Categoría</label>
                  <select value={editingGoal.category} onChange={e => setEditingGoal({...editingGoal, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Estado</label>
                  <select value={editingGoal.status} onChange={e => setEditingGoal({...editingGoal, status: e.target.value})}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Fecha Inicio</label>
                  <input type="date" value={editingGoal.startDate} onChange={e => setEditingGoal({...editingGoal, startDate: e.target.value})} />
                </div>
                <div className="field">
                  <label>Fecha Objetivo</label>
                  <input type="date" value={editingGoal.targetDate} onChange={e => setEditingGoal({...editingGoal, targetDate: e.target.value})} />
                </div>
              </div>

              <div className="sub-section">
                <div className="sub-header">
                  <label>Mini-acciones (Plan de acción)</label>
                  <button type="button" onClick={addMiniAction}><Plus size={14} /> Añadir</button>
                </div>
                <div className="mini-actions-list">
                  {editingGoal.miniActions.map(action => (
                    <div key={action.id} className="edit-action-item">
                      <input 
                        type="checkbox" 
                        checked={action.done} 
                        onChange={e => {
                          const newActions = editingGoal.miniActions.map(a => a.id === action.id ? { ...a, done: e.target.checked } : a);
                          const progress = Math.round((newActions.filter(a => a.done).length / newActions.length) * 100);
                          setEditingGoal({...editingGoal, miniActions: newActions, progress});
                        }}
                      />
                      <input 
                        type="text" 
                        value={action.title} 
                        onChange={e => setEditingGoal({
                          ...editingGoal,
                          miniActions: editingGoal.miniActions.map(a => a.id === action.id ? { ...a, title: e.target.value } : a)
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Obstáculos Previstos</label>
                <textarea 
                  placeholder="¿Qué podría impedirte lograrlo?" 
                  value={editingGoal.obstacles} 
                  onChange={e => setEditingGoal({...editingGoal, obstacles: e.target.value})}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="del-btn" onClick={() => deleteGoal(editingGoal.id)}>Eliminar</button>
                <button type="submit" className="save-btn">Guardar Objetivo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .goals-page { padding: 15px; padding-bottom: 90px; }
        .section-header.pro-header { 
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          margin: -15px -15px 25px -15px;
          padding: 30px 20px;
          color: white;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }
        .section-header.pro-header h1 { font-size: 1.2rem; letter-spacing: 1px; color: #f8fafc; }
        .stat-pill { background: #1e293b; color: white; padding: 6px 15px; border-radius: 20px; font-size: 0.8em; display: flex; align-items: center; gap: 8px; }

        .goals-tools { display: flex; gap: 10px; margin-bottom: 25px; }
        .tool { flex-grow: 1; display: flex; align-items: center; gap: 8px; background: var(--card); padding: 10px; border-radius: 12px; border: 1px solid var(--border); }
        .tool select { border: none; background: transparent; width: 100%; font-size: 0.85em; color: var(--text); }
        .add-main { width: 45px; height: 45px; background: var(--primary); color: white; border: none; border-radius: 12px; display: flex; align-items: center; justify-content: center; }

        .goals-list { display: flex; flex-direction: column; gap: 15px; }
        .goal-card { background: var(--card); border: 1px solid var(--border); border-radius: 24px; padding: 20px; }
        .goal-header { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; cursor: pointer; }
        
        .goal-progress-circle { width: 50px; height: 50px; position: relative; }
        .goal-progress-circle svg { transform: rotate(-90deg); }
        .circle-bg { fill: none; stroke: var(--bg); stroke-width: 3; }
        .circle { fill: none; stroke: var(--primary); stroke-width: 3; stroke-linecap: round; transition: stroke-dasharray 0.3s; }
        .goal-progress-circle span { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.7em; font-weight: bold; }

        .goal-title-info { flex-grow: 1; }
        .goal-title-info h3 { font-size: 1.1rem; margin: 0; }
        .goal-meta { display: flex; gap: 10px; font-size: 0.75em; opacity: 0.5; margin-top: 4px; }
        .cat-tag { background: var(--bg); padding: 1px 6px; border-radius: 6px; }

        .goal-reason { font-size: 0.85em; background: var(--bg); padding: 12px; border-radius: 12px; margin-bottom: 15px; line-height: 1.4; }
        
        .mini-actions-preview { display: flex; flex-direction: column; gap: 8px; }
        .action-row { display: flex; justify-content: space-between; align-items: center; }
        .action-item { display: flex; align-items: center; gap: 10px; font-size: 0.85em; cursor: pointer; flex-grow: 1; }
        .action-item span.done { text-decoration: line-through; opacity: 0.5; }
        .action-schedule-btn { background: none; border: none; padding: 4px; color: var(--muted); cursor: pointer; opacity: 0.4; }
        .action-schedule-btn:hover { opacity: 1; color: var(--primary); }
        .scheduled-badge.min { padding: 2px 4px; border-radius: 4px; }
        .more-actions { font-size: 0.75em; opacity: 0.4; margin-left: 26px; }

        .goal-actions { display: flex; align-items: center; gap: 10px; }
        .schedule-item-btn.small { width: 32px; height: 32px; border-radius: 8px; }

        /* MODAL */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; justify-content: center; z-index: 1000; }
        .goal-modal { background: var(--card); width: 100%; max-width: 500px; padding: 25px; border-radius: 24px 24px 0 0; max-height: 90vh; overflow-y: auto; }
        .main-input { width: 100%; font-size: 1.3rem; font-weight: bold; border: none; border-bottom: 2px solid var(--border); padding: 10px 0; margin-bottom: 15px; }
        .reason-input { width: 100%; height: 60px; font-size: 0.9em; border: none; background: var(--bg); padding: 12px; border-radius: 12px; margin-bottom: 20px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .field label { display: block; font-size: 0.75em; font-weight: bold; opacity: 0.5; margin-bottom: 5px; }
        
        .sub-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .sub-header label { font-size: 0.75em; font-weight: bold; opacity: 0.5; }
        .sub-header button { background: var(--bg); border: 1px solid var(--border); padding: 4px 10px; border-radius: 8px; font-size: 0.75em; }
        .mini-actions-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .edit-action-item { display: flex; gap: 10px; align-items: center; }
        .edit-action-item input[type="text"] { flex-grow: 1; border: none; background: var(--bg); padding: 8px 12px; border-radius: 8px; font-size: 0.85em; }

        .modal-actions { display: flex; gap: 10px; margin-top: 25px; }
        .save-btn { flex-grow: 1; background: var(--primary); color: white; border: none; padding: 15px; border-radius: 12px; font-weight: bold; }
        .del-btn { background: #fee2e2; color: #ef4444; border: none; padding: 15px; border-radius: 12px; font-weight: bold; }
      `}</style>
    </div>
  );
}