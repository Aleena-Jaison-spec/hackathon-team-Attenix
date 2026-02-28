import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// 🎤 Amazon Polly setup
const polly = new PollyClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


// 🎤 TEXT → SPEECH ROUTE
app.post("/tts", async (req, res) => {
  try {
    console.log('TTS request', req.body);
    const { text } = req.body;

    const commandParams = {
      Text: text,
      OutputFormat: "mp3",
      VoiceId: "Aditi",
      // Engine intentionally omitted for compatibility (Aditi doesn't support neural)
    };
    console.log('Polly command params', commandParams);
    const command = new SynthesizeSpeechCommand(commandParams);

    const data = await polly.send(command);

    // AWS SDK v3 returns a stream; convert to buffer
    let audioStream;
    if (data.AudioStream && typeof data.AudioStream.transformToByteArray === 'function') {
      audioStream = await data.AudioStream.transformToByteArray();
    } else if (data.AudioStream) {
      // fallback: collect stream manually
      const chunks = [];
      for await (const chunk of data.AudioStream) {
        chunks.push(chunk);
      }
      audioStream = Buffer.concat(chunks);
    }

    res.set("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audioStream));

  } catch (err) {
    console.error('TTS error', err.response?.data || err.message || err);
    res.status(500).send("TTS error");
  }
});


// 🤖 GROQ AI ROUTE
app.post("/ai", async (req, res) => {
  try {
    console.log('AI request', req.body);
    const { message } = req.body;

    const model = process.env.GROQ_MODEL || "llama3-70b";
    console.log('Using Groq model', model);
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model,
        messages: [
          {
            role: "system",
            content: "You are Krishi AI helping Indian farmers with agriculture advice."
          },
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content || response.data;
    res.send(reply);

  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data;
    console.error('AI error', status, data || err.message || err);
    console.error(err.stack);
    // also persist errors to disk for later inspection
    try {
      const fs = await import('fs');
      const logEntry = { time: new Date().toISOString(), status, data, message: err.message, stack: err.stack };
      fs.appendFileSync('ai-error.log', JSON.stringify(logEntry) + '\n');
    } catch(e) {
      console.error('failed to write ai-error.log', e);
    }
    // forward Groq error message when possible for easier debugging
    if (data && data.error && data.error.message) {
      return res.status(status || 500).send(data.error.message);
    }
    // temporarily send stack trace to client for visibility
    res.status(status || 500).send(err.stack || "AI error");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));

// reminder: set GROQ_MODEL in your .env to a model your key can access (e.g. "llama3-70b-8192" before it was decommissioned).
// see https://console.groq.com/docs/deprecations for current models.
