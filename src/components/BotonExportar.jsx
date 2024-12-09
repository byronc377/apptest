import React from 'react';
import { saveAs } from 'file-saver';

const BotonExportar = ({ userData, userDetalleData }) => {
  // Función para exportar los datos como CSV
  const exportarCSV = () => {
    let csvContent = [
      ['NUMERO_CLIENTE', 'NOMBRE_CLIENTE'], // Cabeceras del CSV
    ];

    // Si userData es un array (varios clientes)
    if (Array.isArray(userData)) {
      userData.forEach(cliente => {
        csvContent.push([cliente.ID_CLIENTE, cliente.NOMBRE_CLIENTE]);
      });
    } else {
      // Si es un solo cliente, agregar directamente
      csvContent.push([userData.ID_CLIENTE, userData.NOMBRE_CLIENTE]);
    }
    
    // Si userDetalleData está disponible, agregamos los detalles al CSV
    if (userDetalleData && userDetalleData.length > 0) {
      csvContent.push(['NUMERO DE CUENTA', 'DIRECCION', 'DUI']); 
      userDetalleData.forEach(item => {
        csvContent.push([item.ID_DETALLE_CLIENTE, item.DIRECCION, item.DUI]);
      });
    }

    // Convertir el contenido del CSV a una cadena de texto
    const csvText = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'datosCliente.csv');
  };

  // Funcion para exportar los datos como TXT
  const exportarTXT = () => {
    let txtContent = '';

    // Si userData es un array (varios clientes)
    if (Array.isArray(userData)) {
      userData.forEach(cliente => {
        txtContent += `NOMBRE DE CLIENTE: ${cliente.NOMBRE_CLIENTE}\nNumero de Cliente: ${cliente.ID_CLIENTE}\n\n`;
      });
    } else {
      // Si es un solo cliente, agregar directamente
      txtContent = `NOMBRE DE CLIENTE: ${userData.NOMBRE_CLIENTE}\nNumero de Cliente: ${userData.ID_CLIENTE}\n\n`;
    }

    // Si userDetalleData está disponible, agregamos los detalles al TXT
    if (userDetalleData && userDetalleData.length > 0) {
      userDetalleData.forEach(item => {
        txtContent += `Numero de Cuenta: ${item.ID_DETALLE_CLIENTE}\nDIRECCION: ${item.DIRECCION}\nDUI: ${item.DUI}\n\n`;
      });
    }

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    saveAs(blob, 'datosCliente.txt');
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={exportarCSV}
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
      >
        Descargar CSV
      </button>
      <button
        onClick={exportarTXT}
        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-200"
      >
        Descargar TXT
      </button>
    </div>
  );
};

export default BotonExportar;
