import React from 'react';

const LoginForm = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form>
        <input type="text" placeholder="Usuario" className="block mb-2 p-2 border w-full" />
        <input type="password" placeholder="Contraseña" className="block mb-2 p-2 border w-full" />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
