/**
 * Service to interact with the local backend (which proxies to Ollama)
 */

const getBackendUrl = () => {
  const savedUrl = localStorage.getItem("ai_backend_url");
  return savedUrl || "http://localhost:3001/api/ia";
};

export async function chatWithAI(messages) {
  try {
    const response = await fetch(getBackendUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error en el servidor de IA");
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
}

/**
 * Sends a single prompt to the AI (useful for smart buttons)
 */
export async function sendPrompt(prompt) {
  try {
    const response = await fetch(getBackendUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error en el servidor de IA");
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("AI Prompt Error:", error);
    throw error;
  }
}
