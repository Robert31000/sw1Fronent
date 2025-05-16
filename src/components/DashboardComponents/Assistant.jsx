import React, { useState } from 'react';
import ChatMessage from '@/components/assistant/ChatMessage';
import ChatInput from '@/components/assistant/ChatInput';

export default function Assistant() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: '¡Hola! ¿Qué habitación deseas diseñar hoy?' }
  ]);

  const handleSend = (text) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { from: 'user', text }];

    setMessages(newMessages);

    // Simulación de respuesta (puedes conectar a OpenAI aquí)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: `Entiendo. ¿Qué estilo te gustaría para esa habitación?` }
      ]);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Asistente de Diseño con IA</h2>
      <div className="bg-white rounded-lg shadow p-4 h-[500px] overflow-y-auto space-y-3">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} from={msg.from} text={msg.text} />
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}
