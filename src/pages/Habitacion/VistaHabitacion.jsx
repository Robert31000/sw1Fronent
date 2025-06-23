// src/pages/Habitacion/VistaHabitacion.jsx

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
// import { furnitureCatalog } from "./dataroom/furnitureCatalog";
import Room2DView from './Room2DView'
import Room2DEditor from './Room2DEditor';
import RoomCustomizationPanel from "./RoomCustomizationPanel";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { furnitureCatalog } from './dataroom/furnitureCatalog';

export default function VistaHabitacion() {
  const navigate = useNavigate()

  // Estado de muebles y selección
  const [furniture, setFurniture] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // Objeto ejemplo con datos "hard-coded"
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

  // Drag & drop para catálogo visual
  const [draggedCatalogItem, setDraggedCatalogItem] = useState(null);

  function handleCatalogDragStart(item) {
    setDraggedCatalogItem(item);
  }

  function handleCatalogDragEnd() {
    setDraggedCatalogItem(null);
  }

  function handleRoomDrop(e) {
    e.preventDefault();
    if (!draggedCatalogItem) return;
    // Calcula posición relativa al SVG
    const svgRect = document.getElementById('room2d-svg').getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left - 20; // padding
    const mouseY = e.clientY - svgRect.top - 20;
    const x = mouseX / 70; // escala
    const y = mouseY / 70;
    const width = draggedCatalogItem.ancho || draggedCatalogItem.width || 1;
    const height = draggedCatalogItem.largo || draggedCatalogItem.height || 0.5;
    setFurniture([
      ...furniture,
      {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        nombre: draggedCatalogItem.nombre || draggedCatalogItem.name,
        tipo: draggedCatalogItem.tipo || draggedCatalogItem.type || 'otro',
        x,
        y,
        width,
        height,
      },
    ]);
    setDraggedCatalogItem(null);
  }

  // Exportar a imagen
  async function handleExportImage() {
    const svg = document.getElementById('room2d-svg');
    if (!svg) return;
    const canvas = await html2canvas(svg.parentNode, { backgroundColor: null });
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'habitacion.png';
    link.href = dataURL;
    link.click();
  }

  // Exportar a PDF
  async function handleExportPDF() {
    const svg = document.getElementById('room2d-svg');
    if (!svg) return;
    const canvas = await html2canvas(svg.parentNode, { backgroundColor: null });
    const dataURL = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
    pdf.addImage(dataURL, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('habitacion.pdf');
  }

  return (
    <div className="mt-4">
      {/* Título y botón "Volver" */}
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
              onClick={() => {}}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Agregar Muebles
            </button>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* ÁREA 2D + CATÁLOGO VISUAL */}
        {/* -------------------------------------------------- */}
        <div className="col-span-2 flex">
          {/* Panel central: Vista 2D y edición */}
          <div className="flex-1 bg-white shadow rounded-lg p-6 flex flex-col relative">
            <h3 className="text-xl font-semibold mb-4">Vista 2D de la Habitación</h3>
            {/* Botones de exportación */}
            <div className="mb-2 flex gap-2">
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 shadow"
                onClick={handleExportImage}
              >
                Exportar como imagen
              </button>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 shadow"
                onClick={handleExportPDF}
              >
                Exportar como PDF
              </button>
            </div>
            {/* Área de drop para muebles */}
            <div
              className="flex-1 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center"
              onDragOver={e => e.preventDefault()}
              onDrop={handleRoomDrop}
            >
              <Room2DView
                room={{ ancho: habitacion.ancho, largo: habitacion.largo }}
                furniture={furniture}
                setFurniture={setFurniture}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                scale={70}
              />
            </div>
            {/* Panel de edición de mueble seleccionado */}
            {selectedId && (() => {
              const selected = furniture.find(f => f.id === selectedId);
              if (!selected) return null;
              function handleChange(e) {
                const { name, value } = e.target;
                setFurniture(furniture.map(f =>
                  f.id === selectedId
                    ? { ...f, [name]: name === 'width' || name === 'height' || name === 'x' || name === 'y'
                        ? parseFloat(value)
                        : value }
                    : f
                ));
              }
              function handleDelete() {
                setFurniture(furniture.filter(f => f.id !== selectedId));
                setSelectedId(null);
              }
              return (
                <div className="my-2 p-3 bg-gray-100 rounded shadow max-w-md">
                  <div className="font-semibold mb-2 flex items-center justify-between">
                    Editar mueble seleccionado
                    <button
                      className="ml-2 text-xs text-red-600 hover:underline"
                      onClick={handleDelete}
                    >
                      Eliminar
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-xs col-span-2">
                      Nombre
                      <input
                        className="w-full border rounded px-2 py-1 text-xs"
                        name="nombre"
                        value={selected.nombre}
                        onChange={handleChange}
                      />
                    </label>
                    <label className="text-xs">
                      Tipo
                      <select
                        className="w-full border rounded px-2 py-1 text-xs"
                        name="tipo"
                        value={selected.tipo}
                        onChange={handleChange}
                      >
                        <option value="sofa">Sofá</option>
                        <option value="mesa">Mesa</option>
                        <option value="silla">Silla</option>
                        <option value="cama">Cama</option>
                        <option value="armario">Armario</option>
                        <option value="otro">Otro</option>
                      </select>
                    </label>
                    <label className="text-xs">
                      Ancho (m)
                      <input
                        className="w-full border rounded px-2 py-1 text-xs"
                        name="width"
                        type="number"
                        min="0.1"
                        step="0.01"
                        value={selected.width}
                        onChange={handleChange}
                      />
                    </label>
                    <label className="text-xs">
                      Alto (m)
                      <input
                        className="w-full border rounded px-2 py-1 text-xs"
                        name="height"
                        type="number"
                        min="0.1"
                        step="0.01"
                        value={selected.height}
                        onChange={handleChange}
                      />
                    </label>
                    <label className="text-xs">
                      X (m)
                      <input
                        className="w-full border rounded px-2 py-1 text-xs"
                        name="x"
                        type="number"
                        min="0"
                        step="0.01"
                        value={selected.x}
                        onChange={handleChange}
                      />
                    </label>
                    <label className="text-xs">
                      Y (m)
                      <input
                        className="w-full border rounded px-2 py-1 text-xs"
                        name="y"
                        type="number"
                        min="0"
                        step="0.01"
                        value={selected.y}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                </div>
              );
            })()}
          </div>
          {/* Panel lateral derecho: Catálogo visual */}
          <div className="w-56 bg-white border-l border-gray-200 p-2 overflow-y-auto ml-4 rounded-lg shadow flex flex-col">
            <div className="font-semibold text-gray-700 mb-2 text-center">Catálogo de muebles</div>
            <div className="flex flex-col gap-2">
              {furnitureCatalog.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center p-2 border rounded hover:bg-blue-50 cursor-grab"
                  draggable
                  onDragStart={() => handleCatalogDragStart(item)}
                  onDragEnd={handleCatalogDragEnd}
                  style={{ opacity: draggedCatalogItem?.id === item.id ? 0.5 : 1 }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.nombre || item.name}
                      className="w-16 h-16 object-contain mb-1"
                      draggable={false}
                    />
                  ) : (
                    <div
                      className="w-16 h-16 flex items-center justify-center mb-1 rounded"
                      style={{ background: item.color || "#eee" }}
                    >
                      <span className="text-xs text-gray-600">{item.nombre || item.name}</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-800 text-center">
                    {item.nombre || item.name}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {item.ancho || item.width ? `${item.ancho || item.width}m` : ""}{" "}
                    {item.largo || item.height ? `× ${item.largo || item.height}m` : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
