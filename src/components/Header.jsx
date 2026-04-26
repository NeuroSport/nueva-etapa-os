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
  settings: "Ajustes"
};

export default function Header({ page }) {
  return (
    <header className="header">
      <div>
        <h1>{titles[page] || "Nueva Etapa OS"}</h1>
        <p>Tu panel personal para recuperar control y claridad</p>
      </div>
    </header>
  );
}