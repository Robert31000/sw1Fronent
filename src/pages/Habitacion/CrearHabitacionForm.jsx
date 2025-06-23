import React, { useState } from 'react';
import { crearHabitacion } from '../../api/habitacion';

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
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      // parseamos numéricos antes de enviar
      const payload = {
        nombre: form.nombre,
        ancho: parseFloat(form.ancho),
        largo: parseFloat(form.largo),
        alto: parseFloat(form.alto),
        puertas: parseInt(form.puertas, 10),
        ventanas: parseInt(form.ventanas, 10),
        materialPared: form.materialPared,
        colorPiso: form.colorPiso
      };

      const nueva = await crearHabitacion(payload);
      alert(`Habitación "${nueva.nombre}" creada con ID ${nueva.id}`);
      // limpiamos
      setForm({
        nombre: '',
        ancho: '',
        largo: '',
        alto: '',
        puertas: '',
        ventanas: '',
        materialPared: '',
        colorPiso: ''
      });
    } catch (err) {
      console.error(err);
      alert('Error al guardar habitación');
    } finally {
      setLoading(false);
    }
  };

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
            disabled={loading}
          />
          <input
            name="ancho"
            value={form.ancho}
            onChange={handleChange}
            placeholder="Ancho (m)"
            type="number"
            step="0.01"
            className="border p-2 rounded"
            disabled={loading}
          />
          <input
            name="largo"
            value={form.largo}
            onChange={handleChange}
            placeholder="Largo (m)"
            type="number"
            step="0.01"
            className="border p-2 rounded"
            disabled={loading}
          />
          <input
            name="alto"
            value={form.alto}
            onChange={handleChange}
            placeholder="Alto (m)"
            type="number"
            step="0.01"
            className="border p-2 rounded"
            disabled={loading}
          />
          <input
            name="puertas"
            value={form.puertas}
            onChange={handleChange}
            placeholder="Puertas"
            type="number"
            className="border p-2 rounded"
            disabled={loading}
          />
          <input
            name="ventanas"
            value={form.ventanas}
            onChange={handleChange}
            placeholder="Ventanas"
            type="number"
            className="border p-2 rounded"
            disabled={loading}
          />
          <input
            name="materialPared"
            value={form.materialPared}
            onChange={handleChange}
            placeholder="Material de pared"
            className="border p-2 rounded"
            disabled={loading}
          />
          <input
            name="colorPiso"
            value={form.colorPiso}
            onChange={handleChange}
            placeholder="Color de piso"
            className="border p-2 rounded"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Guardando…' : 'Guardar Habitación'}
        </button>
      </form>
    </div>
  );
}
