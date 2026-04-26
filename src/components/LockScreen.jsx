import { useState } from "react";
import { Lock, Delete, ChevronRight, AlertCircle } from "lucide-react";

export default function LockScreen({ onUnlock, storedPinHash }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const hashPin = (p) => btoa("nueva-etapa-" + p);

  const handleKeyPress = (num) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      // Auto-check if length matches common PIN lengths (4 or 6)
      // but better wait for explicit confirm or check on every change if we know the length
      if (hashPin(newPin) === storedPinHash) {
        onUnlock();
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const handleConfirm = () => {
    if (hashPin(pin) === storedPinHash) {
      onUnlock();
    } else {
      setError(true);
      setPin("");
      // Vibration or animation feedback
      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  return (
    <div className="lock-screen">
      <div className="lock-container">
        <div className="lock-header">
          <div className={`lock-icon ${error ? 'error' : ''}`}>
            <Lock size={32} />
          </div>
          <h1>App Bloqueada</h1>
          <p>{error ? "PIN Incorrecto" : "Introduce tu PIN de acceso"}</p>
        </div>

        <div className="pin-display">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`pin-dot ${pin.length > i ? 'active' : ''} ${error ? 'error' : ''}`} />
          ))}
        </div>

        <div className="numpad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button key={num} onClick={() => handleKeyPress(num.toString())}>{num}</button>
          ))}
          <button className="action" onClick={handleDelete}><Delete size={20} /></button>
          <button onClick={() => handleKeyPress("0")}>0</button>
          <button className="action confirm" onClick={handleConfirm}><ChevronRight size={24} /></button>
        </div>
      </div>

      <style>{`
        .lock-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #0f172a;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .lock-container {
          width: 100%;
          max-width: 320px;
          text-align: center;
        }
        .lock-header { margin-bottom: 40px; }
        .lock-icon {
          width: 70px;
          height: 70px;
          background: rgba(255,255,255,0.1);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #3b82f6;
          transition: all 0.3s;
        }
        .lock-icon.error { background: #fee2e2; color: #ef4444; animation: shake 0.4s; }
        .lock-header h1 { font-size: 1.5rem; margin-bottom: 8px; }
        .lock-header p { font-size: 0.9rem; opacity: 0.6; }

        .pin-display {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 50px;
        }
        .pin-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          transition: all 0.2s;
        }
        .pin-dot.active { background: #3b82f6; transform: scale(1.2); }
        .pin-dot.error { background: #ef4444; }

        .numpad {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }
        .numpad button {
          height: 70px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          font-size: 1.5rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .numpad button:active { background: rgba(255,255,255,0.15); transform: scale(0.95); }
        .numpad button.action { background: transparent; border-color: transparent; }
        .numpad button.confirm { background: #3b82f6; color: white; }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
}
