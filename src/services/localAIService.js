import * as webllm from "@mlc-ai/web-llm";

/**
 * Service to handle On-Device AI using WebLLM
 * This runs locally in the browser/mobile GPU
 */

const SELECTED_MODEL = "Llama-3-8B-Instruct-v0.1-q4f32_1-MLC"; 
// Note: For mobile, maybe Gemma-2b-it-q4f32_1-MLC is better (smaller)
const DEFAULT_MODEL = "gemma-2b-it-q4f32_1-MLC"; 

class LocalAIService {
  constructor() {
    this.engine = null;
    this.statusCallback = null;
    this.isLoaded = false;
    this.isLoading = false;
  }

  setCallback(callback) {
    this.statusCallback = callback;
  }

  async initialize(modelId = DEFAULT_MODEL) {
    if (this.isLoaded || this.isLoading) return;
    
    this.isLoading = true;
    try {
      this.engine = await webllm.CreateMLCEngine(modelId, {
        initProgressCallback: (report) => {
          if (this.statusCallback) this.statusCallback(report.text);
          // Detectar si el modelo ya está en caché por el texto del reporte
          if (report.text.includes("Finish loading")) {
            localStorage.setItem("local_ai_installed", "true");
          }
        },
      });
      this.isLoaded = true;
      this.isLoading = false;
      localStorage.setItem("local_ai_installed", "true");
    } catch (error) {
      this.isLoading = false;
      console.error("Failed to load Local AI:", error);
      throw error;
    }
  }

  async autoInit() {
    if (localStorage.getItem("local_ai_installed") === "true" && !this.isLoaded && !this.isLoading) {
      console.log("Auto-initializing Local AI from cache...");
      try {
        await this.initialize();
      } catch (e) {
        console.warn("Auto-init failed, likely WebGPU not ready yet.");
      }
    }
  }

  async generate(messages, onUpdate) {
    if (!this.isLoaded) {
      throw new Error("El modelo de IA local no ha sido cargado.");
    }

    try {
      const chunks = await this.engine.chat.completions.create({
        messages,
        stream: true,
      });

      let fullReply = "";
      for await (const chunk of chunks) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullReply += content;
        if (onUpdate) onUpdate(fullReply);
      }
      return fullReply;
    } catch (error) {
      console.error("Local AI Inference Error:", error);
      throw error;
    }
  }

  getLoaded() {
    return this.isLoaded;
  }
}

export const localAI = new LocalAIService();
