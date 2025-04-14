import { createBrowserRouter } from 'react-router-dom';
import App from '../App'; 
import Home from '../pages/Home';
import Login from '../pages/LoginPage';
import Registro from '../pages/RegisterPage';

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
        element: <Registro /> 
      },
      
    ],
  },
]);

export default router;
