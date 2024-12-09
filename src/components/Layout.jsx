// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar'; 

const Layout = ({ children }) => {
  return (
    <div>
      {/* Incluir Navbar solo en las vistas que la requieran */}
      <Navbar />
      <div className="p-4">
        {children}  {/* Este será el contenido específico de cada página */}
      </div>
    </div>
  );
};

export default Layout;
