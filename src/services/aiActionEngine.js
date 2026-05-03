import { generateId } from '../utils';

/**
 * AIActionEngine
 * Centraliza la lógica de ejecución de acciones sugeridas por la IA
 * o por botones inteligentes de la interfaz.
 */
export const aiActionEngine = {
  
  /**
   * Procesa una respuesta de la IA que contiene acciones y mensaje
   */
  parseResponse(response) {
    try {
      const match = response.match(/\{[\s\S]*\}/);
      if (!match) return { message: response, actions: [] };
      
      const parsed = JSON.parse(match[0]);
      return {
        message: parsed.message || "He preparado estas acciones para ti:",
        actions: parsed.actions || []
      };
    } catch (e) {
      console.error("Error parseando acciones de IA:", e);
      return { message: response, actions: [] };
    }
  },

  /**
   * Ejecuta una acción específica sobre el estado global (data)
   */
  applyAction(action, data, setData) {
    const { type, payload } = action;
    const newData = { ...data };
    let success = false;

    switch (type) {
      case 'create_calendar_event':
        const newEvent = {
          id: generateId(),
          title: payload.title || "Nuevo Evento",
          date: payload.date || this.getTodayStr(),
          startTime: payload.startTime || "10:00",
          endTime: payload.endTime || "11:00",
          category: payload.category || "General",
          notes: payload.notes || payload.description || "",
          important: payload.important || false,
          completed: false
        };
        newData.calendarEvents = [...(newData.calendarEvents || []), newEvent];
        success = true;
        break;

      case 'create_task':
        const newTask = {
          id: generateId(),
          title: payload.title || "Nueva Tarea",
          description: payload.description || payload.notes || "",
          status: 'pendiente',
          priority: payload.priority || 'media',
          plannedDate: payload.dueDate || payload.date || this.getTodayStr(),
          category: payload.category || 'General'
        };
        newData.tasks = [newTask, ...(newData.tasks || [])];
        success = true;
        break;

      case 'create_expense':
        const newExpense = {
          id: generateId(),
          title: payload.title || "Gasto nuevo",
          amount: parseFloat(payload.amount) || 0,
          date: payload.date || this.getTodayStr(),
          category: payload.category || "Otros",
          paid: payload.paid || false,
          description: payload.description || ""
        };
        newData.expenses = [newExpense, ...(newData.expenses || [])];
        success = true;
        break;

      case 'create_need':
        const newNeed = {
          id: generateId(),
          title: payload.title || "Nueva Necesidad",
          description: payload.description || "",
          cost: payload.cost || payload.estimatedCost || 0,
          priority: payload.priority || "Media",
          deadline: payload.deadline || this.getTodayStr(),
          category: payload.category || "Hogar",
          resolved: false
        };
        newData.needs = [newNeed, ...(newData.needs || [])];
        success = true;
        break;

      case 'create_goal':
        const newGoal = {
          id: generateId(),
          title: payload.title || "Nuevo Objetivo",
          reason: payload.reason || payload.target || "Motivación por definir",
          category: payload.category || "Personal",
          startDate: this.getTodayStr(),
          targetDate: payload.deadline || payload.targetDate || this.getRelativeDate(30),
          progress: 0,
          status: "En curso",
          miniActions: [],
          obstacles: ""
        };
        newData.goals = [newGoal, ...(newData.goals || [])];
        success = true;
        break;

      case 'create_daughter_plan':
        const newDaughterPlan = {
          id: generateId(),
          title: payload.title || "Plan con hija",
          description: payload.description || "",
          cost: payload.cost || "0€",
          location: payload.location || "Alicante",
          category: payload.category || "Ocio",
          status: "Idea",
          date: payload.date || this.getTodayStr()
        };
        if (!newData.daughterSystem) newData.daughterSystem = { plans: { ideas: [] }, custodyCalendar: [], responsibilities: [] };
        if (!newData.daughterSystem.plans) newData.daughterSystem.plans = { ideas: [] };
        
        newData.daughterSystem.plans.ideas = [newDaughterPlan, ...(newData.daughterSystem.plans.ideas || [])];
        success = true;
        break;

      case 'save_alicante_plan':
        const saved = newData.savedPlans || [];
        if (!saved.find(p => p.title === payload.title)) {
          newData.savedPlans = [...saved, { ...payload, id: generateId(), favorite: true }];
        }
        success = true;
        break;

      default:
        console.warn("Acción no reconocida:", type);
    }

    if (success) {
      setData(newData);
    }
    return success;
  },

  /**
   * Utilidad para obtener fecha de hoy en YYYY-MM-DD sin new Date()
   */
  getTodayStr() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Inferencia de fechas relativas (Básico para el prompt)
   */
  getRelativeDate(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
};
