import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonExportar from "../components/BotonExportar";
import Layout from "../components/Layout";

const Reporteria = () => {
  const [busqueda, setBusqueda] = useState({
    fechaInicio: "",
    fechaFin: "",
  });
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost/API_PRUEBA/index.php/getClienteByFechaCreacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fechaInicio: busqueda.fechaInicio,
          fechaFin: busqueda.fechaFin,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Hubo un error al obtener los datos");
      }
  
      const data = await response.json();
      if (data && Array.isArray(data["cliente"])) {
        setUsuarios(data["cliente"]);  // Asignar directamente el arreglo de clientes
      } else {
        setUsuarios([]);  // Si no hay clientes, establece un arreglo vacío
      }
    } catch (error) {
      setError("Hubo un problema al cargar los usuarios. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleViewProfile = (idCliente) => {
    navigate(`/PerfilPagina/${idCliente}`);
  };

  return (
    <Layout>
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Buscar Clientes por Fecha</h1>

      {/* Sección de búsqueda */}
      <div className="mb-4">
        <label className="mr-2">Fecha de Inicio:</label>
        <input
          type="date"
          value={busqueda.fechaInicio}
          onChange={(e) => setBusqueda({ ...busqueda, fechaInicio: e.target.value })}
          className="p-2 border border-gray-300 rounded-md mr-2"
        />
        <label className="mr-2">Fecha de Fin:</label>
        <input
          type="date"
          value={busqueda.fechaFin}
          onChange={(e) => setBusqueda({ ...busqueda, fechaFin: e.target.value })}
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

      {/* Botones de exportación */}
      {usuarios.length > 0 && (
        <div className="flex justify-end mb-4">
          <BotonExportar userData={usuarios} />
        </div>
      )}

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
    </Layout>
  );
};

export default Reporteria;
