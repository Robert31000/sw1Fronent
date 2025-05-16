import React from 'react';
import { Bell, HelpCircle, UserCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-10">
      {/* Izquierda: Título del sistema o breadcrumb */}
      <h1 className="text-xl font-semibold text-gray-800">¡Bienvenido, usuario!</h1>

      {/* Derecha: Acciones */}
      <div className="flex items-center gap-4">
        {/* Botón de ayuda */}
        <button className="text-gray-500 hover:text-blue-600 transition">
          <HelpCircle size={20} />
        </button>

        {/* Notificaciones */}
        <button className="relative text-gray-500 hover:text-blue-600 transition">
          <Bell size={20} />
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Perfil */}
        <div className="flex items-center gap-2">
          <UserCircle size={28} className="text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Usuario</span>
        </div>
      </div>
    </header>
  );
}
