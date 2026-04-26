import { initialData } from "./data";

const KEY = "nueva_etapa_os_data";

export function loadData() {
  const saved = localStorage.getItem(KEY);
  if (!saved) return initialData;

  const parsed = JSON.parse(saved);
  
  // Fusión profunda simple: nos aseguramos de que todas las llaves de initialData existan
  return {
    ...initialData,
    ...parsed,
    // Las sub-estructuras nuevas también deben fusionarse si el usuario ya tenía el objeto pero incompleto
    custody: { ...initialData.custody, ...(parsed.custody || {}) },
    budgetPro: { ...initialData.budgetPro, ...(parsed.budgetPro || {}) },
    emergencyMode: { ...initialData.emergencyMode, ...(parsed.emergencyMode || {}) },
    weeklyMenuPro: { ...initialData.weeklyMenuPro, ...(parsed.weeklyMenuPro || {}) },
    calendarEvents: parsed.calendarEvents || [],
    income: parsed.income || initialData.income,
    daughterSystem: {
      ...initialData.daughterSystem,
      custodyCalendar: parsed.custody?.calendar || parsed.daughterSystem?.custodyCalendar || [],
      expenses: parsed.custody?.daughterExpenses || parsed.daughterSystem?.expenses || [],
      plans: parsed.daughterSystem?.plans || initialData.daughterSystem.plans,
      inventory: parsed.daughterSystem?.inventory || initialData.daughterSystem.inventory
    },
    needs: (parsed.needs || initialData.needs).map(n => ({
      ...initialData.needs[0],
      ...n,
      cost: n.cost || 0,
      category: n.category || "Hogar",
      status: n.status || (n.resolved ? "Resuelto" : "Pendiente")
    })),
    goals: (parsed.goals || initialData.goals).map(g => ({
      ...initialData.goals[0],
      ...g,
      reason: g.reason || "Mejora personal",
      miniActions: g.miniActions || [],
      obstacles: g.obstacles || ""
    })),
    shoppingList: parsed.shoppingList || initialData.shoppingList,
    weeklyMenu: parsed.weeklyMenu || initialData.weeklyMenu,
    tasks: (parsed.tasks || initialData.tasks).map(t => ({
      ...initialData.tasks[0], // Valores por defecto
      ...t,
      subtasks: t.subtasks || [],
      status: t.status || (t.done ? "hecho" : "pendiente"),
      duration: t.duration || "30"
    }))
  };
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}