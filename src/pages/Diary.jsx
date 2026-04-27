import { useState } from "react";
import { generateId } from "../utils";
import Card from "../components/Card";

export default function Diary({ data, setData }) {
  const [text, setText] = useState("");
  const [energy, setEnergy] = useState("Media");

  function addDiary() {
    if (!text.trim()) return;

    setData({
      ...data,
      diary: [
        ...data.diary,
        {
          id: generateId(),
          text,
          energy,
          date: new Date().toLocaleDateString("es-ES")
        }
      ]
    });

    setText("");
  }

  return (
    <div className="page">
      <Card title="Diario emocional">
        <select value={energy} onChange={(e) => setEnergy(e.target.value)}>
          <option>Baja</option>
          <option>Media</option>
          <option>Alta</option>
        </select>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="¿Cómo estás hoy?"
        />

        <button onClick={addDiary}>Guardar reflexión</button>
      </Card>

      <Card title="Historial">
        {data.diary.map((entry) => (
          <div className="list-item" key={entry.id}>
            <div>
              <strong>{entry.date}</strong>
              <p>{entry.text}</p>
            </div>
            <span>{entry.energy}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}