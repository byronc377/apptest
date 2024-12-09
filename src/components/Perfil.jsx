import React, { useEffect, useState } from "react";
import Layout from '../components/Layout';
import BotonExportar from '../components/BotonExportar';
import { useParams } from "react-router-dom";

const Perfil = () => {
  const { id } = useParams(); // Obtener el parámetro 'id' de la URL
  const [userData, setUserData] = useState(null);
  const [userDetalleData, setUserDetalleData] = useState([]); // Cambiado a array para manejar múltiples detalles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [addRecordModalOpen, setAddRecordModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);  // Nuevo estado para el historial
  const [newRecordData, setNewRecordData] = useState({ dui: "", direccion: "" });
  const [actionHistory, setActionHistory] = useState([]); // Estado para guardar el historial de acciones

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost/API_PRUEBA/index.php/getCliente`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ "idCliente": id }),
        });
        if (!response.ok) {
          throw new Error("Error al obtener los datos del cliente");
        }
        const data = await response.json();
        setUserData(data["cliente"][0]);
        setUserDetalleData(data["detalleCliente"] || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Función para obtener el historial de acciones
  const fetchActionHistory = async () => {
    try {
      const response = await fetch(`http://localhost/API_PRUEBA/index.php/logCliente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idCliente: id }),
      });

      if (!response.ok) {
        throw new Error("Error al obtener el historial de acciones");
      }

      const data = await response.json();
      console.log(JSON.parse(data["datos"]));
      setActionHistory(JSON.parse(data["datos"]) || []);
    } catch (error) {
      setModalMessage("Error al obtener el historial de acciones: " + error.message);
      setIsSuccess(false);
      setModalOpen(true);
    }
  };

  const handleAddRecord = async () => {
    try {
      const response = await fetch(`http://localhost/API_PRUEBA/index.php/insertDetalleCliente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idCliente: id, ...newRecordData }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar el registro");
      }

      setModalMessage("Registro agregado exitosamente");
      setIsSuccess(true);
      setModalOpen(true);
      setAddRecordModalOpen(false);

      // Recargar la tabla
      const updatedResponse = await fetch(`http://localhost/API_PRUEBA/index.php/getCliente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "idCliente": id }),
      });

      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setUserData(updatedData["cliente"][0]);
        setUserDetalleData(updatedData["detalleCliente"] || []);
      }

    } catch (error) {
      setModalMessage("Error al agregar el registro: " + error.message);
      setIsSuccess(false);
      setModalOpen(true);
    }
  };

  // Función para cambiar el estado de un detalle cliente
  const toggleEstadoDetalle = async (idDetalle, estado) => {
    let usuario = localStorage.getItem("user");
    usuario = JSON.parse(usuario);
    usuario = usuario[0].ID_USUARIO;
    const newEstado = estado === "activo" ? "inactivo" : "activo";
    try {
      const response = await fetch(`http://localhost/API_PRUEBA/index.php/updateEstado`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idDetalle, estado: newEstado, usuario :usuario }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el estado");
      }

      // Recargar la tabla después de cambiar el estado
      const updatedResponse = await fetch(`http://localhost/API_PRUEBA/index.php/getCliente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "idCliente": id }),
      });

      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setUserDetalleData(updatedData["detalleCliente"] || []);
      }

    } catch (error) {
      setModalMessage("Error al actualizar el estado: " + error.message);
      setIsSuccess(false);
      setModalOpen(true);
    }
  };

const [editRecordData, setEditRecordData] = useState({ dui: "", direccion: "", idDetalle : ""}); // Estado para almacenar los datos a editar
const [editRecordModalOpen, setEditRecordModalOpen] = useState(false); // Estado para controlar la visibilidad del modal

// Función para abrir el modal de editar
const openEditModal = (data) => {
  setEditRecordData({
    dui: data.DUI,
    direccion: data.DIRECCION,
    idDetalle: data.ID_DETALLE_CLIENTE
  });
  setEditRecordModalOpen(true);
};



  const handleEditRecord = async () => {
    let usuario = localStorage.getItem("user");
    usuario = JSON.parse(usuario);
    usuario = usuario[0].ID_USUARIO;

    const { idDetalle, dui, direccion } = editRecordData;

    // Buscar los datos originales de la fila seleccionada
    const originalData = userDetalleData.find((item) => item.ID_DETALLE_CLIENTE === idDetalle);

    if (!originalData) {
      // Cerrar modal del formulario antes de mostrar la modal de error
      setEditRecordModalOpen(false);
      setModalMessage("Error: No se encontraron datos originales.");
      setIsSuccess(false);
      setModalOpen(true);
      return;
    }

    // Crear un arreglo para almacenar los cambios
    const changes = [];

    // Verificamos si el DUI ha cambiado
    if (dui !== originalData.DUI) {
      changes.push({
        idDetalleCliente: idDetalle,
        valorNuevo: dui,
        valorAnterior: originalData.DUI,
        parametro: "DUI",
        usuario: usuario,
      });
    }

    // Verificamos si la Dirección ha cambiado
    if (direccion !== originalData.DIRECCION) {
      changes.push({
        idDetalleCliente: idDetalle,
        valorNuevo: direccion,
        valorAnterior: originalData.DIRECCION,
        parametro: "DIRECCION",
        usuario: usuario,
      });
    }

    // Si no hay cambios, mostramos una modal de error
    if (changes.length === 0) {
      // Cerrar modal del formulario antes de mostrar la modal de error
      setEditRecordModalOpen(false);
      setModalMessage("No se ha realizado ningún cambio en los campos.");
      setIsSuccess(false);
      setModalOpen(true);
      return; // No hacer nada si no hay cambios
    }

    try {
      // Enviar los cambios al servidor
      const response = await fetch(`http://localhost/API_PRUEBA/index.php/updateDetalleCliente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes), // Mandamos el arreglo con los cambios
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el registro");
      }

      // Cerrar modal del formulario antes de mostrar la modal de éxito
      setEditRecordModalOpen(false);

      // Mostrar un mensaje de éxito
      setModalMessage("Registro actualizado exitosamente");
      setIsSuccess(true);
      setModalOpen(true);

      // Recargar los datos de cliente para reflejar los cambios
      const updatedResponse = await fetch(`http://localhost/API_PRUEBA/index.php/getCliente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idCliente: id }),
      });

      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setUserDetalleData(updatedData["detalleCliente"] || []);
      }
    } catch (error) {
      // Cerrar modal del formulario antes de mostrar la modal de error
      setEditRecordModalOpen(false);
      setModalMessage("Error al actualizar el registro: " + error.message);
      setIsSuccess(false);
      setModalOpen(true);
    }
  };

  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const itemsPerPage = 5; // Elementos por página
  const totalPages = Math.ceil(actionHistory.length / itemsPerPage); 
  //para tabla principal de servicios 
  const [currentPageDetalle, setCurrentPageDetalle] = useState(1); // Página actual
  const itemsPerPageDetalle = 5; // Elementos por página
  const totalPagesDetalle = Math.ceil(userDetalleData.length / itemsPerPageDetalle); 

  


  if (loading) {
    return <p className="text-center">Cargando datos del cliente...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!userData) {
    return <p className="text-center">No se encontraron datos del cliente.</p>;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-center text-blue-500">
            Perfil de Cliente
          </h1>
          <BotonExportar userData={userData} userDetalleData={userDetalleData} />
        </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Información Personal
            </h2>
            <p className="text-gray-600 mt-2">Nombre: {userData.NOMBRE_CLIENTE}</p>
            <p className="text-gray-600 mt-2">Email: {userData.FECHA_NACIMIENTO}</p>
          </div>

          <div className="mt-6 relative">
            <h2 className="text-xl font-semibold text-gray-700">
              Detalles de Cuenta
            </h2>
            {/* Botón para abrir modal de agregar registro */}
            <div className="mb-6 relative flex justify-between">
              <button
                className="flex items-center bg-green-500 text-white py-2 px-4 rounded shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={() => setAddRecordModalOpen(true)}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Agregar Registro
              </button>

              <button
                className="flex items-center bg-blue-500 text-white py-2 px-4 rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => {
                  fetchActionHistory();
                  setHistoryModalOpen(true);
                }}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Historial de Acciones
              </button>
            </div>
            <table className="min-w-full table-auto mt-4 border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
                    Cuenta
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
                    Dirección
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
                    DUI
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {userDetalleData.slice((currentPageDetalle - 1) * itemsPerPageDetalle, currentPageDetalle * itemsPerPageDetalle)
                  .map((data, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b text-gray-800">
                      {data.ID_DETALLE_CLIENTE}
                    </td>
                    <td className="px-4 py-2 border-b text-gray-800">
                      {data.DIRECCION}
                    </td>
                    <td className="px-4 py-2 border-b text-gray-800">
                      {data.DUI}
                    </td>
                    <td className="px-4 py-2 border-b text-gray-800">
                      <button
                        className={`px-4 py-2 rounded text-white ${data.ESTADO_DETALLE == 'activo' ? 'bg-red-500' : 'bg-green-500'}`}
                        onClick={() => toggleEstadoDetalle(data.ID_DETALLE_CLIENTE, data.ESTADO_DETALLE)}
                      >
                        {data.ESTADO_DETALLE == 'activo' ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        className="ml-2 px-4 py-2 rounded bg-yellow-500 text-white"
                        onClick={() => openEditModal(data)} // Función para abrir el modal de editar
                      >
                        Modificar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setCurrentPageDetalle((prev) => Math.max(prev - 1, 1))}
                disabled={currentPageDetalle === 1}
              >
                Anterior
              </button>
              <span className="text-gray-600">
                Página {currentPageDetalle} de {Math.ceil(userDetalleData.length / itemsPerPageDetalle)}
              </span>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setCurrentPageDetalle((prev) => Math.min(prev + 1, totalPagesDetalle))}
                disabled={currentPageDetalle === totalPagesDetalle}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agregar nuevo registro */}
      {addRecordModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4 text-gray-700">Agregar Nuevo Registro</h2>
            <div className="mb-4">
              <label htmlFor="dui" className="block text-gray-700 font-medium mb-2">
                DUI
              </label>
              <input
                type="text"
                id="dui"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newRecordData.dui}
                onChange={(e) => setNewRecordData({ ...newRecordData, dui: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="direccion" className="block text-gray-700 font-medium mb-2">
                Dirección
              </label>
              <input
                type="text"
                id="direccion"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newRecordData.direccion}
                onChange={(e) => setNewRecordData({ ...newRecordData, direccion: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setAddRecordModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddRecord}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para mostrar historial de acciones */}
      {historyModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full">
            <h2 className="text-lg font-bold mb-4 text-gray-700">Historial de Acciones</h2>
            <table className="min-w-full table-auto mt-4 border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">ID</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">Fecha</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">VALOR MODIFICADO</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">VALOR ANTERIOR</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">VALOR NUEVO</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">USUARIO MODIFICADOR</th>
                </tr>
              </thead>
              <tbody>
                {actionHistory
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((action, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b text-gray-800">{action.ID_LOG_MODIFICACION}</td>
                      <td className="px-4 py-2 border-b text-gray-800">{action.CREATED_AT}</td>
                      <td className="px-4 py-2 border-b text-gray-800">{action.PARAMETROS}</td>
                      <td className="px-4 py-2 border-b text-gray-800">{action.VALORES_ANTERIORES}</td>
                      <td className="px-4 py-2 border-b text-gray-800">{action.VALORES_NUEVOS}</td>
                      <td className="px-4 py-2 border-b text-gray-800">{action.USUARIO}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span className="text-gray-600">
                Página {currentPage} de {Math.ceil(actionHistory.length / itemsPerPage)}
              </span>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setHistoryModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de éxito o error */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className={`text-lg font-bold mb-4 ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
              {modalMessage}
            </h2>
            <div className="flex justify-end">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal para modificar el registro */}
        {editRecordModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-bold mb-4 text-gray-700">Modificar Registro</h2>
              <div className="mb-4">
                <label htmlFor="dui" className="block text-gray-700 font-medium mb-2">
                  DUI
                </label>
                <input
                  type="text"
                  id="dui"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editRecordData.dui}
                  onChange={(e) => setEditRecordData({ ...editRecordData, dui: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="direccion" className="block text-gray-700 font-medium mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  id="direccion"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editRecordData.direccion}
                  onChange={(e) => setEditRecordData({ ...editRecordData, direccion: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => setEditRecordModalOpen(false)} // Cerrar modal
                >
                  Cancelar
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleEditRecord} // Guardar cambios
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
    </Layout>
  );
};

export default Perfil;
