import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const MODEL  = 'llama3-8b-8192';
const APIKEY = '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';

export default function ChatBox() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! ¿Qué habitación deseas diseñar hoy?' }
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);

    const prompt = text;
    setText('');

    try {
      const { data } = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        { model: MODEL, messages: [userMessage] },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${APIKEY}`,
          },
        }
      );
      const assistantMessage = { role: 'assistant', content: data.choices[0].message.content };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Groq error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '❌ Error con el servicio IA.' },
      ]);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4">
          <h1 className="text-2xl font-bold">Asistente IA</h1>
        </header>

        <main className="flex flex-col p-6 space-y-4 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg p-4 shadow h-[500px] overflow-y-auto space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[75%] text-sm whitespace-pre-wrap
                    ${msg.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Escribe tus preferencias..."
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Enviar
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
