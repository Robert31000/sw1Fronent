import React from 'react';
import { PlusSquare, MessageCircle, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const actions = [
  {
    label: 'Crear Habitación',
    icon: <PlusSquare size={20} />,
    to: '/dashboard/crear',
    bg: 'bg-blue-100',
    hover: 'hover:bg-blue-200',
  },
  {
    label: 'Asistente IA',
    icon: <MessageCircle size={20} />,
    to: '/dashboard/asistente',
    bg: 'bg-green-100',
    hover: 'hover:bg-green-200',
  },
  {
    label: 'Ver Catálogo',
    icon: <LayoutGrid size={20} />,
    to: '/dashboard/catalogo',
    bg: 'bg-yellow-100',
    hover: 'hover:bg-yellow-200',
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => navigate(action.to)}
          className={`flex items-center justify-between w-full p-4 rounded-lg ${action.bg} ${action.hover} transition`}
        >
          <div className="flex items-center gap-3">
            {action.icon}
            <span className="font-semibold text-gray-700">{action.label}</span>
          </div>
          <span className="text-sm text-gray-500">Ir</span>
        </button>
      ))}
    </div>
  );
}
