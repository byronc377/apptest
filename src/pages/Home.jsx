// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import Layout from '../components/Layout';
import UsuariosTable from "../components/tablaUsuarios";
import { useNavigate } from "react-router-dom"; 

const Home = () => {
  const history = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      history("/login"); // Si no hay usuario, redirige al login
    }
  }, [user, history]);

  if (!user) {
    return <p>Cargando...</p>; // Esperamos la validación del usuario
  }


  return (
    <Layout>
      <UsuariosTable />
    </Layout>
  );
};

export default Home;

