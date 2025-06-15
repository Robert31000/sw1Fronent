// src/pages/Habitacion/CrearHabitacionForm.jsx

import React, { useState } from 'react'
import axios from 'axios'

export default function CrearHabitacionForm() {
  const [form, setForm] = useState({
    nombre: '',
    ancho: '',
    largo: '',
    alto: '',
    puertas: '',
    ventanas: '',
    materialPared: '',
    colorPiso: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        'http://localhost:8080/api/habitaciones',
        {
          nombre: form.nombre,
          ancho: parseFloat(form.ancho),
          largo: parseFloat(form.largo),
          alto: parseFloat(form.alto),
          puertas: parseInt(form.puertas, 10),
          ventanas: parseInt(form.ventanas, 10),
          materialPared: form.materialPared,
          colorPiso: form.colorPiso
        }
      )
      alert('Habitación guardada con éxito')
      console.log(response.data)
      // Opcional: limpiar formulario tras guardar
      setForm({
        nombre: '',
        ancho: '',
        largo: '',
        alto: '',
        puertas: '',
        ventanas: '',
        materialPared: '',
        colorPiso: ''
      })
    } catch (error) {
      console.error(error)
      alert('Error al guardar habitación')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Crear Habitación</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="border p-2 rounded"
          />

          <input
            name="ancho"
            value={form.ancho}
            onChange={handleChange}
            placeholder="Ancho (m)"
            type="number"
            step="0.01"
            className="border p-2 rounded"
          />

          <input
            name="largo"
            value={form.largo}
            onChange={handleChange}
            placeholder="Largo (m)"
            type="number"
            step="0.01"
            className="border p-2 rounded"
          />

          <input
            name="alto"
            value={form.alto}
            onChange={handleChange}
            placeholder="Alto (m)"
            type="number"
            step="0.01"
            className="border p-2 rounded"
          />

          <input
            name="puertas"
            value={form.puertas}
            onChange={handleChange}
            placeholder="Cantidad de puertas"
            type="number"
            className="border p-2 rounded"
          />

          <input
            name="ventanas"
            value={form.ventanas}
            onChange={handleChange}
            placeholder="Cantidad de ventanas"
            type="number"
            className="border p-2 rounded"
          />

          <input
            name="materialPared"
            value={form.materialPared}
            onChange={handleChange}
            placeholder="Material pared"
            className="border p-2 rounded"
          />

          <input
            name="colorPiso"
            value={form.colorPiso}
            onChange={handleChange}
            placeholder="Color piso"
            className="border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Guardar Habitación
        </button>
      </form>
    </div>
  )
}
