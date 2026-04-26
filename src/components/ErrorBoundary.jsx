import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReset = () => {
    // Intentar limpiar localStorage si es un error crítico de datos
    // localStorage.clear(); // Demasiado agresivo
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-screen">
          <div className="error-card">
            <AlertTriangle size={64} color="#ef4444" />
            <h1>Vaya, algo ha fallado</h1>
            <p>Se ha producido un error inesperado en la aplicación.</p>
            <div className="error-details">
              <code>{this.state.error?.toString()}</code>
            </div>
            <button className="reset-btn" onClick={this.handleReset}>
              <RefreshCcw size={18} />
              Reiniciar Aplicación
            </button>
          </div>
          <style>{`
            .error-boundary-screen {
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f8fafc;
              padding: 20px;
              font-family: system-ui, -apple-system, sans-serif;
            }
            .error-card {
              background: white;
              padding: 40px;
              border-radius: 24px;
              box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 400px;
              width: 100%;
            }
            .error-card h1 { margin: 20px 0 10px; font-size: 1.5rem; color: #1e293b; }
            .error-card p { color: #64748b; font-size: 0.9rem; margin-bottom: 20px; }
            .error-details {
              background: #f1f5f9;
              padding: 15px;
              border-radius: 12px;
              margin-bottom: 25px;
              text-align: left;
              overflow-x: auto;
            }
            .error-details code { font-size: 0.8rem; color: #ef4444; white-space: pre-wrap; }
            .reset-btn {
              width: 100%;
              background: #3b82f6;
              color: white;
              border: none;
              padding: 15px;
              border-radius: 12px;
              font-weight: bold;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              cursor: pointer;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
