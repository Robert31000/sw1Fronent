import React, { useState } from 'react';
import Room3D from './Room3D';
import FurnitureCatalogPanel from './FurnitureCatalogPanel';

export default function CrearHabitacion3D() {

    const handleMoveFurniture = (idx, newPosition) => {
        setFurniture((prev) =>
          prev.map((item, i) =>
            i === idx ? { ...item, position: newPosition } : item
          )
        );
      };

  // Función para descargar los muebles de la habitación
  const handleDownloadFurniture = () => {
    if (furniture.length === 0) {
      alert('No hay muebles en la habitación para descargar');
      return;
    }

    try {
      // Crear objeto con los datos de los muebles
      const furnitureData = {
        furniture: furniture,
        downloadDate: new Date().toISOString(),
        totalItems: furniture.length,
        roomInfo: {
          width: room.width,
          height: room.height,
          depth: room.depth
        }
      };

      // Convertir a JSON
      const jsonString = JSON.stringify(furnitureData, null, 2);
      
      console.log('Datos a descargar:', furnitureData);
      console.log('JSON string length:', jsonString.length);
      
      // Crear blob y descargar
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `muebles-habitacion-${new Date().toISOString().split('T')[0]}.json`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar URL después de un pequeño delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      
      console.log('Descarga iniciada');
    } catch (error) {
      console.error('Error al descargar:', error);
      alert('Error al descargar los muebles: ' + error.message);
    }
  };

  // Función para descargar los muebles de la habitación en CSV
  const handleDownloadFurnitureCSV = () => {
    if (furniture.length === 0) {
      alert('No hay muebles en la habitación para descargar');
      return;
    }

    try {
      // Crear encabezados CSV
      const headers = ['Tipo', 'Posición X', 'Posición Y', 'Posición Z', 'Tamaño', 'Color', 'Modelo'];
      const csvRows = [headers.join(',')];
      
      // Agregar datos de cada mueble
      furniture.forEach(item => {
        const row = [
          item.type || 'N/A',
          item.position?.[0] || 0,
          item.position?.[1] || 0,
          item.position?.[2] || 0,
          item.size ? `[${item.size.join(',')}]` : 'N/A',
          item.color || 'N/A',
          item.modelPath || 'N/A'
        ];
        csvRows.push(row.join(','));
      });
      
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `muebles-habitacion-${new Date().toISOString().split('T')[0]}.csv`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      
      console.log('Descarga CSV iniciada');
    } catch (error) {
      console.error('Error al descargar CSV:', error);
      alert('Error al descargar los muebles en CSV: ' + error.message);
    }
  };

  // Función para descargar los archivos .glb de los muebles
  const handleDownloadGLBModels = async () => {
    if (furniture.length === 0) {
      alert('No hay muebles en la habitación para descargar');
      return;
    }

    try {
      // Filtrar solo muebles que tienen modelos 3D
      const furnitureWithModels = furniture.filter(item => item.modelUrl || item.modelPath);
      
      if (furnitureWithModels.length === 0) {
        alert('No hay muebles con modelos 3D para descargar');
        return;
      }

      console.log('Descargando modelos 3D:', furnitureWithModels);

      // Descargar cada modelo individualmente
      for (const item of furnitureWithModels) {
        const modelUrl = item.modelUrl || item.modelPath;
        const fileName = modelUrl.split('/').pop(); // Obtener nombre del archivo
        
        try {
          const response = await fetch(modelUrl);
          if (!response.ok) {
            console.warn(`No se pudo descargar ${fileName}: ${response.statusText}`);
            continue;
          }
          
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.style.display = 'none';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 100);
          
          console.log(`Modelo descargado: ${fileName}`);
          
          // Pequeña pausa entre descargas
          await new Promise(resolve => setTimeout(resolve, 200));
          
        } catch (error) {
          console.error(`Error descargando ${fileName}:`, error);
        }
      }
      
      alert(`Descarga completada. Se descargaron ${furnitureWithModels.length} modelos 3D.`);
      
    } catch (error) {
      console.error('Error al descargar modelos:', error);
      alert('Error al descargar los modelos 3D: ' + error.message);
    }
  };

  // Función para crear un archivo ZIP con todos los modelos
  const handleDownloadAllAsZip = async () => {
    if (furniture.length === 0) {
      alert('No hay muebles en la habitación para descargar');
      return;
    }

    try {
      // Necesitamos importar JSZip dinámicamente
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Agregar el JSON con los datos
      const furnitureData = {
        furniture: furniture,
        downloadDate: new Date().toISOString(),
        totalItems: furniture.length,
        roomInfo: {
          width: room.width,
          height: room.height,
          depth: room.depth
        }
      };
      
      zip.file('muebles-data.json', JSON.stringify(furnitureData, null, 2));
      
      // Filtrar muebles con modelos 3D
      const furnitureWithModels = furniture.filter(item => item.modelUrl || item.modelPath);
      
      // Descargar y agregar modelos al ZIP
      for (const item of furnitureWithModels) {
        const modelUrl = item.modelUrl || item.modelPath;
        const fileName = modelUrl.split('/').pop();
        
        try {
          const response = await fetch(modelUrl);
          if (response.ok) {
            const blob = await response.blob();
            zip.file(`models/${fileName}`, blob);
            console.log(`Modelo agregado al ZIP: ${fileName}`);
          }
        } catch (error) {
          console.warn(`No se pudo agregar ${fileName} al ZIP:`, error);
        }
      }
      
      // Generar y descargar el ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `habitacion-completa-${new Date().toISOString().split('T')[0]}.zip`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      
      console.log('ZIP descargado con éxito');
      
    } catch (error) {
      console.error('Error al crear ZIP:', error);
      alert('Error al crear el archivo ZIP: ' + error.message);
    }
  };

  // Estado para la habitación
  const [room, setRoom] = useState({
    width: 5,
    height: 2.5,
    depth: 4,
    color: '#f5f5dc', // color de paredes
    wallMaterial: 'Yeso',
    floorColor: '#deb887',
    floorMaterial: 'Madera',
    doors: [],
    windows: [],
  });

  // Estado para los muebles
  const [furniture, setFurniture] = useState([
    {
      type: 'cube',
      size: [1, 0.5, 0.5],
      position: [1, 0.25, 1],
      rotation: [0, 0, 0],
      color: 'brown',
    },
  ]);

  // Estado para el formulario de mueble nuevo
  const [newFurniture, setNewFurniture] = useState({
    type: 'cube',
    size: [1, 0.5, 0.5],
    position: [0, 0.25, 0],
    rotation: [0, 0, 0],
    color: 'gray',
  });

  // Estado para el formulario de nueva puerta/ventana
  const [newDoor, setNewDoor] = useState({
    wall: 'back',
    x: 0,
    y: 0,
    width: 1,
    height: 2,
    material: 'Madera',
    color: '#b5651d',
  });
  const [newWindow, setNewWindow] = useState({
    wall: 'right',
    x: 0,
    y: 1,
    width: 1.2,
    height: 1,
    material: 'Vidrio',
    color: '#aeefff',
  });

  // Manejar cambios en el formulario de habitación
  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setRoom((prev) => ({
      ...prev,
      [name]: name === 'color' || name === 'wallMaterial' || name === 'floorMaterial' ? value : parseFloat(value),
    }));
  };

  // Manejar cambios en el formulario de mueble
  const handleFurnitureChange = (e) => {
    const { name, value } = e.target;
    setNewFurniture((prev) => ({
      ...prev,
      [name]: name === 'type' || name === 'color' ? value : parseFloat(value),
    }));
  };

  // Agregar mueble
  const handleAddFurniture = (e) => {
    e.preventDefault();
    setFurniture((prev) => [...prev, { ...newFurniture }]);
  };

  // Handlers para agregar puertas/ventanas
  const handleAddDoor = (e) => {
    e.preventDefault();
    setRoom((prev) => ({
      ...prev,
      doors: [...prev.doors, { ...newDoor }],
    }));
  };
  const handleAddWindow = (e) => {
    e.preventDefault();
    setRoom((prev) => ({
      ...prev,
      windows: [...prev.windows, { ...newWindow }],
    }));
  };

  // Handlers para eliminar puertas/ventanas
  const handleDeleteDoor = (idx) => {
    setRoom((prev) => ({
      ...prev,
      doors: prev.doors.filter((_, i) => i !== idx),
    }));
  };
  const handleDeleteWindow = (idx) => {
    setRoom((prev) => ({
      ...prev,
      windows: prev.windows.filter((_, i) => i !== idx),
    }));
  };

  // Manejar drop de mueble desde el catálogo
  const handleDropFurniture = (item, position) => {
    setFurniture(prev => [
      ...prev,
      {
        ...item,
        position,
        rotation: [0, 0, 0],
      }
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center drop-shadow">Diseña tu Habitación 3D</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel izquierdo: Configuración de la habitación y puertas/ventanas */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-indigo-600 mb-2">Habitación</h3>
          <form className="space-y-3">
            <div className="flex gap-2">
              <label className="flex flex-col text-sm font-medium text-gray-700">
                Ancho
                <input type="number" name="width" value={room.width} onChange={handleRoomChange} step="0.1" className="input input-bordered w-20 mt-1" />
              </label>
              <label className="flex flex-col text-sm font-medium text-gray-700">
                Alto
                <input type="number" name="height" value={room.height} onChange={handleRoomChange} step="0.1" className="input input-bordered w-20 mt-1" />
              </label>
              <label className="flex flex-col text-sm font-medium text-gray-700">
                Profundidad
                <input type="number" name="depth" value={room.depth} onChange={handleRoomChange} step="0.1" className="input input-bordered w-20 mt-1" />
              </label>
            </div>
            <div className="flex gap-2">
              <label className="flex flex-col text-sm font-medium text-gray-700">
                Color Pared
                <input type="color" name="color" value={room.color} onChange={handleRoomChange} className="w-10 h-8 mt-1 border-none" />
              </label>
              <label className="flex flex-col text-sm font-medium text-gray-700">
                Material Pared
                <select name="wallMaterial" value={room.wallMaterial} onChange={handleRoomChange} className="input input-bordered mt-1">
                  <option value="Yeso">Yeso</option>
                  <option value="Ladrillo">Ladrillo</option>
                  <option value="Madera">Madera</option>
                </select>
              </label>
            </div>
            <div className="flex gap-2">
              <label className="flex flex-col text-sm font-medium text-gray-700">
                Color Piso
                <input type="color" name="floorColor" value={room.floorColor} onChange={handleRoomChange} className="w-10 h-8 mt-1 border-none" />
              </label>
              <label className="flex flex-col text-sm font-medium text-gray-700">
                Material Piso
                <select name="floorMaterial" value={room.floorMaterial} onChange={handleRoomChange} className="input input-bordered mt-1">
                  <option value="Madera">Madera</option>
                  <option value="Cerámica">Cerámica</option>
                  <option value="Alfombra">Alfombra</option>
                </select>
              </label>
            </div>
          </form>

          <div className="border-t pt-4 mt-4">
            <h4 className="text-lg font-semibold text-indigo-600 mb-2">Puertas</h4>
            {/* Formulario para agregar puertas */}
            <form className="mb-2 flex gap-2 flex-wrap" onSubmit={handleAddDoor}>
              <span className="font-semibold">Agregar Puerta:</span>
              <label>
                Pared:
                <select name="wall" value={newDoor.wall} onChange={e => setNewDoor(d => ({ ...d, wall: e.target.value }))} className="ml-1">
                  <option value="back">Trasera</option>
                  <option value="front">Delantera</option>
                  <option value="left">Izquierda</option>
                  <option value="right">Derecha</option>
                </select>
              </label>
              <label>
                X/Z:
                <input type="number" value={newDoor.x} step="0.1" onChange={e => setNewDoor(d => ({ ...d, x: parseFloat(e.target.value) }))} className="w-16 ml-1" />
              </label>
              <label>
                Y:
                <input type="number" value={newDoor.y} step="0.1" onChange={e => setNewDoor(d => ({ ...d, y: parseFloat(e.target.value) }))} className="w-16 ml-1" />
              </label>
              <label>
                Ancho:
                <input type="number" value={newDoor.width} step="0.1" onChange={e => setNewDoor(d => ({ ...d, width: parseFloat(e.target.value) }))} className="w-16 ml-1" />
              </label>
              <label>
                Alto:
                <input type="number" value={newDoor.height} step="0.1" onChange={e => setNewDoor(d => ({ ...d, height: parseFloat(e.target.value) }))} className="w-16 ml-1" />
              </label>
              <label>
                Material:
                <select
                  value={newDoor.material}
                  onChange={e => setNewDoor(d => ({ ...d, material: e.target.value }))}
                  className="ml-1"
                >
                  <option value="Madera">Madera</option>
                  <option value="Metal">Metal</option>
                  <option value="Vidrio">Vidrio</option>
                  <option value="Personalizado">Personalizado</option>
                </select>
              </label>
              {newDoor.material === 'Personalizado' && (
                <label>
                  Color:
                  <input
                    type="color"
                    value={newDoor.color}
                    onChange={e => setNewDoor(d => ({ ...d, color: e.target.value }))}
                    className="ml-1"
                  />
                </label>
              )}
              <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">Agregar</button>
            </form>
            <ul className="mb-2">
              {room.doors.map((door, idx) => (
                <li key={idx} className="text-sm flex items-center gap-2">
                  Puerta en {door.wall} (x/z: {door.x}, y: {door.y}, ancho: {door.width}, alto: {door.height}, material: {door.material})
                  <button onClick={() => handleDeleteDoor(idx)} className="text-xs bg-red-500 text-white px-2 rounded">Eliminar</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t pt-4 mt-4">
            <h4 className="text-lg font-semibold text-indigo-600 mb-2">Ventanas</h4>
            {/* Formulario para agregar ventanas */}
            <form className="mb-2 flex gap-2 flex-wrap" onSubmit={handleAddWindow}>
              <span className="font-semibold">Agregar Ventana:</span>
              <label>
                Pared:
                <select name="wall" value={newWindow.wall} onChange={e => setNewWindow(w => ({ ...w, wall: e.target.value }))} className="ml-1">
                  <option value="back">Trasera</option>
                  <option value="front">Delantera</option>
                  <option value="left">Izquierda</option>
                  <option value="right">Derecha</option>
                </select>
              </label>
              <label>
                X/Z:
                <input type="number" value={newWindow.x} step="0.1" onChange={e => setNewWindow(w => ({ ...w, x: parseFloat(e.target.value) }))} className="w-16 ml-1" />
              </label>
              <label>
                Y:
                <input type="number" value={newWindow.y} step="0.1" onChange={e => setNewWindow(w => ({ ...w, y: parseFloat(e.target.value) }))} className="w-16 ml-1" />
              </label>
              <label>
                Ancho:
                <input type="number" value={newWindow.width} step="0.1" onChange={e => setNewWindow(w => ({ ...w, width: parseFloat(e.target.value) }))} className="w-16 ml-1" />
              </label>
              <label>
                Alto:
                <input type="number" value={newWindow.height} step="0.1" onChange={e => setNewWindow(w => ({ ...w, height: parseFloat(e.target.value) }))} className="w-16 ml-1" />
              </label>
              <label>
                Material:
                <select
                  value={newWindow.material}
                  onChange={e => setNewWindow(w => ({ ...w, material: e.target.value }))}
                  className="ml-1"
                >
                  <option value="Vidrio">Vidrio</option>
                  <option value="Madera">Madera</option>
                  <option value="Metal">Metal</option>
                  <option value="Personalizado">Personalizado</option>
                </select>
              </label>
              {newWindow.material === 'Personalizado' && (
                <label>
                  Color:
                  <input
                    type="color"
                    value={newWindow.color}
                    onChange={e => setNewWindow(w => ({ ...w, color: e.target.value }))}
                    className="ml-1"
                  />
                </label>
              )}
              <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">Agregar</button>
            </form>
            <ul className="mb-4">
              {room.windows.map((window, idx) => (
                <li key={idx} className="text-sm flex items-center gap-2">
                  Ventana en {window.wall} (x/z: {window.x}, y: {window.y}, ancho: {window.width}, alto: {window.height}, material: {window.material})
                  <button onClick={() => handleDeleteWindow(idx)} className="text-xs bg-red-500 text-white px-2 rounded">Eliminar</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Panel central: Catálogo y muebles añadidos */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Catálogo de Muebles</h3>
            <FurnitureCatalogPanel />
          </div>
          {/* Formulario para agregar mueble manualmente */}
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Agregar Mueble Manualmente</h3>
            <form className="flex flex-wrap gap-2 items-end" onSubmit={handleAddFurniture}>
              <label className="flex flex-col text-xs font-medium text-gray-700">
                Tipo
                <select
                  name="type"
                  value={newFurniture.type}
                  onChange={handleFurnitureChange}
                  className="input input-bordered mt-1"
                >
                  <option value="cube">Cubo</option>
                  <option value="cylinder">Cilindro</option>
                  <option value="sphere">Esfera</option>
                  <option value="cone">Cono</option>
                </select>
              </label>
              <label className="flex flex-col text-xs font-medium text-gray-700">
                Ancho/Radio
                <input
                  type="number"
                  name="size0"
                  value={newFurniture.size[0]}
                  onChange={e =>
                    setNewFurniture(prev => ({
                      ...prev,
                      size: [parseFloat(e.target.value), prev.size[1], prev.size[2] ?? 32],
                    }))
                  }
                  step="0.1"
                  className="input input-bordered mt-1 w-20"
                />
              </label>
              <label className="flex flex-col text-xs font-medium text-gray-700">
                Alto
                <input
                  type="number"
                  name="size1"
                  value={newFurniture.size[1]}
                  onChange={e =>
                    setNewFurniture(prev => ({
                      ...prev,
                      size: [prev.size[0], parseFloat(e.target.value), prev.size[2] ?? 32],
                    }))
                  }
                  step="0.1"
                  className="input input-bordered mt-1 w-20"
                />
              </label>
              {newFurniture.type === 'cylinder' && (
                <label className="flex flex-col text-xs font-medium text-gray-700">
                  Segmentos
                  <input
                    type="number"
                    name="size2"
                    value={newFurniture.size[2]}
                    onChange={e =>
                      setNewFurniture(prev => ({
                        ...prev,
                        size: [prev.size[0], prev.size[1], parseInt(e.target.value)],
                      }))
                    }
                    className="input input-bordered mt-1 w-20"
                  />
                </label>
              )}
              <label className="flex flex-col text-xs font-medium text-gray-700">
                X
                <input
                  type="number"
                  name="position0"
                  value={newFurniture.position[0]}
                  onChange={e =>
                    setNewFurniture(prev => ({
                      ...prev,
                      position: [parseFloat(e.target.value), prev.position[1], prev.position[2]],
                    }))
                  }
                  step="0.1"
                  className="input input-bordered mt-1 w-20"
                />
              </label>
              <label className="flex flex-col text-xs font-medium text-gray-700">
                Y
                <input
                  type="number"
                  name="position1"
                  value={newFurniture.position[1]}
                  onChange={e =>
                    setNewFurniture(prev => ({
                      ...prev,
                      position: [prev.position[0], parseFloat(e.target.value), prev.position[2]],
                    }))
                  }
                  step="0.1"
                  className="input input-bordered mt-1 w-20"
                />
              </label>
              <label className="flex flex-col text-xs font-medium text-gray-700">
                Z
                <input
                  type="number"
                  name="position2"
                  value={newFurniture.position[2]}
                  onChange={e =>
                    setNewFurniture(prev => ({
                      ...prev,
                      position: [prev.position[0], prev.position[1], parseFloat(e.target.value)],
                    }))
                  }
                  step="0.1"
                  className="input input-bordered mt-1 w-20"
                />
              </label>
              <label className="flex flex-col text-xs font-medium text-gray-700">
                Color
                <input
                  type="color"
                  name="color"
                  value={newFurniture.color}
                  onChange={handleFurnitureChange}
                  className="w-10 h-8 mt-1 border-none"
                />
              </label>
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded mt-1">
                Agregar mueble
              </button>
            </form>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Muebles Añadidos</h3>
            {/* Botones para descargar muebles */}
            <div className="mb-4 space-y-2">
              <div className="text-sm text-gray-600 mb-2">
                Total de muebles: <span className="font-semibold">{furniture.length}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={handleDownloadFurniture}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  disabled={furniture.length === 0}
                >
                  📥 Descargar JSON
                </button>
                <button
                  onClick={handleDownloadFurnitureCSV}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  disabled={furniture.length === 0}
                >
                  📊 Descargar CSV
                </button>
                <button
                  onClick={handleDownloadGLBModels}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  disabled={furniture.length === 0}
                >
                  📁 Descargar Modelos 3D
                </button>
                <button
                  onClick={handleDownloadAllAsZip}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  disabled={furniture.length === 0}
                >
                  📦 Descargar ZIP
                </button>
              </div>
            </div>
            {/* Lista de muebles añadidos con opción de eliminar */}
            <div className="mb-4">
              <ul>
                {furniture.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 mb-1">
                    <span>
                      {item.type} - Posición: [{item.position.join(', ')}] - Color: {item.color}
                    </span>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => setFurniture(furniture.filter((_, i) => i !== idx))}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Panel derecho: Vista 3D */}
        <div className="bg-white rounded-xl shadow-lg p-1 border border-gray-100 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-indigo-600 mb-2">Vista 3D</h3>
          <div className="w-full">
            <Room3D
              width={room.width}
              height={room.height}
              depth={room.depth}
              color={room.color}
              wallMaterial={room.wallMaterial}
              floorColor={room.floorColor}
              floorMaterial={room.floorMaterial}
              doors={room.doors}
              windows={room.windows}
              furniture={furniture}
              onMoveFurniture={handleMoveFurniture}
              onDropFurniture={handleDropFurniture}
            />
          </div>
        </div>
      </div>
    </div>
  );
}