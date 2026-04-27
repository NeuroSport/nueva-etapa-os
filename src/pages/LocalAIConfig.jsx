import { useState, useEffect } from "react";
import Card from "../components/Card";
import { Cpu, Download, Zap, ShieldCheck, AlertTriangle, CheckCircle, Trash2, Smartphone, ArrowLeft } from "lucide-react";
import { localAI } from "../services/localAIService";

export default function LocalAIConfig({ setPage }) {
  const [supportWebGPU, setSupportWebGPU] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState("");
  const [isLoaded, setIsLoaded] = useState(localAI.getLoaded());
  const [isInitializing, setIsInitializing] = useState(false);
  const [activeModel, setActiveModel] = useState(localStorage.getItem("active_ai_mode") || "remote");

  useEffect(() => {
    if ("gpu" in navigator) {
      setSupportWebGPU(true);
    } else {
      setSupportWebGPU(false);
    }
  }, []);

  const handleInitialize = async () => {
    setIsInitializing(true);
    localAI.setCallback((progress) => {
      setLoadingProgress(progress);
    });

    try {
      await localAI.initialize();
      setIsLoaded(true);
      setIsInitializing(false);
      localStorage.setItem("active_ai_mode", "local");
      setActiveModel("local");
    } catch (error) {
      setIsInitializing(false);
      alert("Error al cargar la IA local: " + error.message);
    }
  };

  const toggleMode = (mode) => {
    if (mode === 'local' && !isLoaded) {
      alert("Primero debes descargar e inicializar la IA local.");
      return;
    }
    setActiveModel(mode);
    localStorage.setItem("active_ai_mode", mode);
  };

  return (
    <div className="page local-ai-page page-transition">
      <div className="section-header">
        <button className="back-btn-minimal" onClick={() => setPage('settings')}>
          <ArrowLeft size={20} /> Volver a Ajustes
        </button>
        <h1>Soberanía Digital: IA Local</h1>
        <p>Ejecuta inteligencia artificial 100% privada dentro de este móvil.</p>
      </div>

      <Card title="Estado del Hardware">
        <div className="hw-status">
          <div className={`status-pill ${supportWebGPU ? 'ok' : 'error'}`}>
            {supportWebGPU ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            {supportWebGPU ? "WebGPU Soportado" : "WebGPU No Detectado"}
          </div>
          <p className="hint">
            {supportWebGPU 
              ? "Tu dispositivo es apto para ejecutar IA localmente." 
              : "Tu navegador o dispositivo no soporta aceleración por GPU necesaria para IA local."}
          </p>
        </div>
      </Card>

      <Card title="Motor de Inteligencia">
        <div className="mode-selector">
          <button 
            className={`mode-btn ${activeModel === 'remote' ? 'active' : ''}`}
            onClick={() => toggleMode('remote')}
          >
            <Zap size={20} />
            <span>Remoto (PC)</span>
          </button>
          <button 
            className={`mode-btn ${activeModel === 'local' ? 'active' : ''}`}
            onClick={() => toggleMode('local')}
          >
            <Smartphone size={20} />
            <span>Local (Móvil)</span>
          </button>
        </div>
        <p className="hint mt-10">
          {activeModel === 'remote' 
            ? "Conectado al servidor de tu PC (Ollama). Requiere WiFi." 
            : "Ejecutando IA interna. 100% privado, 100% offline."}
        </p>
      </Card>

      {!isLoaded && supportWebGPU && (
        <Card title="Instalación de Cerebro Local">
          <div className="install-section">
            <p className="warning-text">
              <Download size={18} />
              Esta acción descargará aproximadamente 1.5GB - 2GB de datos. Te recomendamos usar WiFi.
            </p>
            
            {isInitializing ? (
              <div className="loading-area">
                <div className="spinner"></div>
                <p className="progress-text">{loadingProgress || "Iniciando descarga..."}</p>
              </div>
            ) : (
              <button className="download-btn" onClick={handleInitialize}>
                Descargar e Iniciar IA Local
              </button>
            )}
          </div>
        </Card>
      )}

      {isLoaded && (
        <Card title="IA Lista">
          <div className="success-area">
            <ShieldCheck size={48} color="#10b981" />
            <h3>Inteligencia Soberana Activada</h3>
            <p>La IA está cargada en la memoria de este dispositivo.</p>
            <button className="delete-model-btn" onClick={() => { if(confirm("¿Borrar modelo?")) { localStorage.removeItem("active_ai_mode"); window.location.reload(); } }}>
              <Trash2 size={16} /> Borrar Caché de IA
            </button>
          </div>
        </Card>
      )}

      <style>{`
        .local-ai-page { padding: 15px; padding-bottom: 90px; }
        .section-header { margin-bottom: 25px; }
        .hw-status { display: flex; flex-direction: column; gap: 10px; }
        .status-pill { display: flex; align-items: center; gap: 8px; padding: 8px 15px; border-radius: 20px; font-weight: bold; width: fit-content; font-size: 0.85em; }
        .status-pill.ok { background: #dcfce7; color: #166534; }
        .status-pill.error { background: #fee2e2; color: #991b1b; }
        
        .mode-selector { display: flex; gap: 12px; margin-top: 15px; }
        .mode-btn { 
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 10px; 
          padding: 20px; border-radius: 18px; border: 2px solid var(--border);
          background: var(--card); color: var(--text); font-weight: bold;
        }
        .mode-btn.active { border-color: var(--primary); background: #eff6ff; color: var(--primary); }
        
        .install-section { text-align: center; padding: 10px 0; }
        .warning-text { 
          display: flex; align-items: center; justify-content: center; gap: 10px;
          background: #fff7ed; color: #9a3412; padding: 15px; border-radius: 12px;
          font-size: 0.85em; margin-bottom: 20px;
        }
        .download-btn { 
          width: 100%; padding: 18px; border-radius: 15px; background: var(--primary);
          color: white; border: none; font-weight: bold; font-size: 1rem;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }
        
        .loading-area { display: flex; flex-direction: column; align-items: center; gap: 15px; }
        .spinner { width: 30px; height: 30px; border: 3px solid #e2e8f0; border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .progress-text { font-size: 0.8em; color: var(--text); font-family: monospace; }
        
        .success-area { text-align: center; padding: 20px 0; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .delete-model-btn { margin-top: 15px; background: none; border: none; color: #ef4444; font-size: 0.8em; display: flex; align-items: center; gap: 5px; opacity: 0.7; }
        
        .mt-10 { margin-top: 10px; }
        .back-btn-minimal { display: flex; align-items: center; gap: 8px; background: none; border: none; color: var(--primary); font-weight: bold; font-size: 0.9em; padding: 0; margin-bottom: 15px; cursor: pointer; }
      `}</style>
    </div>
  );
}
