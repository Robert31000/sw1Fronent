// server.js
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.GOOGLE_API_KEY
});

app.post('/api/chat', async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: req.body.messages
    });
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
