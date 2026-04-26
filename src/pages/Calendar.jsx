import { useState, useMemo } from "react";
import Card from "../components/Card";
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
  X
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
  }, [data.calendarEvents, data.custody.calendar, filterCat, filterStatus]);

  // Utilidades de fecha seguras (evitan desfases UTC)
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
      id: crypto.randomUUID(),
      title: "",
      description: "",
      date: formatLocalDate(currentDate),
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
          // Filtrar eventos por mes y año usando comparación de strings para seguridad
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
            {view === 'week' && "Semana actual"}
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

      <div className="quick-actions">
        <button className="q-btn hija" onClick={() => handleAddEvent({ category: 'Hija', title: 'Día con mi hija' })}>
          <Baby size={16} /> +Hija
        </button>
        <button className="q-btn pago" onClick={() => handleAddEvent({ category: 'Economía', title: 'Pago ' })}>
          <Wallet size={16} /> +Pago
        </button>
        <button className="q-btn cita" onClick={() => handleAddEvent({ category: 'Personal', title: 'Cita ' })}>
          <Clock size={16} /> +Cita
        </button>
        <button className="q-btn urg" onClick={() => handleAddEvent({ category: 'Urgente', priority: 'Alta', important: true })}>
          <AlertTriangle size={16} /> +Urgente
        </button>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <Filter size={14} />
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="Todas">Todas las categorías</option>
            {Object.keys(CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="Todos">Todos los estados</option>
            <option value="Pendientes">Pendientes</option>
            <option value="Completados">Completados</option>
            <option value="Importantes">Importantes</option>
          </select>
        </div>
      </div>

      <main className="calendar-content">
        {view === 'day' && renderDayView()}
        {view === 'month' && renderMonthView()}
        {view === 'year' && renderYearView()}
        {view === 'week' && <p className="empty">Vista semanal en desarrollo (Usa Vista Mes para móvil).</p>}
      </main>

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
                <div className="field">
                  <label>Fecha</label>
                  <input type="date" value={editingEvent.date} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} />
                </div>
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
        .calendar-pro { padding: 10px; padding-bottom: 80px; }
        .calendar-header {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
        }
        .nav-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--card);
          padding: 10px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }
        .current-label { font-weight: bold; text-transform: capitalize; font-size: 1.1rem; }
        .view-selector {
          display: flex;
          background: var(--bg);
          padding: 4px;
          border-radius: 10px;
          border: 1px solid var(--border);
        }
        .view-selector button {
          flex: 1;
          padding: 8px;
          border: none;
          background: transparent;
          font-size: 0.85em;
          border-radius: 8px;
          color: var(--text);
        }
        .view-selector button.active { background: var(--primary); color: white; }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }
        @media (min-width: 600px) { .quick-actions { grid-template-columns: repeat(4, 1fr); } }
        .q-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border-radius: 12px;
          border: none;
          font-size: 0.85em;
          font-weight: bold;
          color: white;
        }
        .q-btn.hija { background: #10b981; }
        .q-btn.pago { background: #f59e0b; }
        .q-btn.cita { background: #3b82f6; }
        .q-btn.urg { background: #ef4444; }

        .filters-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          overflow-x: auto;
          padding-bottom: 5px;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 5px;
          background: var(--card);
          padding: 5px 10px;
          border-radius: 8px;
          border: 1px solid var(--border);
          white-space: nowrap;
        }
        .filter-group select { border: none; background: transparent; font-size: 0.8em; }

        /* DAY VIEW */
        .event-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-left: 5px solid gray;
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .event-card.completed { opacity: 0.5; }
        .event-card .time { font-size: 0.8em; font-weight: bold; width: 90px; opacity: 0.7; }
        .event-card .details { flex-grow: 1; }
        .title-row { display: flex; align-items: center; gap: 5px; margin-bottom: 4px; }
        .cat-label { display: flex; align-items: center; gap: 5px; font-size: 0.75em; opacity: 0.6; }

        /* MONTH VIEW */
        .month-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 5px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }
        .dow { background: var(--bg); padding: 10px 0; text-align: center; font-size: 0.7em; font-weight: bold; opacity: 0.5; }
        .month-day {
          background: var(--card);
          min-height: 70px;
          padding: 5px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .month-day.other { opacity: 0.3; }
        .month-day.today { background: #eff6ff; }
        .month-day.today .num { background: var(--primary); color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .month-day .num { font-size: 0.8em; font-weight: bold; }
        .day-dots { display: flex; flex-wrap: wrap; gap: 2px; }
        .dot { width: 6px; height: 6px; border-radius: 50%; }
        .plus-dot { font-size: 0.6em; opacity: 0.5; }

        /* YEAR VIEW */
        .year-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; }
        .month-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 15px;
          text-align: left;
          transition: transform 0.2s;
        }
        .month-card:hover { transform: scale(1.02); }
        .month-card h3 { margin: 0 0 10px 0; font-size: 1rem; color: var(--primary); }
        .month-stats { display: flex; flex-direction: column; gap: 4px; }
        .stat { font-size: 0.75em; opacity: 0.7; display: flex; align-items: center; gap: 5px; }

        /* MODAL */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 1000;
        }
        @media (min-width: 600px) { .modal-overlay { align-items: center; } }
        .event-modal {
          background: var(--card);
          width: 100%;
          max-width: 500px;
          padding: 25px;
          border-radius: 24px 24px 0 0;
          box-shadow: 0 -10px 25px rgba(0,0,0,0.1);
        }
        @media (min-width: 600px) { .event-modal { border-radius: 24px; } }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .main-input { width: 100%; font-size: 1.4rem; font-weight: bold; border: none; border-bottom: 2px solid var(--border); padding: 10px 0; margin-bottom: 20px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .field label { display: block; font-size: 0.75em; font-weight: bold; opacity: 0.6; margin-bottom: 5px; }
        .time-row { display: flex; gap: 5px; }
        .time-row input { width: 100%; }
        .check-row { display: flex; gap: 20px; margin-bottom: 20px; }
        .checkbox { display: flex; align-items: center; gap: 8px; font-size: 0.9em; cursor: pointer; }
        textarea { width: 100%; height: 80px; margin-bottom: 20px; border-radius: 12px; }
        .modal-actions { display: flex; gap: 10px; }
        .save-btn { flex-grow: 1; background: var(--primary); color: white; border: none; padding: 15px; border-radius: 12px; font-weight: bold; }
        .del-btn { background: #fee2e2; color: #ef4444; border: none; padding: 15px; border-radius: 12px; font-weight: bold; }
      `}</style>
    </div>
  );
}