import {
  Home,
  CalendarDays,
  Heart,
  CheckSquare,
  Wallet,
  ListChecks,
  Target,
  ShoppingCart,
  Utensils,
  Map as MapIcon,
  TrendingUp,
  BookOpen,
  Settings,
  Sparkles,
  Rocket
} from "lucide-react";

const items = [
  { id: "dashboard", label: "Hoy", icon: Home },
  { id: "calendar", label: "Agenda", icon: CalendarDays },
  { id: "daughter", label: "Hija", icon: Heart },
  { id: "tasks", label: "Tareas", icon: CheckSquare },
  { id: "economy", label: "Dinero", icon: Wallet },
  { id: "needs", label: "Neces.", icon: ListChecks },
  { id: "goals", label: "Metas", icon: Target },
  { id: "shopping", label: "Compra", icon: ShoppingCart },
  { id: "menu", label: "Menú", icon: Utensils },
  { id: "plans", label: "Planes", icon: MapIcon },
  { id: "sunday-review", label: "Resumen", icon: TrendingUp },
  { id: "diary", label: "Diario", icon: BookOpen },
  { id: "assistant", label: "IA", icon: Sparkles },
  { id: "pro", label: "PRO", icon: Rocket },
  { id: "settings", label: "Ajustes", icon: Settings }
];

export default function BottomNav({ page, setPage }) {
  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className={page === item.id ? "active" : ""}
            onClick={() => setPage(item.id)}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}