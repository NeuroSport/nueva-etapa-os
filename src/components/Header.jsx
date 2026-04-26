import { Search } from "lucide-react";

const titles = {
  dashboard: "Hoy",
  calendar: "Agenda",
  daughter: "Mi Hija",
  tasks: "Tareas",
  economy: "Finanzas",
  needs: "Necesidades",
  goals: "Metas",
  diary: "Diario",
  assistant: "Asistente IA",
  settings: "Ajustes",
  pro: "Control PRO",
  'pro-budget': "Presupuesto PRO",
  'pro-alicante': "Planes Alicante",
  'pro-menu': "Menú Semanal PRO"
};

export default function Header({ page, onSearch }) {
  return (
    <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1>{titles[page] || "Nueva Etapa OS"}</h1>
        <p style={{ fontSize: '0.8em' }}>Control y Claridad v2.0</p>
      </div>
      <button 
        onClick={onSearch}
        style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', padding: 0, display: 'flex', alignItems: 'center', justifyCenter: 'center' }}
      >
        <Search size={20} color="white" />
      </button>
    </header>
  );
}