import Card from "../../components/Card";
import { AlertCircle, Phone, FileText, Zap, ArrowLeft, Heart, CheckCircle } from "lucide-react";

export default function EmergencyMode({ data, setPage }) {
  const criticalTasks = data.tasks.filter(t => t.priority === "Alta" && !t.done).slice(0, 3);
  const secondaryTasks = data.tasks.filter(t => t.priority !== "Alta" && !t.done);

  return (
    <div className="page emergency-page">
      <div className="emergency-header">
        <button className="back-btn" onClick={() => setPage('pro')}><ArrowLeft size={20} /> Salir del modo emergencia</button>
        <h1><AlertCircle size={32} /> Modo Foco Absoluto</h1>
        <p>Hoy solo importa lo que ves aquí abajo. El resto puede esperar.</p>
      </div>

      <div className="emergency-grid">
        <div className="focus-zone">
          <Card title="Las 3 Prioridades de HOY">
            <div className="critical-list">
              {criticalTasks.map(task => (
                <div key={task.id} className="critical-item">
                  <Zap size={20} color="#f59e0b" />
                  <span>{task.title}</span>
                </div>
              ))}
              {criticalTasks.length === 0 && <p className="all-clear">¡No tienes tareas críticas pendientes!</p>}
            </div>
            <div className="mantra">
              <Heart size={16} /> "Haz una cosa a la vez. No tienes que hacerlo todo hoy."
            </div>
          </Card>

          <Card title="Lo que puede esperar (Relájate)">
            <div className="wait-list">
              {secondaryTasks.slice(0, 5).map(task => (
                <div key={task.id} className="wait-item">
                  <span>{task.title}</span>
                </div>
              ))}
              <p className="more-info">...y {secondaryTasks.length > 5 ? secondaryTasks.length - 5 : 0} tareas más están pausadas.</p>
            </div>
          </Card>
        </div>

        <div className="support-zone">
          <Card title="Contactos de Emergencia">
            <div className="contact-list">
              {data.emergencyMode.contacts.map((c, i) => (
                <a key={i} href={`tel:${c.phone}`} className="contact-btn">
                  <Phone size={18} />
                  <div className="c-info">
                    <strong>{c.name}</strong>
                    <span>{c.phone}</span>
                  </div>
                </a>
              ))}
            </div>
          </Card>

          <Card title="Documentos Críticos">
            <div className="docs-list">
              <div className="doc-item"><FileText size={16} /> DNI / Pasaporte</div>
              <div className="doc-item"><FileText size={16} /> Libro de Familia</div>
              <div className="doc-item"><FileText size={16} /> Seguro Médico</div>
              <p className="doc-hint">Tus documentos están seguros en tu PC local.</p>
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        .emergency-page {
          background: #0f172a;
          color: white;
          min-height: 100vh;
          margin: -20px;
          padding: 40px 20px;
        }
        .emergency-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .emergency-header h1 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          font-size: 2.2rem;
          color: #ef4444;
          margin: 20px 0;
        }
        .back-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          padding: 10px 20px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 auto;
        }
        .emergency-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
          max-width: 1000px;
          margin: 0 auto;
        }
        @media (min-width: 800px) { .emergency-grid { grid-template-columns: 1.5fr 1fr; } }
        
        .critical-list { display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px; }
        .critical-item {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          padding: 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 1.2rem;
          font-weight: 500;
        }
        .mantra {
          text-align: center;
          font-style: italic;
          opacity: 0.7;
          border-top: 1px solid var(--border);
          padding-top: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .wait-item { opacity: 0.4; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .more-info { font-size: 0.8em; opacity: 0.3; margin-top: 10px; }

        .contact-btn {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #ef4444;
          color: white;
          padding: 15px;
          border-radius: 12px;
          text-decoration: none;
          margin-bottom: 10px;
        }
        .c-info { display: flex; flex-direction: column; }
        .c-info span { font-size: 0.8em; opacity: 0.8; }
        
        .doc-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          margin-bottom: 8px;
        }
        .doc-hint { font-size: 0.75em; opacity: 0.4; margin-top: 15px; }
        
        /* Overwrite card style for emergency mode */
        .emergency-page .card {
          background: rgba(30, 41, 59, 0.7);
          border-color: rgba(255,255,255,0.1);
          color: white;
        }
      `}</style>
    </div>
  );
}
