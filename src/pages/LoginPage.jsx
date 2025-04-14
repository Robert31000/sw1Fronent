import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Función para manejar el login exitoso
  const handleLoginSuccess = () => {
    navigate('/dashboard'); // Redirige al dashboard después del login
  };

  const handleLoginError = (errorMessage) => { //para manejar errores
    setError(errorMessage);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          {/*Colocar Logo de la aplicación */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            SIMULADOR DE DISEÑO DE INTERIORES
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido!!!!!!!!</h1>
            <p className="text-gray-600">Inicia sesión para acceder a tu cuenta</p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <LoginForm 
            onSuccess={handleLoginSuccess} 
            onError={handleLoginError} 
            isLoading={isLoading} 
            setIsLoading={setIsLoading}
          />

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>

          <div className="mt-6 text-center space-y-3">
            <div>
              <Link 
                to="/auth/forgot-password" 
                className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link 
                to="/auth/registro" 
                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Regístrate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;