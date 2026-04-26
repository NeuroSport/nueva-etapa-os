import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const OLLAMA_URL = "http://localhost:11434/api/chat";
const DEFAULT_MODEL = "qwen2.5:3b"; // Optimized for 16GB RAM as requested

app.post("/api/ia", async (req, res) => {
  const { prompt, messages } = req.body;

  // Prepare messages for Ollama chat API
  let payloadMessages = messages || [];
  if (prompt && (!messages || messages.length === 0)) {
    payloadMessages = [{ role: "user", content: prompt }];
  }

  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: payloadMessages,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error("Ollama server error");
    }

    const data = await response.json();
    res.json({ reply: data.message.content });
  } catch (error) {
    console.error("Error connecting to Ollama:", error);
    res.status(500).json({
      error: "No se pudo conectar con la IA local. Asegúrate de que Ollama esté instalado y ejecutando 'ollama run qwen2.5:3b'"
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor IA local activo en http://localhost:${PORT}`);
  console.log(`🤖 Modelo recomendado: ${DEFAULT_MODEL}`);
});
