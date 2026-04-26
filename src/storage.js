import { initialData } from "./data";

const KEY = "nueva_etapa_os_data";

export function loadData() {
  const saved = localStorage.getItem(KEY);
  if (!saved) return initialData;

  const parsed = JSON.parse(saved);
  
  // Fusión profunda y saneamiento de datos
  return {
    ...initialData,
    ...parsed,
    calendarEvents: parsed.calendarEvents || [],
    income: parsed.income || initialData.income,
    expenses: parsed.expenses || [],
    daughterSystem: {
      ...initialData.daughterSystem,
      custodyCalendar: parsed.daughterSystem?.custodyCalendar || parsed.custody?.calendar || [],
      expenses: parsed.daughterSystem?.expenses || parsed.custody?.daughterExpenses || [],
      plans: parsed.daughterSystem?.plans || initialData.daughterSystem.plans,
      inventory: parsed.daughterSystem?.inventory || initialData.daughterSystem.inventory,
      responsibilities: parsed.daughterSystem?.responsibilities || initialData.daughterSystem.responsibilities
    },
    needs: (parsed.needs || initialData.needs || []).map(n => ({
      ...initialData.needs?.[0],
      ...n,
      cost: n.cost || 0,
      category: n.category || "Hogar",
      status: n.status || (n.resolved ? "Resuelto" : "Pendiente")
    })),
    goals: (parsed.goals || initialData.goals || []).map(g => ({
      ...initialData.goals?.[0],
      ...g,
      reason: g.reason || "Mejora personal",
      miniActions: g.miniActions || [],
      obstacles: g.obstacles || ""
    })),
    shoppingList: parsed.shoppingList || [],
    weeklyMenu: parsed.weeklyMenu || initialData.weeklyMenu,
    tasks: (parsed.tasks || initialData.tasks || []).map(t => ({
      ...initialData.tasks?.[0],
      ...t,
      subtasks: t.subtasks || [],
      status: t.status || (t.done ? "hecho" : "pendiente"),
      duration: t.duration || "30"
    })),
    alicantePlans: parsed.alicantePlans || initialData.alicantePlans
  };
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}