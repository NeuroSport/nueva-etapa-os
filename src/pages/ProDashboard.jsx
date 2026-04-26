import Card from "../components/Card";
import { 
  Baby, 
  MapPin, 
  ShoppingCart, 
  Utensils, 
  TrendingUp, 
  AlertTriangle, 
  RefreshCcw,
  Sparkles,
  ChevronRight
} from "lucide-react";

export default function ProDashboard({ setPage }) {
  const modules = [
    { 
      id: "pro-custody", 
      title: "Custodia e Hija", 
      desc: "Calendario, eventos y gastos de la niña.", 
      icon: Baby,
      color: "#ec4899"
    },
    { 
      id: "pro-alicante", 
      title: "Planes Alicante", 
      desc: "Explorador de planes locales con filtros.", 
      icon: MapPin,
      color: "#3b82f6"
    },
    { 
      id: "pro-shopping", 
      title: "Lista Compra PRO", 
      desc: "Lista inteligente vinculada al menú.", 
      icon: ShoppingCart,
      color: "#10b981"
    },
    { 
      id: "pro-menu", 
      title: "Menú Semanal", 
      desc: "Planifica comidas y genera la compra.", 
      icon: Utensils,
      color: "#f59e0b"
    },
    { 
      id: "pro-budget", 
      title: "Presupuesto PRO", 
      desc: "Control total de ingresos y semáforo.", 
      icon: TrendingUp,
      color: "#6366f1"
    },
    { 
      id: "pro-emergency", 
      title: "Modo Emergencia", 
      desc: "Filtro de estrés y contactos críticos.", 
      icon: AlertTriangle,
      color: "#ef4444"
    },
    { 
      id: "pro-review", 
      title: "Revisión Semanal", 
      desc: "Resumen de rendimiento del domingo.", 
      icon: RefreshCcw,
      color: "#8b5cf6"
    },
    { 
      id: "assistant", 
      title: "Centro IA", 
      desc: "IA optimizada con botones de acción.", 
      icon: Sparkles,
      color: "#06b6d4"
    }
  ];

  return (
    <div className="page pro-dashboard">
      <div className="pro-header">
        <h1>Vida Práctica PRO</h1>
        <p>Centro operativo de alto rendimiento</p>
      </div>

      <div className="pro-grid">
        {modules.map((mod) => (
          <button 
            key={mod.id} 
            className="pro-card-btn"
            onClick={() => setPage(mod.id)}
          >
            <div className="icon-wrapper" style={{ backgroundColor: mod.color }}>
              <mod.icon size={24} color="white" />
            </div>
            <div className="text-content">
              <h3>{mod.title}</h3>
              <p>{mod.desc}</p>
            </div>
            <ChevronRight size={20} className="arrow" />
          </button>
        ))}
      </div>

      <style>{`
        .pro-header {
          margin-bottom: 25px;
        }
        .pro-header h1 {
          font-size: 1.8rem;
          margin-bottom: 5px;
          background: linear-gradient(90deg, var(--primary), #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .pro-header p {
          opacity: 0.7;
        }
        .pro-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
        }
        @media (min-width: 768px) {
          .pro-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .pro-card-btn {
          display: flex;
          align-items: center;
          gap: 15px;
          background: var(--card);
          border: 1px solid var(--border);
          padding: 20px;
          border-radius: 16px;
          text-align: left;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .pro-card-btn:hover {
          transform: translateY(-2px);
          border-color: var(--primary);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .text-content {
          flex-grow: 1;
        }
        .text-content h3 {
          font-size: 1.1rem;
          margin-bottom: 4px;
        }
        .text-content p {
          font-size: 0.85rem;
          opacity: 0.7;
          margin: 0;
        }
        .arrow {
          opacity: 0.3;
        }
        .pro-card-btn:hover .arrow {
          opacity: 1;
          color: var(--primary);
          transform: translateX(3px);
        }
      `}</style>
    </div>
  );
}
