import React from 'react';

export default function Register() {
  return (
    <div className="flex flex-col min-h-screen justify-between bg-white">
      <div className="flex flex-col items-center justify-center flex-grow">
        <img src="/recycle-icon.png" alt="Recycle Icon" className="w-16 h-16 mb-4" />
        <h1 className="text-lg font-semibold mb-6">Recycling Company</h1>

        <form className="flex flex-col gap-4 w-80">
          <input
            type="text"
            placeholder="Nombre completo"
            className="border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="bg-green-600 text-white rounded-full py-2 hover:bg-green-400 transition"
          >
            Registrarse
          </button>
          <button
            type="button"
            className="bg-green-600 text-white rounded-full py-2 hover:bg-green-400 transition"
          >
            Volver al Login
          </button>
        </form>
      </div>

      <div className="bg-green-700 py-6 w-full">
        <div className="flex justify-center">
          <img src="/recycle-pattern.png" alt="Recycle Pattern" className="h-12 object-cover" />
        </div>
      </div>
    </div>
  );
}
