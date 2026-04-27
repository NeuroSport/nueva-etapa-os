import { useState, useEffect } from "react";
import Card from "../components/Card";
import { Globe, Shield, Smartphone, Zap, Download, Upload, Lock, EyeOff, Eye, Trash2 } from "lucide-react";
import { exportData, importData } from "../storage";

export default function Settings({
  fontSize,
  setFontSize,
  darkMode,
  setDarkMode,
  data,
  setData,
  setIsLocked
}) {
  const [aiUrl, setAiUrl] = useState(localStorage.getItem("ai_backend_url") || "http://localhost:3001/api/ia");
  const [pin, setPin] = useState("");
  const [hasPin, setHasPin] = useState(!!localStorage.getItem("app_pin_hash"));
  const [privacyMode, setPrivacyMode] = useState(data.settings?.privacyMode || false);

  const hashPin = (p) => btoa("nueva-etapa-" + p);

  const handleSaveUrl = (url) => {
    setAiUrl(url);
    localStorage.setItem("ai_backend_url", url);
  };

  const handleSetPin = () => {
    if (pin.length >= 4) {
      localStorage.setItem("app_pin_hash", hashPin(pin));
      setHasPin(true);
      setPin("");
      alert("PIN configurado correctamente");
    } else {
      alert("El PIN debe tener al menos 4 dígitos");
    }
  };

  const handleRemovePin = () => {
    if (window.confirm("¿Seguro que quieres eliminar la protección por PIN?")) {
      localStorage.removeItem("app_pin_hash");
      setHasPin(false);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (window.confirm("Esta acción sobrescribirá todos tus datos actuales. ¿Deseas continuar?")) {
        try {
          const newData = await importData(file);
          setData(newData);
          alert("Datos importados con éxito");
          window.location.reload();
        } catch (err) {
          alert(err);
        }
      }
    }
  };

  const togglePrivacy = () => {
    const newVal = !privacyMode;
    setPrivacyMode(newVal);
    setData({
      ...data,
      settings: { ...data.settings, privacyMode: newVal }
    });
  };

  return (
    <div className="page settings-page page-transition">


      <div className="section-header">
        <h1>Ajustes de Sistema</h1>
        <p>Configuración técnica y visual v2.0</p>
      </div>

      <Card title="Seguridad de Acceso">
        <div className="settings-item">
          <div className="item-info">
            <Lock size={20} color="#6366f1" />
            <span>Protección por PIN</span>
          </div>
          <p className="hint">Bloquea la aplicación al iniciar. Usa un código de 4 a 6 dígitos.</p>
          
          {!hasPin ? (
            <div className="pin-setup">
              <input 
                type="password" 
                maxLength={6} 
                placeholder="Nuevo PIN" 
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
              />
              <button className="setup-btn" onClick={handleSetPin}>Configurar PIN</button>
            </div>
          ) : (
            <div className="pin-actions">
              <button className="lock-btn" onClick={() => setIsLocked(true)}>Bloquear Ahora</button>
              <button className="remove-pin-btn" onClick={handleRemovePin}>Eliminar PIN</button>
            </div>
          )}
        </div>

        <div className="settings-item">
          <div className="item-info">
            {privacyMode ? <EyeOff size={20} color="#f43f5e" /> : <Eye size={20} color="#10b981" />}
            <span>Modo Privado</span>
          </div>
          <p className="hint">Oculta cifras y datos sensibles en la interfaz principal.</p>
          <button className={`toggle-btn ${privacyMode ? 'active' : ''}`} onClick={togglePrivacy}>
            {privacyMode ? "Desactivar Privacidad" : "Activar Privacidad"}
          </button>
        </div>
      </Card>

      <Card title="Copia de Seguridad">
        <div className="settings-item">
          <p className="hint">Tus datos solo viven en este navegador. Te recomendamos exportar una copia semanalmente.</p>
          <div className="backup-buttons">
            <button className="backup-btn" onClick={exportData}>
              <Download size={18} /> Exportar Datos (JSON)
            </button>
            <label className="import-label">
              <Upload size={18} /> Importar Datos
              <input type="file" accept=".json" onChange={handleImport} hidden />
            </label>
          </div>
        </div>
      </Card>

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
          <button 
            className="local-ai-btn" 
            onClick={() => setPage('local-ai-config')}
            style={{ marginTop: '15px', width: '100%', padding: '12px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', border: '1px solid #10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Smartphone size={18} />
            Configurar IA Interna (On-Device)
          </button>
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

        .pin-setup { display: flex; gap: 10px; }
        .pin-setup input { flex-grow: 1; padding: 10px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg); color: var(--text); }
        .setup-btn { padding: 10px 15px; background: #6366f1; color: white; border: none; border-radius: 10px; font-weight: bold; font-size: 0.8em; }
        
        .pin-actions { display: flex; gap: 10px; }
        .lock-btn { flex-grow: 1; padding: 10px; background: #334155; color: white; border: none; border-radius: 10px; font-weight: bold; }
        .remove-pin-btn { padding: 10px; background: #fee2e2; color: #ef4444; border: none; border-radius: 10px; font-weight: bold; }

        .toggle-btn { width: 100%; padding: 10px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg); color: var(--text); font-weight: bold; }
        .toggle-btn.active { background: #fef2f2; color: #f43f5e; border-color: #fca5a5; }

        .backup-buttons { display: flex; flex-direction: column; gap: 10px; }
        .backup-btn, .import-label { 
          display: flex; align-items: center; justify-content: center; gap: 10px; 
          padding: 12px; border-radius: 12px; background: #1e293b; color: white; 
          font-weight: bold; font-size: 0.9em; cursor: pointer; border: none;
          text-align: center;
        }
        .import-label { background: #f1f5f9; color: #1e293b; border: 1px solid var(--border); }

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