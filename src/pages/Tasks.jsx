import { useState, useMemo } from "react";
import { generateId } from "../utils";
import Card from "../components/Card";
import { 
  Plus, 
  CheckCircle, 
  Circle, 
  Clock, 
  Calendar, 
  Filter, 
  Trash2, 
  AlertTriangle, 
  MoreVertical,
  ChevronRight,
  ListTodo,
  Timer,
  RefreshCcw,
  X,
  PlayCircle
} from "lucide-react";

const CATEGORIES = ["Trabajo", "Hija", "Personal", "Hogar", "Salud", "Otros"];
const PRIORITIES = ["Baja", "Media", "Alta"];
const STATUSES = ["pendiente", "en proceso", "hecho"];

import CalendarQuickAdd from "../components/CalendarQuickAdd";

export default function Tasks({ data, setData }) {
  const [view, setView] = useState("all"); // all, today
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterCat, setFilterCat] = useState("Todas");
  const [sortBy, setSortBy] = useState("priority");
  
  // Estado para el modal de programación rápida
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [taskToSchedule, setTaskToSchedule] = useState(null);

  // Utilidad de fecha segura
  const formatLocalDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatLocalDate(new Date());

  // Filtrado y Ordenación
  const filteredTasks = useMemo(() => {
    return data.tasks
      .filter(t => {
        const catMatch = filterCat === "Todas" || 
                        (filterCat === "Urgente" ? t.priority === "Alta" : t.category === filterCat);
        const viewMatch = view === "all" || t.plannedDate === todayStr;
        return catMatch && viewMatch;
      })
      .sort((a, b) => {
        if (sortBy === "priority") {
          const pMap = { Alta: 3, Media: 2, Baja: 1 };
          return pMap[b.priority] - pMap[a.priority];
        }
        if (sortBy === "deadline") return (a.deadline || "").localeCompare(b.deadline || "");
        return 0;
      });
  }, [data.tasks, view, filterCat, sortBy, todayStr]);


  const handleAddTask = () => {
    setEditingTask({
      id: generateId(),
      title: "",
      description: "",
      category: "Personal",
      priority: "Media",
      deadline: todayStr,
      plannedDate: todayStr,
      duration: "30",
      status: "pendiente",
      recurrence: "Ninguna",
      notes: "",
      subtasks: []
    });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const title = editingTask.title.trim();
    
    // VALIDACIÓN DE INPUTS
    if (!title) return alert("El título de la tarea es obligatorio");
    if (title.length > 50) return alert("El título es demasiado largo (máximo 50 caracteres)");
    if (isNaN(editingTask.duration) || editingTask.duration < 0) return alert("La duración debe ser un número válido");

    // PREVENCIÓN DE DUPLICADOS
    const isDuplicate = data.tasks.some(t => 
      t.id !== editingTask.id && 
      t.title.toLowerCase() === title.toLowerCase() &&
      t.plannedDate === editingTask.plannedDate
    );

    if (isDuplicate) {
      if (!window.confirm("Ya existe una tarea con el mismo nombre para esta fecha. ¿Deseas guardarla igualmente?")) {
        return;
      }
    }

    const taskToSave = { ...editingTask, title };
    const exists = data.tasks.find(t => t.id === editingTask.id);
    if (exists) {
      setData({ ...data, tasks: data.tasks.map(t => t.id === editingTask.id ? taskToSave : t) });
    } else {
      setData({ ...data, tasks: [...data.tasks, taskToSave] });
    }
    setShowModal(false);
  };

  const toggleTaskStatus = (id) => {
    setData({
      ...data,
      tasks: data.tasks.map(t => {
        if (t.id === id) {
          const nextStatus = t.status === "hecho" ? "pendiente" : "hecho";
          return { ...t, status: nextStatus };
        }
        return t;
      })
    });
  };

  const deleteTask = (id) => {
    // PROTECCIÓN DE BORRADO
    if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.")) {
      setData({ ...data, tasks: data.tasks.filter(t => t.id !== id) });
      setShowModal(false);
    }
  };


  const addSubtask = () => {
    const title = prompt("Nombre de la subtarea:");
    if (title) {
      setEditingTask({
        ...editingTask,
        subtasks: [...editingTask.subtasks, { id: generateId(), title, done: false }]
      });
    }
  };

  const handleOpenSchedule = (task, e) => {
    e.stopPropagation();
    setTaskToSchedule(task);
    setShowQuickAdd(true);
  };

  const saveQuickEvent = (event) => {
    setData({
      ...data,
      calendarEvents: [...(data.calendarEvents || []), event]
    });
  };

  const isScheduled = (taskId) => {
    return (data.calendarEvents || []).some(e => e.sourceType === 'tasks' && e.sourceId === taskId);
  };

  return (
    <div className="page tasks-page page-transition">
      <div className="section-header">
        <h1>Gestión de Tareas</h1>
        <button className="add-main" onClick={handleAddTask}><Plus /></button>
      </div>

      <div className="chips-container">
        <div 
          className={`chip ${view === 'all' ? 'active' : ''}`} 
          onClick={() => setView('all')}
        >
          Todas
        </div>
        <div 
          className={`chip ${view === 'today' ? 'active' : ''}`} 
          onClick={() => setView('today')}
        >
          Hoy
        </div>
        <div 
          className={`chip ${filterCat === 'Urgente' ? 'active' : ''}`} 
          onClick={() => setFilterCat(filterCat === 'Urgente' ? 'Todas' : 'Urgente')}
        >
          Urgente 🚨
        </div>
        {CATEGORIES.map(c => (
          <div 
            key={c} 
            className={`chip ${filterCat === c ? 'active' : ''}`} 
            onClick={() => setFilterCat(filterCat === c ? 'Todas' : c)}
          >
            {c}
          </div>
        ))}
      </div>

      <div className="tasks-list">

        {filteredTasks.length === 0 && <p className="empty">No hay tareas pendientes aquí.</p>}
        {filteredTasks.map(task => (
          <div key={task.id} className={`task-card ${task.status} ${task.priority.toLowerCase()}`}>
            <button className="status-btn" onClick={() => toggleTaskStatus(task.id)}>
              {task.status === 'hecho' ? <CheckCircle size={24} color="#10b981" /> : <Circle size={24} />}
            </button>
            
            <div className="task-body" onClick={() => { setEditingTask(task); setShowModal(true); }}>
              <div className="task-title-row">
                <h3>{data.settings?.privacyMode ? "••••••••" : task.title}</h3>
                {task.priority === "Alta" && <AlertTriangle size={16} color="#ef4444" />}
                {isScheduled(task.id) && (
                  <div className="scheduled-badge">
                    <Calendar size={10} />
                    Programado
                  </div>
                )}
              </div>
              <div className="task-meta">
                <span><Calendar size={12} /> {task.deadline}</span>
                <span><Timer size={12} /> {task.duration}m</span>
                <span className="cat-tag">{task.category}</span>
              </div>
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="subtasks-progress">
                  <div className="bar">
                    <div 
                      className="fill" 
                      style={{ width: `${(task.subtasks.filter(s => s.done).length / task.subtasks.length) * 100}%` }} 
                    />
                  </div>
                  <span>{task.subtasks.filter(s => s.done).length}/{task.subtasks.length}</span>
                </div>
              )}
            </div>
            
            <div className="task-actions-right">
              <button className="schedule-item-btn" onClick={(e) => handleOpenSchedule(task, e)}>
                <Calendar size={18} />
              </button>
              <div className="task-status-tag">
                {task.status === 'en proceso' && <PlayCircle size={18} color="#3b82f6" />}
                {task.status === 'pendiente' && <Clock size={18} opacity={0.5} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <CalendarQuickAdd 
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onSave={saveQuickEvent}
        data={data}
        sourceType="tasks"
        sourceId={taskToSchedule?.id}
        defaultTitle={taskToSchedule?.title}
        defaultDescription={taskToSchedule?.description}
        defaultCategory={taskToSchedule?.category}
      />


      {showModal && (
        <div className="modal-overlay">
          <div className="task-modal">
            <div className="modal-header">
              <h3>{editingTask.id ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            
            <form onSubmit={handleSave}>
              <input 
                className="main-input"
                type="text" 
                placeholder="¿Qué hay que hacer?" 
                value={editingTask.title} 
                onChange={e => setEditingTask({...editingTask, title: e.target.value})}
                required
              />
              
              <div className="form-grid">
                <div className="field">
                  <label>Categoría</label>
                  <select value={editingTask.category} onChange={e => setEditingTask({...editingTask, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Prioridad</label>
                  <select value={editingTask.priority} onChange={e => setEditingTask({...editingTask, priority: e.target.value})}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Estado</label>
                  <select value={editingTask.status} onChange={e => setEditingTask({...editingTask, status: e.target.value})}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Duración (min)</label>
                  <input type="number" value={editingTask.duration} onChange={e => setEditingTask({...editingTask, duration: e.target.value})} />
                </div>
                <div className="field">
                  <label>Fecha Límite</label>
                  <input type="date" value={editingTask.deadline} onChange={e => setEditingTask({...editingTask, deadline: e.target.value})} />
                </div>
                <div className="field">
                  <label>Planificada</label>
                  <input type="date" value={editingTask.plannedDate} onChange={e => setEditingTask({...editingTask, plannedDate: e.target.value})} />
                </div>
              </div>

              <div className="subtasks-section">
                <div className="sub-head">
                  <label>Subtareas</label>
                  <button type="button" onClick={addSubtask}><Plus size={14} /> Añadir</button>
                </div>
                <div className="sub-list">
                  {editingTask.subtasks.map(sub => (
                    <div key={sub.id} className="sub-item">
                      <input 
                        type="checkbox" 
                        checked={sub.done} 
                        onChange={e => setEditingTask({
                          ...editingTask,
                          subtasks: editingTask.subtasks.map(s => s.id === sub.id ? { ...s, done: e.target.checked } : s)
                        })}
                      />
                      <input 
                        type="text" 
                        value={sub.title} 
                        onChange={e => setEditingTask({
                          ...editingTask,
                          subtasks: editingTask.subtasks.map(s => s.id === sub.id ? { ...s, title: e.target.value } : s)
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <textarea 
                placeholder="Descripción o notas adicionales..." 
                value={editingTask.description} 
                onChange={e => setEditingTask({...editingTask, description: e.target.value})}
              />

              <div className="modal-actions">
                <button type="button" className="del-btn" onClick={() => deleteTask(editingTask.id)}>Eliminar</button>
                <button type="submit" className="save-btn">Guardar Tarea</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .tasks-page { padding: 15px; padding-bottom: 90px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .view-toggle { display: flex; background: var(--bg); padding: 4px; border-radius: 10px; border: 1px solid var(--border); }
        .view-toggle button { border: none; background: transparent; padding: 6px 12px; border-radius: 7px; font-size: 0.85em; color: var(--text); }
        .view-toggle button.active { background: var(--card); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

        .tasks-tools { display: flex; gap: 10px; margin-bottom: 20px; }
        .tool { flex-grow: 1; display: flex; align-items: center; gap: 8px; background: var(--card); padding: 10px; border-radius: 12px; border: 1px solid var(--border); }
        .tool select { border: none; background: transparent; width: 100%; font-size: 0.9em; color: var(--text); }
        .add-main { width: 45px; height: 45px; background: var(--primary); color: white; border: none; border-radius: 12px; display: flex; align-items: center; justify-content: center; }

        .tasks-list { display: flex; flex-direction: column; gap: 12px; }
        .task-card {
          background: var(--card);
          border: 1px solid var(--border);
          padding: 15px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: transform 0.1s;
        }
        .task-card:active { transform: scale(0.98); }
        .task-card.hecho { opacity: 0.5; }
        .task-card.hecho h3 { text-decoration: line-through; }
        .task-card.alta { border-left: 5px solid #ef4444; }
        .task-card.media { border-left: 5px solid #f59e0b; }
        .task-card.baja { border-left: 5px solid #3b82f6; }
        
        .status-btn { background: none; border: none; padding: 0; }
        .task-body { flex-grow: 1; }
        .task-title-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        .task-title-row h3 { font-size: 1rem; margin: 0; }
        .task-meta { display: flex; flex-wrap: wrap; gap: 10px; font-size: 0.75em; opacity: 0.6; }
        .cat-tag { background: var(--bg); padding: 2px 8px; border-radius: 10px; }
        
        .subtasks-progress { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
        .subtasks-progress .bar { flex-grow: 1; height: 4px; background: var(--bg); border-radius: 2px; overflow: hidden; }
        .subtasks-progress .fill { height: 100%; background: var(--primary); transition: width 0.3s; }
        .subtasks-progress span { font-size: 0.7em; opacity: 0.6; }

        /* MODAL */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; justify-content: center; z-index: 1000; }
        .task-modal { background: var(--card); width: 100%; max-width: 500px; padding: 25px; border-radius: 24px 24px 0 0; }
        .main-input { width: 100%; font-size: 1.3rem; font-weight: bold; border: none; border-bottom: 2px solid var(--border); padding: 10px 0; margin-bottom: 20px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .field label { display: block; font-size: 0.75em; font-weight: bold; opacity: 0.5; margin-bottom: 4px; }
        
        .subtasks-section { margin-bottom: 20px; }
        .sub-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .sub-head label { font-size: 0.75em; font-weight: bold; opacity: 0.5; }
        .sub-head button { background: var(--bg); border: 1px solid var(--border); padding: 4px 10px; border-radius: 8px; font-size: 0.75em; }
        .sub-list { display: flex; flex-direction: column; gap: 8px; max-height: 120px; overflow-y: auto; }
        .sub-item { display: flex; gap: 10px; align-items: center; }
        .sub-item input[type="text"] { flex-grow: 1; border: none; background: var(--bg); padding: 5px 10px; border-radius: 6px; font-size: 0.85em; }

        textarea { width: 100%; height: 60px; margin-bottom: 20px; border-radius: 12px; }
        .modal-actions { display: flex; gap: 10px; }
        .save-btn { flex-grow: 1; background: var(--primary); color: white; border: none; padding: 15px; border-radius: 12px; font-weight: bold; }
        .del-btn { background: #fee2e2; color: #ef4444; border: none; padding: 15px; border-radius: 12px; font-weight: bold; }
      `}</style>
    </div>
  );
}