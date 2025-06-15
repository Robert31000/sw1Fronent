// src/components/DashboardComponents/Sidebar.jsx

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  PlusSquare,
  LayoutGrid,
  MessageCircle,
  ShoppingCart,
  User,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

export default function Sidebar() {
  const location = useLocation()
  // Estado para saber qué menú principal está abierto (por ejemplo: 'Habitación')
  const [openMenu, setOpenMenu] = useState(null)

  // Lista de ítems del sidebar. Si un ítem tiene "children", aparecerá como un dropdown.
  const menuItems = [
    {
      label: 'Inicio',
      icon: <Home size={20} />,
      to: '/dashboard'
    },
    {
      label: 'Habitación',
      icon: <PlusSquare size={20} />,
      // No pondremos `to` aquí, porque al hacer clic en “Habitación” abriremos el dropdown,
      // y los sub-ítems tendrán sus propias rutas.
      children: [
        {
          label: 'Crear Habitación',
          to: '/dashboard/crear'
        },
        {
          label: 'Vista de Habitación',
          to: '/dashboard/vista'
        }
      ]
    },
    {
      label: 'Catálogo',
      icon: <LayoutGrid size={20} />,
      children: [
        { label: 'Muebles', to: '/dashboard/catalogo/muebles' },
        { label: 'Iluminación', to: '/dashboard/catalogo/iluminacion' },
        { label: 'Decoración', to: '/dashboard/catalogo/decoracion' }
      ]
    },
    {
      label: 'Asistente IA',
      icon: <MessageCircle size={20} />,
      to: '/dashboard/asistente'
    },
    {
      label: 'Presupuestos',
      icon: <ShoppingCart size={20} />,
      to: '/dashboard/presupuestos'
    },
    {
      label: 'Perfil',
      icon: <User size={20} />,
      to: '/dashboard/perfil'
    }
  ]

  // Función para alternar un submenú abierto
  const toggleMenu = (label) => {
    setOpenMenu((prev) => (prev === label ? null : label))
  }

  return (
    <aside className="w-64 bg-sky-900 shadow-lg h-screen sticky top-0 flex flex-col text-white">
      <div className="px-6 py-4 text-2xl font-bold text-blue-600">Panel</div>

      <nav className="flex-1 px-4 space-y-2 text-white mt-4">
        {menuItems.map((item) => {
          // Si el ítem tiene sub-ítems:
          if (item.children) {
            const isOpen = openMenu === item.label
            // Queremos saber si la ruta activa está dentro de alguno de los children
            const anyChildActive = item.children.some(
              (sub) => location.pathname === sub.to
            )

            return (
              <div key={item.label} className="space-y-1">
                {/* Botón principal que abre/colapsa el dropdown */}
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-md 
                    transition
                    ${anyChildActive || isOpen
                      ? 'bg-blue-500 font-semibold'
                      : 'hover:bg-blue-400'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>

                {/* Submenú (solo si está abierto) */}
                {isOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.to}
                        className={`block px-4 py-1 rounded-md transition
                          ${location.pathname === sub.to
                            ? 'bg-blue-500 font-semibold'
                            : 'hover:bg-blue-300 text-white'}
                        `}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          // Ítem sin children: renderizamos un Link simple
          const isActive = location.pathname === item.to
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition
                ${isActive ? 'bg-blue-500 font-semibold' : 'hover:bg-blue-400 text-white'}
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t">
        <button className="w-full text-left text-sm text-white hover:text-red-600 transition">
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
