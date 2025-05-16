import { createBrowserRouter } from 'react-router-dom';
import App from '../App'; 
import Home from '../pages/Home';
import Login from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Dashboard from '../pages/dashboard/Dashboard';

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
      }
]);

export default router;
