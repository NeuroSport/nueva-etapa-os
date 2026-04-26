# Guía de Arranque Local - Nueva Etapa OS

**Directorio del Proyecto:**
```powershell
cd "c:\Users\PcVIP\Documents\ia pc nuevo\nuevos proyectos completos futuros\Nueva Etapa OS\NuevaEtapaV1MVP"
```

---

Para que el proyecto funcione al 100%, necesitas abrir **3 terminales** (o pestañas de terminal) y tener instalado **Ollama**.

---

## 1. Terminal IA (Motor Local)
Este terminal corre el cerebro de la inteligencia artificial.
*   **Comando:**
    ```powershell
    ollama run qwen2.5:3b
    ```
*   **Nota:** Si es la primera vez, se descargará el modelo. Mantén este terminal abierto siempre que quieras usar el asistente de IA.

---

## 2. Terminal Backend (Servidor Proxy)
Este terminal permite que la aplicación de React hable con la IA de forma segura.
*   **Pasos:**
    1.  `cd server`
    2.  `node index.js`
*   **URL:** `http://localhost:3001`

---

## 3. Terminal Frontend (Interfaz de Usuario)
Este terminal arranca la página web que ves en el navegador.
*   **Pasos:**
    1.  `npm run dev`
*   **URL:** `http://localhost:5173` (o la que indique Vite).

---

## Resumen de Instalación previa
Si es un PC nuevo, asegúrate de haber hecho esto una vez:
1.  **Instalar Ollama:** Descargar desde [ollama.com](https://ollama.com).
2.  **Instalar Dependencias:**
    *   En la raíz: `npm install`
    *   En /server: `cd server` y luego `npm install`

---

## 🔧 Solución de Problemas Comunes

### Si 'ollama' no se reconoce como comando
Si al poner `ollama run` te sale un error rojo de "comando no encontrado", es que la ruta no está en el PATH de Windows.

**Solución rápida (solo para la terminal actual):**
```powershell
$env:Path += ";C:\Users\PcVIP\AppData\Local\Programs\Ollama"
```

**Solución permanente (Recomendado):**
1. Abre PowerShell como **Administrador**.
2. Ejecuta este comando:
   ```powershell
   [System.Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";C:\Users\PcVIP\AppData\Local\Programs\Ollama", "User")
   ```
3. Reinicia VS Code.

### Si la IA no responde en la Web
1. Verifica que el **Servidor Backend** (Terminal 2) está corriendo y no tiene errores.
2. Verifica que el icono de **Ollama** aparece en la barra de tareas de Windows (junto al reloj).
3. Asegúrate de que el modelo `qwen2.5:3b` se haya descargado correctamente.
