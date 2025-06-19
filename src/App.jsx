import React from 'react';
import { Outlet } from 'react-router-dom';



const App = () => {
  return (
    <div className="min-h-screen bg-white">
      {/*colocar navbar o header */}
      <header className="p-4 bg-indigo-600 text-white text-xl font-bold">
        
      </header>

      {/*ruta actual */}
      <main className="p-6">
        <Outlet />
      </main>

      {/* Footer opcional */}
      <footer className="p-4 text-center text-gray-500 text-sm">
        © 2025 Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default App;
