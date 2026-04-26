import Card from "../components/Card";

export default function Settings({
  fontSize,
  setFontSize,
  darkMode,
  setDarkMode
}) {
  return (
    <div className="page">
      <Card title="Ajustes visuales">
        <p>Tamaño de texto: {fontSize}px</p>

        <div className="buttons-row">
          <button onClick={() => setFontSize(Math.max(14, fontSize - 1))}>
            Reducir
          </button>

          <button onClick={() => setFontSize(Math.min(24, fontSize + 1))}>
            Aumentar
          </button>
        </div>

        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Modo claro" : "Modo oscuro"}
        </button>
      </Card>

      <Card title="Privacidad">
        <p>
          Esta versión guarda los datos en tu propio navegador mediante
          LocalStorage. No se suben a ningún servidor.
        </p>
      </Card>
    </div>
  );
}