import React from 'react';
import { Link } from "react-router-dom";


function HomePage() {
    return (
        <div className="flex min-h-screen bg-gray-100">
          
          {/* Sidebar */}
          <aside className="w-48 bg-green-600 flex flex-col justify-between items-center py-8">
            
            {/* Top avatar */}
            <div className="flex flex-col items-center gap-8">
              <div className="w-20 h-20 bg-green-300 rounded-full"></div>
              
              {/* Menu options */}
              <nav className="flex flex-col gap-6">
                <a href="#" className="text-white font-semibold hover:underline">
                  Clientes
                </a>
                <a href="#" className="text-white font-semibold hover:underline">
                  Clientes
                </a>
                <a href="#" className="text-white font-semibold hover:underline">
                  Clientes
                </a>
                <a href="#" className="text-white font-semibold hover:underline">
                  Clientes
                </a>
              </nav>
            </div>
    
            {/* Bottom logout */}
            <div className="mb-6">
              <button className="text-green-300 hover:text-white transition">
                <FiLogOut size={28} />
              </button>
            </div>
          </aside>
    
          {/* Main content */}
          <main className="flex-grow p-8">
            {/* Aquí irá el contenido principal */}
            <h1 className="text-2xl font-bold">Bienvenido a la Home Page</h1>
          </main>
          
        </div>
      );
}

export default HomePage