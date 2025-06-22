// src/components/RegisterForm.jsx
import React, { useState } from 'react';
import { register as registerService } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate= useNavigate()

  const handleChange = e => {
    const { name, value } = e.target;               // <- aquí el cambio
    
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async e => {
  e.preventDefault();
  console.log("⏳ Enviando datos:", formData);
  setLoading(true);
  try {
    const resp = await registerService(formData);
    console.log("✅ Respuesta del servidor:", resp);
    navigate('/auth/login')
    
  } catch (err) {
    console.error("❌ Error en registerService:", err);
    setError(err.response?.data?.mensaje || err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-2xl mb-4">Registro</h2>

      <input
        name="username"                            // ← debe coincidir con backend
        placeholder="Usuario"
        value={formData.username}
        onChange={handleChange}
        className="block mb-2 p-2 border w-full"
        disabled={loading}
      />

      <input
        name="email"
        placeholder="Correo"
        value={formData.email}
        onChange={handleChange}
        className="block mb-2 p-2 border w-full"
        disabled={loading}
      />

      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={handleChange}
        className="block mb-2 p-2 border w-full"
        disabled={loading}
      />

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Registrando…' : 'Registrar'}
      </button>
    </form>
  );
}
