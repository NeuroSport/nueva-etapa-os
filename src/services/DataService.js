import { initialData } from "../data";

const KEY = "nueva_etapa_os_data";

/**
 * DataService: Capa de abstracción para persistencia de datos.
 * Actualmente usa LocalStorageAdapter, pero la estructura está preparada
 * para integrar SQLiteAdapter (Capacitor) en el futuro.
 */
class DataService {
  constructor() {
    this.adapter = new LocalStorageAdapter();
  }

  loadData() {
    return this.adapter.load();
  }

  saveData(data) {
    this.adapter.save(data);
  }

  resetData() {
    const fresh = JSON.parse(JSON.stringify(initialData));
    this.adapter.save(fresh);
    return fresh;
  }

  getDefaultData() {
    return JSON.parse(JSON.stringify(initialData));
  }

  sanitizeData(data) {
    return this.adapter.validateAndSanitize(data);
  }

  exportBackup() {
    const data = this.loadData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_nueva_etapa_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importBackup(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          const validated = this.sanitizeData(parsed);
          this.saveData(validated);
          resolve(validated);
        } catch (err) {
          reject("Archivo JSON corrupto o inválido");
        }
      };
      reader.onerror = () => reject("Error leyendo el archivo");
      reader.readAsText(file);
    });
  }
}

// ============================================================================
// ADAPTADORES DE ALMACENAMIENTO
// ============================================================================

class LocalStorageAdapter {
  load() {
    try {
      const saved = localStorage.getItem(KEY);
      if (!saved) {
        return JSON.parse(JSON.stringify(initialData));
      }

      const parsed = JSON.parse(saved);
      return this.validateAndSanitize(parsed);
    } catch (error) {
      console.error("DataService [CRÍTICO]: Error cargando datos desde localStorage.", error);
      
      // Crear backup de emergencia en consola
      const rawData = localStorage.getItem(KEY);
      console.warn("DataService: Copia del JSON corrupto (Cópielo para evitar pérdida total):", rawData);
      
      if (window.notify) {
        window.notify("Error crítico cargando datos. Revisa la consola.", "error");
      }
      
      return JSON.parse(JSON.stringify(initialData)); // Fallback seguro
    }
  }

  save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (error) {
      console.error("DataService: Error guardando datos en localStorage:", error);
      
      try {
        // Backup de emergencia
        localStorage.setItem(KEY + "_backup", JSON.stringify(data));
      } catch (backupError) {
        console.error("DataService: Falla incluso el backup de emergencia.", backupError);
      }
      
      if (window.notify) {
        window.notify("Espacio lleno. Se ha creado backup de emergencia.", "error");
      }
    }
  }

  validateAndSanitize(data) {
    if (!data || typeof data !== "object") {
      return JSON.parse(JSON.stringify(initialData));
    }
    
    const validated = { 
      ...JSON.parse(JSON.stringify(initialData)), 
      ...data 
    };
    
    // Asegurar arrays críticos
    if (!Array.isArray(validated.tasks)) validated.tasks = initialData.tasks;
    if (!Array.isArray(validated.goals)) validated.goals = initialData.goals;
    if (!Array.isArray(validated.needs)) validated.needs = initialData.needs;
    if (!Array.isArray(validated.calendarEvents)) validated.calendarEvents = initialData.calendarEvents;
    
    // Fusión profunda y saneamiento de datos (lógica heredada de storage.js)
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
  }
}

// TODO: Fase 3 - Integración SQLite
// class SQLiteAdapter {
//   load() { /* ... */ }
//   save(data) { /* ... */ }
//   validateAndSanitize(data) { /* ... */ }
// }

export const dataService = new DataService();
