import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatosPersonalesService from "../Api/DatosPersonalesService";
import ClienteService from "../Api/ClienteService";

const IngresoClienteComponent = () => {
  const navigate = useNavigate(); // Hook para redirigir

  const [datosPersonales, setDatosPersonales] = useState({
    telefono: "",
    direccion: "",
    correo: "",
    genero: "",
    nombre: "",
    apellido: "",
    fechaNac: "",
  });

  const [cliente, setCliente] = useState({
    DatosPersonaleId: null, // Se llenará después de crear datos personales
  });

  const handleInputChange = (e, setStateFunc) => {
    const { name, value } = e.target;
    setStateFunc((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Crear datos personales
      const datosPersonalesResponse = await DatosPersonalesService.create(datosPersonales);
      const datosPersonalesId = datosPersonalesResponse.id;

      // Crear cliente
      await ClienteService.create({
        ...cliente,
        DatosPersonaleId: datosPersonalesId,
      });

      alert("Cliente creado exitosamente");
      navigate("/clientes"); // Redirigir a la lista de clientes
    } catch (error) {
      console.error("Error al crear el cliente:", error);
      alert("Error al crear el cliente");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-teal-900">
      <form
        onSubmit={handleSubmit}
        className="relative p-8 max-w-xs w-full bg-gradient-to-tr from-blue-900 via-blue-800 to-teal-700 border border-white shadow-lg rounded-lg space-y-4 text-white"
      >
        <div className="text-center text-lg font-mono font-semibold tracking-wide">
          <span>INGRESAR DATOS</span>
        </div>
        <div className="text-center text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
          <span>CLIENTE</span>
        </div>

        {/* Campos de DatosPersonales */}
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={datosPersonales.nombre}
          onChange={(e) => handleInputChange(e, setDatosPersonales)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={datosPersonales.apellido}
          onChange={(e) => handleInputChange(e, setDatosPersonales)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={datosPersonales.correo}
          onChange={(e) => handleInputChange(e, setDatosPersonales)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={datosPersonales.telefono}
          onChange={(e) => handleInputChange(e, setDatosPersonales)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={datosPersonales.direccion}
          onChange={(e) => handleInputChange(e, setDatosPersonales)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="text"
          name="genero"
          placeholder="Género"
          value={datosPersonales.genero}
          onChange={(e) => handleInputChange(e, setDatosPersonales)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="date"
          name="fechaNac"
          placeholder="Fecha de Nacimiento"
          value={datosPersonales.fechaNac}
          onChange={(e) => handleInputChange(e, setDatosPersonales)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full px-4 py-2 bg-gradient-to-br from-blue-700 to-teal-500 text-white font-bold rounded hover:bg-gradient-to-br focus:outline-none"
        >
          Ingresar Cliente
        </button>
        <button
          onClick={() => navigate("/clientes")}
          className="w-full px-4 py-2 bg-gradient-to-br from-blue-700 to-teal-500 text-white font-bold rounded hover:bg-gradient-to-br focus:outline-none"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default IngresoClienteComponent;
