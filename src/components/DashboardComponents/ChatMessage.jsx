import React from 'react';

export default function ChatMessage({ from, text }) {
  const isUser = from === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`px-4 py-2 rounded-lg max-w-[75%] text-sm
        ${isUser ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
        {text}
      </div>
    </div>
  );
}
