import { createBrowserRouter } from 'react-router-dom';
import App from '../App'; 
import Home from '../pages/Home';
import Login from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Dashboard from '../pages/dashboard/Dashboard';
import CrearHabitacionForm from '../pages/Habitacion/CrearHabitacionForm';
import VistaHabitacion from '../pages/Habitacion/VistaHabitacion';
import CatalogPanel from '../pages/Catalogo/CatalogPanel';
import CrearHabitacion3D from '../pages/Habitacion/CrearHabitacion3D';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      { index: true, 
        element: <Home /> 
      },
      { path: 'auth/login', 
        element: <Login />
      },
      { path: 'auth/registro', 
        element: <RegisterPage /> 
      },
    
    ],
    
  },
    {
       path:'/dashboard',
       element:<Dashboard/>
      },
      {
    path: '/dashboard',
    element: <Dashboard />,
    
    children: [
      {
        path: 'crear',
        element: <CrearHabitacionForm />
      },
      {
        path: 'vista',
        element: <VistaHabitacion />
      },
      {
        path: 'crear3d',
        element: <CrearHabitacion3D />
      },
      {
        path: 'catalogo/muebles',
        element: <CatalogPanel />
      }
    ]
  }
]);

export default router;
