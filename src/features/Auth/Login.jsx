import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(""); // Para mostrar errores de autenticación
  const history = useNavigate(); 


   // Verificar si ya hay una sesión activa (usuario en localStorage)
   useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      // Si el usuario está en localStorage, redirigir al Home
      history("/Home");
    }
  }, [history]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      username: formData.username,
      password: formData.password,
    };

    try {
      const response = await fetch("http://localhost:80/API_PRUEBA/index.php/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        console.log(JSON.parse(data["usuario"]));
        // Si la respuesta es exitosa, guardamos el usuario en localStorage
        localStorage.setItem("user", JSON.stringify(JSON.parse(data["usuario"])));

        // Redirigir al home
        history("/Home");
      } else {
        // Si hubo un error, mostramos el mensaje
        setError(data.error || "Hubo un error en el login");
      }
    } catch (err) {
      console.log(err);
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-500">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>} {/* Mostrar error */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;