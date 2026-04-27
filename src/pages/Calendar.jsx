import { useState, useMemo, useEffect } from "react";
import { generateId } from "../utils";
import Card from "../components/Card";
import WeekOptimizerModal from "../components/WeekOptimizerModal";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Filter, 
  Star, 
  CheckCircle, 
  AlertCircle,
  Baby,
  Briefcase,
  Wallet,
  User,
  HeartPulse,
  Home,
  Gavel,
  Palmtree,
  Users,
  AlertTriangle,
  X,
  CalendarDays,
  Target,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

const CATEGORIES = {
  Hija: { color: "#10b981", icon: Baby },
  Trabajo: { color: "#3b82f6", icon: Briefcase },
  Economía: { color: "#f59e0b", icon: Wallet },
  Personal: { color: "#8b5cf6", icon: User },
  Salud: { color: "#fb7185", icon: HeartPulse },
  Casa: { color: "#64748b", icon: Home },
  Legal: { color: "#facc15", icon: Gavel },
  Ocio: { color: "#06b6d4", icon: Palmtree },
  Familia: { color: "#ec4899", icon: Users },
  Urgente: { color: "#ef4444", icon: AlertTriangle }
};

export default function Calendar({ data, setData }) {
  const [view, setView] = useState("month"); // day, week, month, year
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filterCat, setFilterCat] = useState("Todas");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [showOptimizer, setShowOptimizer] = useState(false);

  useEffect(() => {
    const handleOpenOptimizer = () => setShowOptimizer(true);
    window.addEventListener('openWeekOptimizer', handleOpenOptimizer);
    return () => window.removeEventListener('openWeekOptimizer', handleOpenOptimizer);
  }, []);

  // Utilidades de fecha seguras (evitan desfases UTC)
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Combinar eventos de calendario PRO con eventos de Custodia
  const allEvents = useMemo(() => {
    const proEvents = (data.calendarEvents || []).map(e => ({ ...e, source: 'pro' }));
    const custodyEvents = (data.daughterSystem?.custodyCalendar || []).map(e => ({
      id: e.id,
      title: e.title,
      date: e.date,
      startTime: "09:00",
      endTime: "21:00",
      category: "Hija",
      priority: "Media",
      status: "Pendiente",
      important: e.type === 'vacaciones',
      completed: false,
      notes: e.notes || "",
      source: 'custody'
    }));
    
    return [...proEvents, ...custodyEvents].filter(e => {
      const catMatch = filterCat === "Todas" || e.category === filterCat;
      const statusMatch = filterStatus === "Todos" || 
                         (filterStatus === "Pendientes" && !e.completed) ||
                         (filterStatus === "Completados" && e.completed) ||
                         (filterStatus === "Importantes" && e.important);
      return catMatch && statusMatch;
    });
  }, [data.calendarEvents, data.daughterSystem?.custodyCalendar, filterCat, filterStatus]);

  const navigate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === "day") newDate.setDate(currentDate.getDate() + direction);
    if (view === "week") newDate.setDate(currentDate.getDate() + (direction * 7));
    if (view === "month") newDate.setMonth(currentDate.getMonth() + direction);
    if (view === "year") newDate.setFullYear(currentDate.getFullYear() + direction);
    setCurrentDate(newDate);
  };

  const handleAddEvent = (initialData = {}) => {
    setEditingEvent({
      id: generateId(),
      title: "",
      description: "",
      date: initialData.date || formatLocalDate(currentDate),
      startTime: "10:00",
      endTime: "11:00",
      category: "Personal",
      priority: "Media",
      status: "Pendiente",
      important: false,
      completed: false,
      notes: "",
      ...initialData
    });
    setShowModal(true);
  };

  const saveEvent = (e) => {
    e.preventDefault();
    const events = data.calendarEvents || [];
    const isNew = !events.find(ev => ev.id === editingEvent.id);
    if (isNew) {
      setData({ ...data, calendarEvents: [...events, editingEvent] });
    } else {
      setData({
        ...data,
        calendarEvents: events.map(ev => ev.id === editingEvent.id ? editingEvent : ev)
      });
    }
    setShowModal(false);
    setEditingEvent(null);
  };

  const deleteEvent = (id) => {
    setData({ ...data, calendarEvents: (data.calendarEvents || []).filter(ev => ev.id !== id) });
    setShowModal(false);
  };

  // Lógica Drag & Drop
  const handleDragStart = (e, event) => {
    if (event.source !== 'pro') {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", event.id);
    e.target.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e, targetDate) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const eventId = e.dataTransfer.getData("text/plain");
    if (!eventId) return;

    const events = data.calendarEvents || [];
    const eventToMove = events.find(ev => ev.id === eventId);
    
    if (eventToMove && eventToMove.date !== targetDate) {
      setData({
        ...data,
        calendarEvents: events.map(ev => ev.id === eventId ? { ...ev, date: targetDate } : ev)
      });
    }
  };

  // Lógica Optimización IA
  const applyAISuggestion = (sugg) => {
    let events = [...(data.calendarEvents || [])];
    
    if (sugg.type === 'move_event') {
      const idx = events.findIndex(e => e.id === sugg.eventId);
      if (idx !== -1) {
        events[idx] = { ...events[idx], date: sugg.toDate, startTime: sugg.newStartTime || events[idx].startTime, endTime: sugg.newEndTime || events[idx].endTime };
      }
    } else {
      let newEvent = {
        id: generateId(), title: sugg.title || 'Evento IA', date: sugg.date, startTime: sugg.startTime || '10:00', endTime: sugg.endTime || '11:00',
        category: 'Personal', priority: 'Media', important: false, completed: false, notes: sugg.reason, source: 'pro'
      };

      if (sugg.type === 'schedule_task') {
        newEvent.category = 'Trabajo'; newEvent.important = true; newEvent.sourceType = 'task'; newEvent.sourceId = sugg.taskId;
      } else if (sugg.type === 'add_daughter_plan') {
        newEvent.category = 'Hija'; newEvent.important = true; newEvent.title = sugg.title || 'Plan Hija';
      } else if (sugg.type === 'add_budget_reminder') {
        newEvent.category = 'Economía'; newEvent.important = true; newEvent.title = sugg.title || 'Aviso Economía';
      }
      
      events.push(newEvent);
    }
    
    setData({ ...data, calendarEvents: events });
  };

  const applyAllAISuggestions = (suggestions) => {
    let events = [...(data.calendarEvents || [])];
    
    suggestions.forEach(sugg => {
      if (sugg.type === 'move_event') {
        const idx = events.findIndex(e => e.id === sugg.eventId);
        if (idx !== -1) {
          events[idx] = { ...events[idx], date: sugg.toDate, startTime: sugg.newStartTime || events[idx].startTime, endTime: sugg.newEndTime || events[idx].endTime };
        }
      } else {
        let newEvent = { id: generateId(), title: sugg.title || 'Evento IA', date: sugg.date, startTime: sugg.startTime || '10:00', endTime: sugg.endTime || '11:00', category: 'Personal', priority: 'Media', important: false, completed: false, notes: sugg.reason, source: 'pro' };
        if (sugg.type === 'schedule_task') { newEvent.category = 'Trabajo'; newEvent.important = true; newEvent.sourceType = 'task'; newEvent.sourceId = sugg.taskId; }
        else if (sugg.type === 'add_daughter_plan') { newEvent.category = 'Hija'; newEvent.important = true; newEvent.title = sugg.title || 'Plan Hija'; }
        else if (sugg.type === 'add_budget_reminder') { newEvent.category = 'Economía'; newEvent.important = true; newEvent.title = sugg.title || 'Aviso Economía'; }
        events.push(newEvent);
      }
    });
    
    setData({ ...data, calendarEvents: events });
  };


  // Lógica de semana: Obtener lunes a domingo
  const getWeekDays = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Lunes
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(diff + i);
      week.push(d);
    }
    return week;
  };

  // VISTAS
  const renderDayView = () => {
    const dateKey = formatLocalDate(currentDate);
    const dayEvents = allEvents.filter(e => e.date === dateKey).sort((a,b) => a.startTime.localeCompare(b.startTime));

    return (
      <div className="day-view">
        <div className="day-header">
          <h2>{currentDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
          <button className="add-float" onClick={() => handleAddEvent()}><Plus /></button>
        </div>
        <div className="events-timeline">
          {dayEvents.length === 0 && <p className="empty">No hay eventos para hoy.</p>}
          {dayEvents.map(event => (
            <div 
              key={event.id} 
              className={`event-card ${event.completed ? 'completed' : ''}`}
              style={{ borderLeftColor: CATEGORIES[event.category]?.color }}
              onClick={() => { if(event.source === 'pro') { setEditingEvent(event); setShowModal(true); } }}
            >
              <div className="time">{event.startTime} - {event.endTime}</div>
              <div className="details">
                <div className="title-row">
                  {event.important && <Star size={14} fill="#f59e0b" color="#f59e0b" />}
                  <strong>{event.title}</strong>
                </div>
                <div className="cat-label">
                  {(() => { const Icon = CATEGORIES[event.category]?.icon; return Icon ? <Icon size={12} /> : null; })()}
                  {event.category}
                </div>
              </div>
              {event.completed && <CheckCircle size={20} color="#10b981" />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getWeekDays(currentDate);
    return (
      <div className="week-scroll-view">
        {days.map((day, idx) => {
          const dateKey = formatLocalDate(day);
          const dayEvents = allEvents.filter(e => e.date === dateKey).sort((a,b) => a.startTime.localeCompare(b.startTime));
          const isToday = formatLocalDate(new Date()) === dateKey;

          return (
            <div 
              key={idx} 
              className={`week-day-card ${isToday ? 'today' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, dateKey)}
            >
              <div className="day-info">
                <div className="day-name">
                  <span>{day.toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                  <strong>{day.getDate()}</strong>
                </div>
                <div className="day-meta">
                  <span className="count">{dayEvents.length} eventos</span>
                  {dayEvents.some(e => e.important) && <Star size={12} fill="#f59e0b" color="#f59e0b" />}
                </div>
                <button className="add-day-btn" onClick={() => handleAddEvent({ date: dateKey })}>
                  <Plus size={16} />
                </button>
              </div>

              <div className="day-events-list">
                {dayEvents.map(ev => (
                  <div 
                    key={ev.id} 
                    className="mini-event-row" 
                    draggable={ev.source === 'pro'}
                    onDragStart={(e) => handleDragStart(e, ev)}
                    onDragEnd={handleDragEnd}
                    style={{ "--cat-color": CATEGORIES[ev.category]?.color }}
                    onClick={() => { if(ev.source === 'pro') { setEditingEvent(ev); setShowModal(true); } }}
                    title={ev.source === 'pro' ? "Puedes arrastrar este evento a otro día" : "Evento de sistema (No movible)"}
                  >
                    <span className="ev-time">{ev.startTime}</span>
                    <span className="ev-title">{ev.title}</span>
                    {ev.completed && <CheckCircle size={12} color="#10b981" />}
                  </div>
                ))}
                {dayEvents.length === 0 && <p className="no-events">Sin planes</p>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    
    const days = [];
    // Días mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month - 1, prevMonthLastDay - i), current: false });
    }
    // Días mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), current: true });
    }
    // Días mes siguiente (para rellenar grid)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), current: false });
    }

    return (
      <div className="month-grid">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => <div key={d} className="dow">{d}</div>)}
        {days.map((d, i) => {
          const dayKey = formatLocalDate(d.date);
          const eventsForDay = d.current ? allEvents.filter(e => e.date === dayKey) : [];
          const isToday = d.current && formatLocalDate(new Date()) === dayKey;

          return (
            <div 
              key={i} 
              className={`month-day ${d.current ? '' : 'other'} ${isToday ? 'today' : ''}`}
              onClick={() => {
                if (d.current) {
                  setCurrentDate(new Date(d.date));
                  setView("day");
                }
              }}
            >
              <span className="num">{d.date.getDate()}</span>
              <div className="day-dots">
                {eventsForDay.slice(0, 3).map(e => (
                  <div key={e.id} className="dot" style={{ backgroundColor: CATEGORIES[e.category]?.color }} title={e.title} />
                ))}
                {eventsForDay.length > 3 && <div className="plus-dot">+{eventsForDay.length - 3}</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderYearView = () => {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return (
      <div className="year-grid">
        {monthNames.map((name, idx) => {
          const monthPrefix = `${currentDate.getFullYear()}-${String(idx + 1).padStart(2, '0')}`;
          const mEvents = allEvents.filter(e => e.date.startsWith(monthPrefix));
          const daughterDays = mEvents.filter(e => e.category === "Hija").length;
          const urgent = mEvents.filter(e => e.category === "Urgente" || e.important).length;

          return (
            <button key={name} className="month-card" onClick={() => { setCurrentDate(new Date(currentDate.getFullYear(), idx, 1)); setView("month"); }}>
              <h3>{name}</h3>
              <div className="month-stats">
                <div className="stat"><Baby size={12} /> {daughterDays} d.</div>
                <div className="stat"><AlertCircle size={12} /> {urgent} urg.</div>
                <div className="stat"><CalendarIcon size={12} /> {mEvents.length} ev.</div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="page calendar-pro page-transition">
      <div className="calendar-header">
        <div className="nav-controls">
          <button className="nav-btn" onClick={() => navigate(-1)}><ChevronLeft /></button>
          <div className="current-label" onClick={() => setCurrentDate(new Date())}>
            {view === 'month' && currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            {view === 'year' && currentDate.getFullYear()}
            {view === 'day' && currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
            {view === 'week' && `Semana ${currentDate.getDate()} - ${getWeekDays(currentDate)[6].toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`}
          </div>
          <button className="nav-btn" onClick={() => navigate(1)}><ChevronRight /></button>
        </div>

        <div className="view-selector">
          {['day', 'week', 'month', 'year'].map(v => (
            <button key={v} className={view === v ? 'active' : ''} onClick={() => setView(v)}>
              {v === 'day' ? 'Día' : v === 'week' ? 'Sem' : v === 'month' ? 'Mes' : 'Año'}
            </button>
          ))}
        </div>
      </div>

      <div className="ai-optimize-btn" onClick={() => setShowOptimizer(true)}>
        <Sparkles size={18} />
        <span>Optimizar mi semana con IA</span>
      </div>

      {/* ATAJOS DE CREACIÓN RÁPIDA (RESTAURADOS) */}
      <div className="quick-add-shortcuts">
        <button className="s-btn hija" onClick={() => handleAddEvent({ category: 'Hija', title: 'Día con mi hija' })}>
          <Baby size={16} /> +Hija
        </button>
        <button className="s-btn pago" onClick={() => handleAddEvent({ category: 'Economía', title: 'Pago ' })}>
          <Wallet size={16} /> +Pago
        </button>
        <button className="s-btn urg" onClick={() => handleAddEvent({ category: 'Urgente', priority: 'Alta', important: true })}>
          <AlertTriangle size={16} /> +Urg
        </button>
      </div>

      <div className="quick-category-filters">
        <button className={filterCat === "Todas" ? "active" : ""} onClick={() => setFilterCat("Todas")}>Todos</button>
        {Object.keys(CATEGORIES).slice(0, 6).map(cat => (
          <button 
            key={cat} 
            className={filterCat === cat ? "active" : ""} 
            onClick={() => setFilterCat(cat)}
            style={{ "--active-color": CATEGORIES[cat].color }}
          >
            {cat}
          </button>
        ))}
      </div>

      <main className="calendar-content">
        {view === 'day' && renderDayView()}
        {view === 'week' && renderWeekView()}
        {view === 'month' && renderMonthView()}
        {view === 'year' && renderYearView()}
      </main>

      <button className="floating-add-main" onClick={() => handleAddEvent()}>
        <Plus size={24} />
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="event-modal">
            <div className="modal-header">
              <h3>{editingEvent.id ? 'Editar Evento' : 'Nuevo Evento'}</h3>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            <form onSubmit={saveEvent}>
              <input 
                className="main-input"
                type="text" 
                placeholder="Título del evento" 
                value={editingEvent.title} 
                onChange={e => setEditingEvent({...editingEvent, title: e.target.value})}
                required
              />
              
              <div className="form-row">
                <div className="field mobile-move-field">
                  <label>Mover de fecha</label>
                  <div className="move-date-wrapper">
                    <button type="button" className="move-btn" onClick={() => {
                      const d = new Date(editingEvent.date); d.setDate(d.getDate() - 1);
                      setEditingEvent({...editingEvent, date: formatLocalDate(d)});
                    }}><ArrowLeft size={14}/></button>
                    
                    <input type="date" className="date-main-input" value={editingEvent.date} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} />
                    
                    <button type="button" className="move-btn" onClick={() => {
                      const d = new Date(editingEvent.date); d.setDate(d.getDate() + 1);
                      setEditingEvent({...editingEvent, date: formatLocalDate(d)});
                    }}><ArrowRight size={14}/></button>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label>Hora</label>
                  <div className="time-row">
                    <input type="time" value={editingEvent.startTime} onChange={e => setEditingEvent({...editingEvent, startTime: e.target.value})} />
                    <input type="time" value={editingEvent.endTime} onChange={e => setEditingEvent({...editingEvent, endTime: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label>Categoría</label>
                  <select value={editingEvent.category} onChange={e => setEditingEvent({...editingEvent, category: e.target.value})}>
                    {Object.keys(CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Prioridad</label>
                  <select value={editingEvent.priority} onChange={e => setEditingEvent({...editingEvent, priority: e.target.value})}>
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
              </div>

              <div className="check-row">
                <label className="checkbox">
                  <input type="checkbox" checked={editingEvent.important} onChange={e => setEditingEvent({...editingEvent, important: e.target.checked})} />
                  <span>⭐ Importante</span>
                </label>
                <label className="checkbox">
                  <input type="checkbox" checked={editingEvent.completed} onChange={e => setEditingEvent({...editingEvent, completed: e.target.checked})} />
                  <span>✅ Completado</span>
                </label>
              </div>

              <textarea 
                placeholder="Notas adicionales..." 
                value={editingEvent.notes} 
                onChange={e => setEditingEvent({...editingEvent, notes: e.target.value})}
              />

              <div className="modal-actions">
                <button type="button" className="del-btn" onClick={() => deleteEvent(editingEvent.id)}>Eliminar</button>
                <button type="submit" className="save-btn">Guardar Evento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .calendar-pro { padding: 15px; padding-bottom: 90px; background: #f8fafc; }
        .calendar-header { display: flex; flex-direction: column; gap: 15px; margin-bottom: 15px; }
        .nav-controls { display: flex; align-items: center; justify-content: space-between; background: white; padding: 12px; border-radius: 18px; border: 1px solid var(--border); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .current-label { font-weight: 800; font-size: 1rem; color: #1e293b; }
        .nav-btn { background: #f1f5f9; border: none; width: 35px; height: 35px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        
        .view-selector { display: flex; background: #e2e8f0; padding: 4px; border-radius: 12px; }
        .view-selector button { flex: 1; padding: 8px; border: none; background: transparent; font-size: 0.75em; font-weight: bold; border-radius: 9px; color: #64748b; }
        .view-selector button.active { background: white; color: #3b82f6; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

        .ai-optimize-btn { background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: white; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 15px; border-radius: 16px; margin-bottom: 20px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 15px -3px rgba(139, 92, 246, 0.4); transition: transform 0.2s; }
        .ai-optimize-btn:active { transform: scale(0.98); }

        .quick-add-shortcuts { display: flex; gap: 10px; margin-bottom: 15px; }
        .s-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 12px 5px; border-radius: 12px; border: none; color: white; font-size: 0.75em; font-weight: 800; }
        .s-btn.hija { background: #10b981; }
        .s-btn.pago { background: #f59e0b; }
        .s-btn.urg { background: #ef4444; }

        .quick-category-filters { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 15px; }
        .quick-category-filters button { padding: 8px 16px; background: white; border: 1px solid var(--border); border-radius: 12px; font-size: 0.75em; font-weight: bold; white-space: nowrap; color: #64748b; transition: all 0.2s; }
        .quick-category-filters button.active { background: var(--active-color, #3b82f6); color: white; border-color: transparent; }

        .calendar-content { min-height: 50vh; }

        /* WEEK VIEW */
        .week-scroll-view { display: flex; flex-direction: column; gap: 15px; }
        .week-day-card { background: white; border-radius: 20px; padding: 15px; border: 1px solid var(--border); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: border-color 0.2s, background-color 0.2s; }
        .week-day-card.today { border: 2px solid #3b82f6; }
        .week-day-card.drag-over { border: 2px dashed #8b5cf6; background: #faf5ff; }
        
        .day-info { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .day-name { display: flex; flex-direction: column; line-height: 1.1; }
        .day-name span { font-size: 0.7em; text-transform: uppercase; font-weight: 800; opacity: 0.5; }
        .day-name strong { font-size: 1.4rem; font-weight: 900; color: #1e293b; }
        .day-meta { display: flex; align-items: center; gap: 8px; font-size: 0.75em; font-weight: bold; color: #64748b; }
        .add-day-btn { background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

        .day-events-list { display: flex; flex-direction: column; gap: 6px; min-height: 20px; }
        .mini-event-row { display: flex; align-items: center; gap: 10px; padding: 10px; background: #f8fafc; border-radius: 10px; border-left: 4px solid var(--cat-color); cursor: grab; transition: transform 0.1s; }
        .mini-event-row:active { cursor: grabbing; transform: scale(0.98); }
        .ev-time { font-size: 0.7em; font-weight: 800; color: #3b82f6; width: 45px; }
        .ev-title { font-size: 0.85em; font-weight: 600; flex-grow: 1; }
        .no-events { font-size: 0.75em; font-style: italic; opacity: 0.4; }

        /* MONTH VIEW */
        .month-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; background: #e2e8f0; border: 1px solid #e2e8f0; border-radius: 15px; overflow: hidden; }
        .dow { background: #f8fafc; padding: 10px 0; text-align: center; font-size: 0.6em; font-weight: 900; text-transform: uppercase; color: #94a3b8; }
        .month-day { background: white; min-height: 80px; padding: 8px; display: flex; flex-direction: column; gap: 4px; }
        .month-day.other { background: #f1f5f9; opacity: 0.4; }
        .month-day.today { background: #eff6ff; }
        .month-day.today .num { background: #3b82f6; color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .month-day .num { font-size: 0.8em; font-weight: 800; color: #64748b; }

        .floating-add-main { position: fixed; bottom: 100px; right: 20px; width: 60px; height: 60px; background: #3b82f6; color: white; border: none; border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.5); z-index: 100; }

        /* MODAL */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); display: flex; align-items: flex-end; z-index: 1000; }
        .event-modal { background: white; width: 100%; padding: 25px; border-radius: 30px 30px 0 0; box-shadow: 0 -20px 25px -5px rgba(0,0,0,0.1); }
        .main-input { width: 100%; font-size: 1.5rem; font-weight: 800; border: none; border-bottom: 2px solid #f1f5f9; padding: 10px 0; margin-bottom: 20px; outline: none; }
        
        .mobile-move-field { background: #faf5ff; padding: 10px; border-radius: 15px; border: 1px solid #e9d5ff; grid-column: span 2; }
        .mobile-move-field label { color: #8b5cf6 !important; }
        .move-date-wrapper { display: flex; align-items: center; gap: 10px; }
        .move-btn { background: #8b5cf6; color: white; border: none; border-radius: 10px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        .date-main-input { flex-grow: 1; border-color: #8b5cf6 !important; font-weight: 800 !important; color: #4c1d95 !important; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .field label { display: block; font-size: 0.7em; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin-bottom: 5px; }
        .time-row { display: flex; gap: 5px; }
        input, select, textarea { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 0.9em; font-weight: 600; }
        .check-row { display: flex; gap: 20px; margin: 20px 0; }
        .checkbox { display: flex; align-items: center; gap: 8px; font-size: 0.85em; font-weight: bold; cursor: pointer; }
        .modal-actions { display: flex; gap: 10px; margin-top: 20px; }
        .save-btn { flex-grow: 1; background: #3b82f6; color: white; border: none; padding: 16px; border-radius: 15px; font-weight: 800; }
        .del-btn { background: #fee2e2; color: #ef4444; border: none; padding: 16px; border-radius: 15px; font-weight: 800; }
      `}</style>

      {showOptimizer && (
        <WeekOptimizerModal 
          data={data}
          onClose={() => setShowOptimizer(false)}
          onApplySuggestion={applyAISuggestion}
          onApplyAll={applyAllAISuggestions}
        />
      )}
    </div>
  );
}