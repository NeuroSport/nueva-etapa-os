import { generateId } from "./utils";

export const initialData = {
  tasks: [
    {
      id: generateId(),
      title: "Revisar planificación semanal",
      description: "Analizar los objetivos de la semana y ajustar prioridades.",
      category: "Personal",
      priority: "Alta",
      deadline: new Date().toISOString().split('T')[0],
      plannedDate: new Date().toISOString().split('T')[0],
      duration: "30", // minutos
      status: "pendiente",
      recurrence: "Semanal",
      notes: "",
      subtasks: []
    }
  ],
  income: [
    {
      id: generateId(),
      title: "Nómina",
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      type: "Nómina",
      recurring: true,
      notes: ""
    }
  ],
  expenses: [
    {
      id: generateId(),
      title: "Alquiler / Hipoteca",
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      payDate: new Date().toISOString().split('T')[0],
      category: "Casa",
      type: "Fijo",
      method: "Transferencia",
      paid: false,
      recurring: true,
      priority: "Alta",
      description: ""
    }
  ],
  needs: [
    {
      id: generateId(),
      title: "Renovar calzado hija",
      description: "Zapatillas de deporte talla 28",
      cost: 40,
      priority: "Alta",
      deadline: new Date().toISOString().split('T')[0],
      category: "Hija",
      status: "Pendiente",
      resolved: false
    }
  ],
  goals: [
    {
      id: generateId(),
      title: "Mejorar salud física",
      reason: "Tener más energía para jugar con mi hija y longevidad.",
      category: "Salud",
      startDate: new Date().toISOString().split('T')[0],
      targetDate: new Date().toISOString().split('T')[0],
      progress: 0,
      status: "En curso",
      miniActions: [
        { id: 1, title: "Caminar 30 min", done: false },
        { id: 2, title: "Beber 2L agua", done: false }
      ],
      obstacles: "Falta de tiempo por trabajo."
    }
  ],
  shoppingList: [
    {
      id: generateId(),
      product: "Leche entera",
      quantity: "6 bricks",
      price: 6.50,
      category: "Lácteos",
      store: "Mercadona",
      bought: false,
      frequent: true
    }
  ],
  weeklyMenu: {
    Lunes: { breakfast: "", lunch: "", dinner: "", daughterMode: false, cost: 0 },
    Martes: { breakfast: "", lunch: "", dinner: "", daughterMode: false, cost: 0 },
    Miércoles: { breakfast: "", lunch: "", dinner: "", daughterMode: false, cost: 0 },
    Jueves: { breakfast: "", lunch: "", dinner: "", daughterMode: false, cost: 0 },
    Viernes: { breakfast: "", lunch: "", dinner: "", daughterMode: false, cost: 0 },
    Sábado: { breakfast: "", lunch: "", dinner: "", daughterMode: false, cost: 0 },
    Domingo: { breakfast: "", lunch: "", dinner: "", daughterMode: false, cost: 0 },
  },
  diary: [],
  calendarEvents: [],
  
  // SISTEMA INTEGRAL: VIDA CON MI HIJA
  daughterSystem: {
    custodyCalendar: [], // { date, type: 'conmigo' | 'escuela' | 'medico' | 'otro', title }
    plans: {
      ideas: [], // { id, title, description, category, cost }
      history: [] // { id, title, date, rating, photoNotes }
    },
    inventory: {
      clothes: [], // { id, item, size, status: 'ok' | 'pequeño' | 'falta' }
      school: []
    },
    expenses: [], // { id, title, amount, date, category }
    responsibilities: [
      { id: 1, title: "Revisar mochila escolar", done: false },
      { id: 2, title: "Preparar ropa siguiente día", done: false },
      { id: 3, title: "Corte de uñas / Higiene", done: false }
    ]
  },
  
  alicantePlans: [
    {
      id: generateId(),
      name: "Parque La Marjal",
      zone: "Playa San Juan",
      type: "Parque / Naturaleza",
      priceCategory: "Gratis",
      priceValue: 0,
      environment: "Exterior",
      rainProof: false,
      kidsFriendly: true,
      duration: "1-2h",
      favorite: true,
      notes: "Ideal para pasear y ver patos. Muy seguro para niños."
    },
    {
      id: generateId(),
      name: "MACA (Museo de Arte Contemporáneo)",
      zone: "Casco Antiguo",
      type: "Cultura",
      priceCategory: "Gratis",
      priceValue: 0,
      environment: "Interior",
      rainProof: true,
      kidsFriendly: true,
      duration: "1-2h",
      favorite: false,
      notes: "Perfecto para días de lluvia. Gratuito y céntrico."
    }
  ],
  
  shoppingListPro: [
    {
      id: generateId(),
      item: "Leche",
      category: "Lácteos",
      amount: "6 packs",
      estimatedPrice: 6,
      frequent: true,
      done: false
    }
  ],
  
  weeklyMenuPro: {
    monday: { breakfast: "", lunch: "", dinner: "", daughterDay: false, cheap: true },
    tuesday: { breakfast: "", lunch: "", dinner: "", daughterDay: false, cheap: true },
    wednesday: { breakfast: "", lunch: "", dinner: "", daughterDay: false, cheap: true },
    thursday: { breakfast: "", lunch: "", dinner: "", daughterDay: false, cheap: true },
    friday: { breakfast: "", lunch: "", dinner: "", daughterDay: false, cheap: true },
    saturday: { breakfast: "", lunch: "", dinner: "", daughterDay: false, cheap: true },
    sunday: { breakfast: "", lunch: "", dinner: "", daughterDay: false, cheap: true }
  },
  
  budgetPro: {
    income: 0,
    fixedExpenses: [], // { id, title, amount }
    variableExpenses: [],
    daughterExpenses: [],
    debts: [],
    savingsGoal: 0,
    status: "green" // green, yellow, red
  },
  
  emergencyMode: {
    isStressed: false,
    priorityActions: [
      "Respirar 5 minutos",
      "Beber agua",
      "Revisar solo las 3 tareas críticas"
    ],
    contacts: [
      { name: "Emergencias", phone: "112" }
    ],
    criticalDocs: []
  }
};