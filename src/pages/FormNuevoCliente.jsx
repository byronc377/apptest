import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import Layout from '../components/Layout';

function FormNuevoCliente() {
  const [formData, setFormData] = useState({
    name: '',
    fechaNacimiento: ''
  });
  const [modal, setModal] = useState({ show: false, message: '', success: false });
  const navigate = useNavigate(); // Inicializamos el hook navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let usuario = localStorage.getItem('user');
    usuario = JSON.parse(usuario);
    console.log(usuario);
    usuario = usuario[0].ID_USUARIO;
    console.log(usuario);

    if (!usuario) {
      setModal({ show: true, message: 'Usuario no autenticado.', success: false });
      return;
    }

    const payload = {
      nombreCliente: formData.name,
      fechaNacimiento: formData.fechaNacimiento,
      usuarioCreador: usuario
    };

    try {
      const response = await fetch('http://localhost/API_PRUEBA/index.php/InsertNuevoCliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (data.numeroCliente) {
        // Si obtenemos el numeroCliente, redirigimos a la página de perfil
        navigate(`/PerfilPagina/${data["numeroCliente"]}`);
      }

      setModal({ show: true, message: 'Cliente creado exitosamente.', success: true });
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      setModal({ show: true, message: 'Error al enviar los datos.', success: false });
    }
  };

  const closeModal = () => {
    setModal({ show: false, message: '', success: false });
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        className="bg-white p-6 rounded shadow-md w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Formulario</h2>
        
        {/* Name Field */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-2"
          >
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa tu nombre"
            required
          />
        </div>

        {/* Birth Date Field */}
        <div className="mb-4">
          <label
            htmlFor="fechaNacimiento"
            className="block text-gray-700 font-medium mb-2"
          >
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            id="fechaNacimiento"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Enviar
        </button>
      </form>

      {/* Modal */}
      {modal.show && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <div className="flex items-center mb-4">
              {modal.success ? (
                <svg
                  className="w-6 h-6 text-green-600 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-red-600 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              <h3 className={`text-lg font-bold ${modal.success ? 'text-green-600' : 'text-red-600'}`}>Mensaje</h3>
            </div>
            <p className="text-gray-700 mb-4">{modal.message}</p>
            <button
              onClick={closeModal}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
}

export default FormNuevoCliente;

