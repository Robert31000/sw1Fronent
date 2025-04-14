import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Componente de navegación
import Footer from './Footer'; // Componente de pie de página

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;