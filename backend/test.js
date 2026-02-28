import axios from 'axios';
import fs from 'fs';

import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import dotenv from "dotenv";

dotenv.config();

async function testPollyDirect() {
  try {
    const polly = new PollyClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    const cmd = new SynthesizeSpeechCommand({
      Text: "Hello from direct test",
      OutputFormat: "mp3",
      VoiceId: "Aditi",
      // not specifying engine since Aditi doesn't support neural
    });
    const data = await polly.send(cmd);
    console.log('Polly output keys:', Object.keys(data));
    if (data.AudioStream && typeof data.AudioStream.transformToByteArray === 'function') {
      const audioStream = await data.AudioStream.transformToByteArray();
      console.log('Converted to byte array, length', audioStream.length);
    } else {
      console.log('AudioStream type', typeof data.AudioStream, data.AudioStream);
    }
  } catch (err) {
    console.error('direct polly error', err);
  }
}

async function test() {
  try {
    const ttsRes = await axios.post('http://localhost:3000/tts', { text: 'Hello world' }, { responseType: 'arraybuffer' });
    fs.writeFileSync('test.mp3', Buffer.from(ttsRes.data));
    console.log('Saved tts audio');
  } catch(err) { console.error('tts error', err.response?.data || err.message); }

  try {
    const aiRes = await axios.post('http://localhost:3000/ai', { message:'Test message' });
    console.log('AI response', aiRes.data);
  } catch(err) { console.error('ai error', err.response?.data || err.message); }

  // direct Groq call for debug: try several candidate models
  // include a mix of guard and non-guard models; server .env controls which one is used
  const candidates = [
    'gpt-4o-mini',
    'groq-1.5',
    'llama2-70b',
    'llama3-70b',
    'openai/gpt-oss-safeguard-20b',
    'meta-llama/llama-guard-4-12b',
    // some commonly available non-guard models - replace with ones you see in your
    // Groq dashboard if they are accessible to your key.
    'mixtral-8x7b-32768',
    'gemma-7b',
    'gpt-4o-mini-1.5',
    'llama3-70b-8k' // example; adjust as necessary
  ];
  for (const model of candidates) {
    try {
      console.log('trying direct model', model);
      const direct = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model,
          messages: [
            { role: 'system', content: 'Test system role' },
            { role: 'user', content: 'Hello from direct test' }
          ]
        },
        { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } }
      );
      console.log('direct groq success', model, direct.data);
      break;
    } catch (err) {
      console.error('direct groq error', model, err.response?.status, err.response?.data || err.message);
    }
  }
}

await testPollyDirect();
await test();
