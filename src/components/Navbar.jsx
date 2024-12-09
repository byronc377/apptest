import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Importa Link de react-router-dom

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // Redirigir después de cerrar sesión

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("user"); // Eliminar el usuario del almacenamiento local
    navigate("/login"); // Redirigir al login
  };

  // Validar si el usuario tiene sesión iniciada
  useEffect(() => {
    const user = localStorage.getItem("user"); // Revisamos si hay un usuario en el almacenamiento local
    if (!user) {
      navigate("/login"); // Si no hay un usuario, redirigir al login
    }
  }, [navigate]);

  return (
    <nav className="bg-blue-500 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          <a href="#">MiApp</a>
        </div>

        {/* Menú */}
        <div className="hidden md:flex space-x-6">
          <Link to="/Home" className="text-white hover:text-gray-300">Inicio</Link>
          <Link to="/FormNuevoCliente" className="text-white hover:text-gray-300">Agregar Nuevo Cliente</Link>
          <Link to="/Reporteria" className="text-white hover:text-gray-300">Reporteria</Link>
        </div>

        <div className="md:flex items-center space-x-4">
          {/* Menú desplegable para cerrar sesión */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 3v18M19 3v18M5 12h14"
                />
              </svg>
            </button>

            {/* Menú desplegable */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>

          {/* Botón para móviles */}
          <div className="md:hidden flex items-center">
            <button className="text-white focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
