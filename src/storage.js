import { initialData } from "./data";

const KEY = "nueva_etapa_os_data";

// Función de validación para asegurar la integridad de la estructura
function validateData(data) {
  if (!data || typeof data !== "object") return initialData;
  
  const requiredKeys = ["tasks", "goals", "needs", "calendarEvents", "budgetPro"];
  const validated = { ...initialData, ...data };
  
  // Asegurar que las listas críticas sean arrays
  if (!Array.isArray(validated.tasks)) validated.tasks = initialData.tasks;
  if (!Array.isArray(validated.goals)) validated.goals = initialData.goals;
  if (!Array.isArray(validated.needs)) validated.needs = initialData.needs;
  if (!Array.isArray(validated.calendarEvents)) validated.calendarEvents = initialData.calendarEvents;
  
  return validated;
}

export function loadData() {
  try {
    const saved = localStorage.getItem(KEY);
    if (!saved) return initialData;

    const parsed = JSON.parse(saved);
    const validated = validateData(parsed);
    
    // Fusión profunda y saneamiento de datos
    return {
      ...initialData,
      ...validated,
      calendarEvents: validated.calendarEvents || [],
      income: validated.income || initialData.income,
      expenses: validated.expenses || [],
      daughterSystem: {
        ...initialData.daughterSystem,
        ...validated.daughterSystem,
        custodyCalendar: validated.daughterSystem?.custodyCalendar || validated.custody?.calendar || [],
        expenses: validated.daughterSystem?.expenses || validated.custody?.daughterExpenses || [],
      },
      needs: (validated.needs || []).map(n => ({
        ...initialData.needs?.[0],
        ...n,
        cost: parseFloat(n.cost) || 0,
        category: n.category || "Hogar",
        status: n.status || (n.resolved ? "Resuelto" : "Pendiente")
      })),
      goals: (validated.goals || []).map(g => ({
        ...initialData.goals?.[0],
        ...g,
        miniActions: Array.isArray(g.miniActions) ? g.miniActions : []
      })),
      tasks: (validated.tasks || []).map(t => ({
        ...initialData.tasks?.[0],
        ...t,
        subtasks: Array.isArray(t.subtasks) ? t.subtasks : [],
        status: t.status || (t.done ? "hecho" : "pendiente")
      })),
      budgetPro: validated.budgetPro || initialData.budgetPro,
      weeklyMenuPro: validated.weeklyMenuPro || initialData.weeklyMenuPro,
      shoppingListPro: validated.shoppingListPro || initialData.shoppingListPro
    };
  } catch (error) {
    console.error("Error cargando datos:", error);
    return initialData; // Fallback seguro en caso de JSON corrupto
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error guardando datos:", error);
  }
}

// Exportar datos a JSON descargable
export function exportData() {
  const data = loadData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `backup_nueva_etapa_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Importar datos desde un archivo JSON
export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const validated = validateData(data);
        saveData(validated);
        resolve(validated);
      } catch (err) {
        reject("Archivo JSON corrupto o inválido");
      }
    };
    reader.onerror = () => reject("Error leyendo el archivo");
    reader.readAsText(file);
  });
}