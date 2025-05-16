import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusSquare, LayoutGrid, MessageCircle, ShoppingCart, User } from 'lucide-react';

const menuItems = [
  { label: 'Inicio', icon: <Home size={20} />, to: '/dashboard' },
  { label: 'Crear Habitación', icon: <PlusSquare size={20} />, to: '/dashboard/crear' },
  { label: 'Catálogo', icon: <LayoutGrid size={20} />, to: '/dashboard/catalogo' },
  { label: 'Asistente IA', icon: <MessageCircle size={20} />, to: '/dashboard/asistente' },
  { label: 'Presupuestos', icon: <ShoppingCart size={20} />, to: '/dashboard/presupuestos' },
  { label: 'Perfil', icon: <User size={20} />, to: '/dashboard/perfil' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-sky-900 shadow-lg h-screen sticky top-0 flex flex-col text-white">
      <div className="px-6 py-4 text-2xl font-bold text-blue-600">Panel</div>

      <nav className="flex-1 px-4 space-y-2 text-white mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-blue-400 transition ${
              location.pathname === item.to ? 'bg-blue-500 font-semibold' : 'text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t">
        <button className="w-full text-left text-sm text-white hover:text-red-600 transition">Cerrar sesión</button>
      </div>
    </aside>
  );
}
