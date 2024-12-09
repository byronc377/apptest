import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckAuth = () => {
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user"); // Revisamos si el usuario está en localStorage
    if (user) {
      // Si hay usuario en localStorage, redirige al Home
      navigate("/Home"); // O la ruta que desees para el Home
    } else {
      // Si no hay usuario, redirige al login
      navigate("/login");
    }
    setIsLoading(false); // Al finalizar la validación, cambiamos el estado de carga
  }, [navigate]);

  // Mientras se verifica la sesion, mostramos una pantalla de carga
  if (isLoading) {
    return <div>Cargando...</div>; // O puedes poner una pantalla de carga más personalizada
  }

  return null; // Una vez que se haya redirigido, no se muestra nada
};

export default CheckAuth;