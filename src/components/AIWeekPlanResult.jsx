import React, { useState } from 'react';
import Card from './Card';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  TrendingDown, 
  Heart, 
  Wallet, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Zap,
  Info
} from 'lucide-react';

export default function AIWeekPlanResult({ plan, onApply }) {
  const [expandedDay, setExpandedDay] = useState(0);
  const [selectedEvents, setSelectedEvents] = useState({}); // { "day-idx-event-idx": true }

  if (!plan || !plan.days) {
    return (
      <div className="error-fallback">
        <AlertTriangle size={48} color="#ef4444" />
        <h3>Error en el formato del plan</h3>
        <p>La IA devolvió un formato no reconocido. Revisa la respuesta en el chat.</p>
        <pre className="raw-text">{JSON.stringify(plan, null, 2)}</pre>
      </div>
    );
  }

  const toggleEventSelection = (dayIdx, blockIdx) => {
    const key = `${dayIdx}-${blockIdx}`;
    setSelectedEvents(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleApply = () => {
    const eventsToCreate = [];
    plan.days.forEach((day, dIdx) => {
      day.blocks.forEach((block, bIdx) => {
        if (selectedEvents[`${dIdx}-${bIdx}`]) {
          const [start, end] = (block.time || "09:00-10:00").split("-");
          eventsToCreate.push({
            title: block.title,
            date: day.date,
            startTime: start || "09:00",
            endTime: end || "10:00",
            category: block.category || "General",
            priority: block.priority || "media",
            notes: block.notes || "",
            important: block.priority === 'alta',
            sourceType: "ai_week_plan",
            sourceId: `plan-${plan.weekStart}-${dIdx}-${bIdx}`
          });
        }
      });
    });
    onApply(eventsToCreate);
  };

  return (
    <div className="ai-plan-result">
      <div className="plan-summary-banner">
        <div className="info">
          <h3>Propuesta: Semana del {plan.weekStart}</h3>
          <p>{plan.summary}</p>
        </div>
        <div className="mode-tag">{plan.mode?.toUpperCase()}</div>
      </div>

      <div className="days-accordion">
        {plan.days.map((day, dIdx) => (
          <div key={dIdx} className={`day-card ${expandedDay === dIdx ? 'expanded' : ''}`}>
            <div className="day-header" onClick={() => setExpandedDay(expandedDay === dIdx ? -1 : dIdx)}>
              <div className="day-meta">
                <span className="day-name">{day.dayName}</span>
                <span className="day-date">{day.date}</span>
              </div>
              <div className="day-summary-text">{day.mainGoal}</div>
              {expandedDay === dIdx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {expandedDay === dIdx && (
              <div className="day-details">
                <div className="advice-box">
                  <Info size={16} />
                  <span>{day.energyAdvice}</span>
                </div>

                <div className="blocks-section">
                  <h4><Clock size={14} /> Bloques Sugeridos</h4>
                  {day.blocks.map((block, bIdx) => (
                    <div 
                      key={bIdx} 
                      className={`block-item ${selectedEvents[`${dIdx}-${bIdx}`] ? 'selected' : ''}`}
                      onClick={() => toggleEventSelection(dIdx, bIdx)}
                    >
                      <div className="selection-check">
                        {selectedEvents[`${dIdx}-${bIdx}`] ? <CheckCircle size={18} fill="#3b82f6" color="white" /> : <div className="circle-check" />}
                      </div>
                      <div className="block-info">
                        <div className="b-time">{block.time}</div>
                        <div className="b-title">{block.title}</div>
                        <div className="b-tags">
                          <span className={`tag p-${block.priority}`}>{block.priority}</span>
                          <span className="tag cat">{block.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid-details">
                  <div className="detail-col">
                    <h5><Wallet size={12} /> Economía</h5>
                    <ul>{day.economy.map((e, i) => <li key={i}>{e}</li>)}</ul>
                  </div>
                  <div className="detail-col">
                    <h5><Heart size={12} /> Hija / Personal</h5>
                    <ul>{day.daughter.concat(day.selfCare).map((h, i) => <li key={i}>{h}</li>)}</ul>
                  </div>
                </div>

                <div className="dont-box">
                  <strong>NO HACER:</strong> {day.doNotDo.join(", ")}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="result-actions">
        <button className="apply-btn" onClick={handleApply}>
          <Zap size={18} fill="white" />
          Aplicar seleccionados al calendario
        </button>
      </div>

      <style>{`
        .ai-plan-result { padding: 15px; display: flex; flex-direction: column; gap: 15px; }
        .plan-summary-banner { background: #eff6ff; padding: 20px; border-radius: 20px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #dbeafe; }
        .plan-summary-banner h3 { margin: 0; font-size: 1rem; color: #1e40af; }
        .plan-summary-banner p { margin: 5px 0 0 0; font-size: 0.8em; opacity: 0.7; color: #1e40af; }
        .mode-tag { background: #1e40af; color: white; padding: 4px 10px; border-radius: 8px; font-size: 0.65em; font-weight: bold; }

        .days-accordion { display: flex; flex-direction: column; gap: 10px; }
        .day-card { background: var(--card); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; }
        .day-header { padding: 15px; display: flex; align-items: center; gap: 15px; cursor: pointer; }
        .day-meta { display: flex; flex-direction: column; min-width: 60px; }
        .day-name { font-weight: bold; font-size: 0.9em; }
        .day-date { font-size: 0.7em; opacity: 0.5; }
        .day-summary-text { flex-grow: 1; font-size: 0.85em; font-weight: 500; }

        .day-details { padding: 0 15px 15px 15px; display: flex; flex-direction: column; gap: 15px; }
        .advice-box { background: #fefce8; color: #854d0e; padding: 10px; border-radius: 12px; font-size: 0.8em; display: flex; gap: 8px; align-items: center; }
        
        .blocks-section h4 { font-size: 0.8em; margin-bottom: 10px; opacity: 0.6; display: flex; align-items: center; gap: 5px; }
        .block-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg); border-radius: 14px; margin-bottom: 8px; border: 2px solid transparent; }
        .block-item.selected { border-color: #3b82f6; background: #f0f7ff; }
        .selection-check { width: 20px; }
        .circle-check { width: 18px; height: 18px; border: 2px solid #cbd5e1; border-radius: 50%; }
        .b-time { font-size: 0.75em; font-weight: bold; color: var(--primary); }
        .b-title { font-size: 0.85em; font-weight: 600; }
        .b-tags { display: flex; gap: 5px; margin-top: 4px; }
        .tag { font-size: 0.6em; padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase; }
        .tag.p-alta { background: #fee2e2; color: #ef4444; }
        .tag.cat { background: #e2e8f0; color: #475569; }

        .grid-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .detail-col h5 { font-size: 0.75em; margin-bottom: 8px; opacity: 0.6; display: flex; align-items: center; gap: 5px; }
        .detail-col ul { list-style: none; padding: 0; margin: 0; }
        .detail-col li { font-size: 0.75em; padding: 4px 0; border-bottom: 1px solid var(--border); }

        .dont-box { background: #fee2e2; color: #991b1b; padding: 10px; border-radius: 12px; font-size: 0.75em; }

        .result-actions { padding: 10px 0; }
        .apply-btn { width: 100%; padding: 16px; background: #1e293b; color: white; border: none; border-radius: 15px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px; }
        
        .error-fallback { text-align: center; padding: 40px 20px; }
        .raw-text { background: #f1f5f9; padding: 15px; border-radius: 10px; font-size: 0.7em; overflow: auto; text-align: left; margin-top: 20px; }
      `}</style>
    </div>
  );
}
