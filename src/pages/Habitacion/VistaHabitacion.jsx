// src/pages/Habitacion/VistaHabitacion.jsx

import React from 'react'
import { useNavigate } from 'react-router-dom'
import Room2DView from './Room2DView'

export default function VistaHabitacion() {
  const navigate = useNavigate()

  // Objeto ejemplo con datos “hard-coded”
  const habitacion = {
    id: 1,
    nombre: 'Sala de Estar Ejemplo',
    ancho: 5,
    largo: 4,
    alto: 3,
    puertas: 1,
    ventanas: 2,
    materialPared: 'Yeso Blanco',
    colorPiso: 'Madera Natural'
  }

  return (
    <div className="mt-4">
      {/* Título y botón “Volver” */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Vista de Habitación: {habitacion.nombre}
        </h2>
        <button
          onClick={() => navigate('/dashboard/crear')}
          className="text-sm text-blue-600 hover:underline"
        >
          &larr; Volver a Crear
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* -------------------------------------------------- */}
        {/* CARD DE RESUMEN DE DATOS */}
        {/* -------------------------------------------------- */}
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold">Resumen de la Habitación</h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              <span className="font-medium">Dimensiones:</span>{' '}
              {habitacion.ancho} m × {habitacion.largo} m × {habitacion.alto} m
            </li>
            <li>
              <span className="font-medium">Puertas:</span> {habitacion.puertas}
            </li>
            <li>
              <span className="font-medium">Ventanas:</span> {habitacion.ventanas}
            </li>
            <li>
              <span className="font-medium">Material Pared:</span>{' '}
              {habitacion.materialPared}
            </li>
            <li>
              <span className="font-medium">Color Piso:</span> {habitacion.colorPiso}
            </li>
          </ul>

          <div className="pt-4 space-x-2">
            <button
              onClick={() => navigate('/dashboard/crear')}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              Editar Habitación
            </button>
            <button
              onClick={() => alert('Aquí iría la lógica para Agregar Muebles')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Agregar Muebles
            </button>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* ÁREA 2D / CANVAS (placeholder) */}
        {/* -------------------------------------------------- */}
        <div className="col-span-2 bg-white shadow rounded-lg p-6 flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Vista 2D de la Habitación</h3>
          <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
            {/* Aquí irá el canvas (react-konva, SVG, etc.) */}
            <Room2DView
              ancho={habitacion.ancho}
              largo={habitacion.largo}
              puertas={habitacion.puertas}
              ventanas={habitacion.ventanas}
              scale={70} // Puedes cambiar la escala a tu gusto
            />       
           </div>
        </div>
      </div>
    </div>
  )
}
