import { useState, useEffect } from "react";
import Card from "../components/Card";
import { Globe, Shield, Smartphone, Zap } from "lucide-react";

export default function Settings({
  fontSize,
  setFontSize,
  darkMode,
  setDarkMode,
  data
}) {
  const [aiUrl, setAiUrl] = useState(localStorage.getItem("ai_backend_url") || "http://localhost:3001/api/ia");

  const handleSaveUrl = (url) => {
    setAiUrl(url);
    localStorage.setItem("ai_backend_url", url);
  };

  return (
    <div className="page settings-page">
      <div className="section-header">
        <h1>Ajustes de Sistema</h1>
        <p>Configuración técnica y visual v2.0</p>
      </div>

      <Card title="Conectividad IA (Móvil)">
        <div className="settings-item">
          <div className="item-info">
            <Globe size={20} color="#3b82f6" />
            <span>URL del Servidor IA</span>
          </div>
          <p className="hint">Si usas el móvil, cambia 'localhost' por la IP de tu PC (ej: 192.168.1.15)</p>
          <input 
            type="text" 
            className="settings-input"
            value={aiUrl} 
            onChange={(e) => handleSaveUrl(e.target.value)}
            placeholder="http://192.168.1.XX:3001/api/ia"
          />
        </div>
      </Card>

      <Card title="Apariencia">
        <div className="settings-item">
          <div className="item-info">
            <Zap size={20} color="#f59e0b" />
            <span>Tamaño de Interfaz</span>
          </div>
          <div className="buttons-row">
            <button className="small-btn" onClick={() => setFontSize(Math.max(12, fontSize - 1))}>A</button>
            <span className="fs-val">{fontSize}px</span>
            <button className="small-btn" onClick={() => setFontSize(Math.min(24, fontSize + 1))}>A+</button>
          </div>
        </div>

        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Activar Modo Claro" : "Activar Modo Oscuro"}
        </button>
      </Card>

      <Card title="Seguridad y Datos">
        <div className="settings-item">
          <div className="item-info">
            <Shield size={20} color="#10b981" />
            <span>Almacenamiento Local</span>
          </div>
          <p className="hint">Tus datos están seguros en este dispositivo. No se envían a la nube (excepto a tu propia IA local).</p>
        </div>
      </Card>

      <style>{`
        .settings-page { padding: 15px; padding-bottom: 90px; }
        .section-header { margin-bottom: 25px; }
        .section-header h1 { font-size: 1.5rem; margin: 0; }
        .section-header p { font-size: 0.85em; opacity: 0.6; }

        .settings-item { margin-bottom: 15px; }
        .item-info { display: flex; align-items: center; gap: 10px; font-weight: bold; margin-bottom: 8px; }
        .hint { font-size: 0.75em; opacity: 0.5; margin-bottom: 10px; line-height: 1.4; }

        .settings-input {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          font-family: monospace;
          font-size: 0.85em;
        }

        .buttons-row { display: flex; align-items: center; gap: 15px; margin-top: 10px; }
        .small-btn { padding: 5px 15px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg); }
        .fs-val { font-weight: bold; min-width: 40px; text-align: center; }

        .theme-toggle {
          width: 100%;
          margin-top: 20px;
          padding: 12px;
          border-radius: 12px;
          border: none;
          background: var(--primary);
          color: white;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}