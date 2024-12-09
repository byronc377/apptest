import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./features/Auth/Login";
import Home from "./pages/Home";
import CheckAuth from "./components/CheckAuth";
import Perfil from "./components/Perfil";
import "./App.css";

// Importación dinámica de las páginas
const pagesContext = require.context("./pages", false, /\.jsx?$/);

const dynamicRoutes = pagesContext.keys().map((fileName) => {
  const Component = pagesContext(fileName).default;
  const path = fileName
    .replace("./", "")
    .replace(/\.\w+$/, "")
    .toLowerCase();

  return {
    path: path === "Home" ? "/" : `/${path}`,
    Component,
  };
});

const routes = [
  { path: "/login", Component: Login }, // Ruta manual para Login
  { path: "/Home", Component: Home }, // Ruta manual para Home
  { path: "/perfilPagina/:id", Component: Perfil },
  ...dynamicRoutes, // Rutas dinámicas de los componentes
];

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Validación de la sesión */}
        <Route path="*" element={<CheckAuth />} /> {/* Componente que valida la sesión */}
        
        {/* Rutas dinámicas */}
        {routes.map(({ path, Component }, index) => (
          <Route key={index} path={path} element={<Component />} />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
