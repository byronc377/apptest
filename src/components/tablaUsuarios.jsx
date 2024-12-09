import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UsuariosTable = () => {
  const [busqueda, setBusqueda] = useState({
    parametro: "",
    texto: "",
  });
  const [usuarios, setUsuarios] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate(); 

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      
      const response = await fetch("http://localhost/API_PRUEBA/index.php/getCliente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idCliente: busqueda.texto }),
      });

      if (!response.ok) {
        throw new Error("Hubo un error al obtener los datos");
      }

      const data = await response.json();

      console.log(data["cliente"][0]);
      setUsuarios([data["cliente"][0]]);
    } catch (error) {
      // En caso de error, actualizamos el estado de error
      setError("Hubo un problema al cargar los usuarios. Intenta nuevamente.");
    } finally {
      setLoading(false); // Deja de mostrar el indicador de carga
    }
  };

  const handleViewProfile = (idCliente) => {
    // Redirige a la página de perfil con el ID del cliente
    navigate(`/PerfilPagina/${idCliente}`);
  };

  console.log(usuarios.length);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Buscar Clientes</h1>

      {/* Sección de búsqueda */}
      <div className="mb-4">
        <select
          value={busqueda.parametro}
          onChange={(e) => setBusqueda({ ...busqueda, parametro: e.target.value })}
          className="p-2 border border-gray-300 rounded-md mr-2"
        >
          <option value="">Seleccione</option>
          <option value="numeroCliente">Número de Cliente</option>
        </select>
        <input
          type="text"
          placeholder="Texto de búsqueda"
          value={busqueda.texto}
          onChange={(e) => setBusqueda({ ...busqueda, texto: e.target.value })}
          className="p-2 border border-gray-300 rounded-md mr-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Buscar
        </button>
      </div>

      {/* Mostrar el mensaje de error si ocurre algún problema */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Mostrar el indicador de carga mientras se hace la solicitud */}
      {loading && <p className="text-center">Cargando...</p>}

      {/* Tabla de resultados */}
      <table className="min-w-full table-auto mt-4 border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
              Nombre
            </th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
              Número Cliente
            </th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
              Ver Perfil de Cliente
            </th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <tr key={usuario.ID_CLIENTE} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-gray-800">{usuario.NOMBRE_CLIENTE}</td>
                <td className="px-4 py-2 border-b text-gray-800">{usuario.ID_CLIENTE}</td>
                <td className="px-4 py-2 border-b text-gray-800">
                  <button
                    onClick={() => handleViewProfile(usuario.ID_CLIENTE)}
                    className="px-4 py-2 bg-green-500 text-white rounded-full"
                  >
                    <i className="fa fa-eye"></i> {/* Icono de ojo */}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4">No se encontraron resultados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosTable;
