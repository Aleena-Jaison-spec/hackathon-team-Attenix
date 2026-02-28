# hackathon-team-Attenix

This project includes a simple frontend simulating an IVR and a Node.js backend that offers two endpoints:

* **POST /tts** – converts text to speech using Amazon Polly.
* **POST /ai** – forwards messages to the Groq AI API to receive a text reply.

## Getting started

1. Copy `.env.sample` to `.env` (create one if it doesn't exist) and fill in your credentials:
   ```env
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   AWS_REGION=ap-south-1
   GROQ_API_KEY=...
   GROQ_MODEL=llama3-70b  # set to a model your key can access
   ```
2. `cd backend && npm install` to install dependencies.
3. Start the server:
   ```bash
   cd backend
   node server.js
   ```
4. Open `index.html` in a browser and use the demo UI. The frontend hits `http://localhost:3000/ai` and `/tts`.

## Troubleshooting

* **TTS errors or silent audio** – make sure the voice (Aditi) supports the chosen engine. The server defaults to the standard engine and logs request parameters. Check backend logs for `TTS request` and `TTS error` messages.
* **AI errors / 500 responses** – the Groq API will return a `404 model_not_found` or similar if your key doesn’t have access to the requested model. Models suffixed with `guard` or `safeguard` are safety‑filtered and will usually reply with the word “safe”. To get full conversational output choose a **non‑guard** model (for example `mixtral-8x7b-32768`, `gemma-7b`, `llama3-70b-8k` etc.) that your key has permission to use. Visit your [Groq console](https://console.groq.com/keys) to see the list of available models and set `GROQ_MODEL` in `.env` accordingly. If you get a guard‑style reply, switch models and restart the server.
* Use the provided `backend/test.js` script to exercise endpoints locally (`node test.js`). It will attempt several models and report which ones succeed; the message printed is the same one that will be forwarded to clients.

### Running the frontend

The UI is a static HTML/JS demo that simulates a simple IVR call flow. The interaction works as follows:

1. When the page loads you land on the welcome screen – click **Start Demo** to begin.
2. The IVR greets you with a welcome message and asks you to choose a language by pressing `1` (English), `2` (हिंदी) or `3` (മലയാളം) on the dial pad.
3. After selecting a language you are shown the main menu. For example, in English you can press `1` for Crop Advice, `2` for Weather Alerts or `3` for Market Prices. The system speaks the options using Amazon Polly.
4. Upon choosing a menu item the system will prompt you with several questions:
   * **Text questions** (e.g. "Enter your district name") pop up a browser prompt where you can type an answer.
   * **Choice questions** present numerical options; respond by pressing the corresponding key on the dial pad.
   * All prompts and option labels are displayed and spoken in the selected language.
5. Once the last question has been answered the IVR plays a thank‑you message and the frontend sends a summary of your responses to the `/ai` endpoint. The Groq AI API reply is appended to the chat and read aloud – this represents an intelligent follow‑up from the system.

You can restart the session at any time by pressing `#` to end the call and then clicking **Back** on the screen to return to the landing page.

There are two simple ways to open the frontend:

1. **Open directly in your browser** – double‑click `index.html` or drag it into a browser window. The demo will run, but some browsers (Chrome) may block `fetch` calls due to CORS when using the `file://` protocol. In that case use option 2.

2. **Serve with a local web server** (recommended):
   ```bash
   cd "c:/Users/Mohammed Shamil/OneDrive/Desktop/PRAYAN/hackathon-team-Attenix"
   # using Node's built-in http-server (install globally if needed):
   npx http-server -c-1 -p 8080
   # or Python 3:
   # python -m http.server 8080
   ```
   Then open http://localhost:8080 in your browser.

The frontend makes requests to `http://localhost:3000/ai` and `/tts`, so ensure the backend is running and accessible.

For any other issues, inspect console output in both browser and backend.