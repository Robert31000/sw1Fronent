// src/components/ChatBox.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios      from 'axios';
import { jsPDF }  from 'jspdf';
import { saveAs } from 'file-saver';
import JSZip      from 'jszip';

/* ====== Config ====== */
const MODEL   = 'gemini-2.0-flash';                 // 
const APIKEY  = 'AIzaSyBMgZFNy6rxIMvE2TTaXsdT6GspUUFWtek';   
const CHAT_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
//AIzaSyBMgZFNy6rxIMvE2TTaXsdT6GspUUFWtek

/* ====== Componente ====== */
export default function ChatBox({ projectId }) {
  const [text,     setText] = useState('');
  const [messages, setMsgs] = useState([]);         
  const endRef = useRef(null);

  /* --- auto-scroll --- */
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  /* --- Helpers --- */
  const fileToB64 = (file) =>
    new Promise((ok, err) => {
      const r = new FileReader();
      r.onload = () => ok(r.result);   // incluye “data:image/...;base64,”
      r.onerror = err;
      r.readAsDataURL(file);
    });

  /* --- Enviar texto --- */
  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim()) return;

    const userMsg = { id: crypto.randomUUID(), role: 'user', content: text };
    setMsgs((ms) => [...ms, userMsg]);
    setText('');

    try {
      const { data } = await axios.post(
        CHAT_URL,
        {
          model: MODEL,
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${APIKEY}`,
          },
        }
      );

      const reply = data.choices?.[0]?.message?.content ?? '[Sin respuesta]';
      setMsgs((ms) => [...ms, { id: crypto.randomUUID(), role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Gemini error:', err);
      setMsgs((ms) => [
        ...ms,
        { id: crypto.randomUUID(), role: 'assistant', content: '❌ Error con Gemini.' },
      ]);
    }
  };

  /* --- Enviar imagen --- */
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = ''; // reset para poder subir la misma foto de nuevo

    const b64 = await fileToB64(file);
    const photoPrompt = {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe la foto:' },
        { type: 'image_url', image_url: { url: b64 } },
      ],
    };

    // Muestra inmediatamente que el usuario envió una imagen
    setMsgs((ms) => [
      ...ms,
      { id: crypto.randomUUID(), role: 'user', content: '[Imagen adjunta]' },
    ]);

    try {
      const { data } = await axios.post(
        CHAT_URL,
        {
          model: MODEL,
          messages: [...messages, photoPrompt],
        },
        { headers: { Authorization: `Bearer ${APIKEY}` } }
      );

      const reply = data.choices?.[0]?.message?.content ?? '[Sin respuesta]';
      setMsgs((ms) => [...ms, { id: crypto.randomUUID(), role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Gemini error (img):', err);
      setMsgs((ms) => [
        ...ms,
        { id: crypto.randomUUID(), role: 'assistant', content: '❌ Error con la imagen.' },
      ]);
    }
  };

  /* --- Exportar PDF --- */
  const handleExportPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 40;
    doc.setFontSize(14).text('Conversación', 40, 30);
    messages.forEach((m) => {
      const lines = doc.splitTextToSize(
        `${m.role === 'user' ? 'Yo:' : 'Asistente:'} ${m.content}`,
        500
      );
      doc.setFontSize(11).text(lines, 40, y);
      y += lines.length * 18;
      if (y > 770) {
        doc.addPage();
        y = 40;
      }
    });
    doc.save('chat.pdf');
  };

  /* --- ZIP de proyecto Flutter --- */
  const toNullSafeLogin = (code) => {
    let out = code;
    out = out.replace(/String _username, _password;/, "String _username = '';\n  String _password = '';");
    out = out.replace(/value\.isEmpty/g, 'value == null || value.isEmpty');
    out = out.replace(/onSaved: \(value\) => _username = value,/g, 'onSaved: (value) => _username = value!.trim(),');
    out = out.replace(/onSaved: \(value\) => _password = value,/g, 'onSaved: (value) => _password = value!.trim(),');
    out = out.replace(/_formKey\.currentState\.validate\(\)/g, '_formKey.currentState!.validate()');
    out = out.replace(/_formKey\.currentState\.save\(\)/g, '_formKey.currentState!.save()');
    return out;
  };

  const handleDownloadFlutter = async () => {
    const assistantText = messages
      .filter((m) => m.role === 'assistant')
      .map((m) => m.content)
      .join('\n');
    const regex = /```dart([\s\S]*?)```/g;
    const snippets = [];
    let match;
    while ((match = regex.exec(assistantText))) snippets.push(match[1].trim());
    if (!snippets.length) return alert('Sin código Dart en la conversación');

    let mainCode = snippets[0];
    let loginCode = snippets.length > 1 ? snippets[1] : '';
    mainCode = mainCode.replace(/import 'package:[^']+login_screen[^']+';/, "import 'login_screen.dart';");
    if (!/runApp\(const/.test(mainCode) && /runApp/.test(mainCode)) {
      mainCode = mainCode.replace(/runApp\(/, 'runApp(const ');
    }
    if (loginCode) loginCode = toNullSafeLogin(loginCode);

    const zip = new JSZip();
    const root = zip.folder('flutter_app');
    root.file(
      'pubspec.yaml',
      `name: flutter_app
version: 1.0.0+1
description: Export from Chat
publish_to: 'none'
environment:
  sdk: ">=2.17.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter

flutter:
  uses-material-design: true`
    );

    const lib = root.folder('lib');
    lib.file('main.dart', mainCode + '\n');
    if (loginCode) lib.file('login_screen.dart', loginCode + '\n');
    for (let i = 2; i < snippets.length; i++) lib.file(`page_${i - 1}.dart`, snippets[i] + '\n');

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'flutter_app.zip');
  };

  /* --- UI --- */
  return (
    <div className="flex flex-col w-80 h-96 bg-white rounded-xl border shadow">
      <header className="bg-blue-600 text-white text-center py-2 rounded-t-xl">
        Chat Asistencia
      </header>

      {/* Historial */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50 text-sm">
        {messages.map((m) => (
          <p key={m.id} className={m.role === 'user' ? 'text-blue-700' : 'text-green-700'}>
            <b>{m.role === 'user' ? 'Yo' : 'Asistente'}:</b> {m.content}
          </p>
        ))}
        <div ref={endRef} />
      </div>

      {/* Entrada de texto */}
      <form onSubmit={handleSend} className="flex border-t">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe y presiona Enter…"
          className="flex-1 resize-none p-2 text-sm outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4">
          Enviar
        </button>
      </form>

      {/* Botones extra */}
      <div className="flex">
        <button onClick={handleExportPDF} className="flex-1 p-2 bg-red-600 text-white text-center">
          PDF
        </button>
        <button
          onClick={handleDownloadFlutter}
          className="flex-1 p-2 bg-green-600 text-white text-center rounded-br-xl"
        >
          Flutter ZIP
        </button>
      </div>

      {/* Subir imagen */}
      <label className="mt-2 self-start ml-3 px-3 py-1 cursor-pointer bg-purple-600 text-white rounded">
        📷 Imagen
        <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
      </label>
    </div>
  );
}