import React, { useState, useEffect } from "react";
import DatosPersonalesService from "../Api/DatosPersonalesService";
import EmpleadoService from "../Api/EmpleadoService";
import BaristaService from "../Api/BaristaService";
import CafeteriaService from "../Api/CafeteriaService";
import { useNavigate } from 'react-router-dom';

const Form = () => {
  const navigate = useNavigate(); // Hook para redirigir

  const [datosPersonales, setDatosPersonales] = useState({
    telefono: "",
    direccion: "",
    correo: "",
    genero: "",
    nombre: "",
    apellido: "",
    fechaNac: ""
  });

  const [empleado, setEmpleado] = useState({
    cargoEmpleado: "",
    curp: "",
    rfc: "",
    costoHora: "",
    CafeteriumId: ""
  });

  const [barista, setBarista] = useState({
    especialidad: []
  });

  const [cafeterias, setCafeterias] = useState([]);

  useEffect(() => {
    const fetchCafeterias = async () => {
      try {
        const response = await CafeteriaService.getAll();
        setCafeterias(response);
      } catch (error) {
        console.error("Error al obtener las cafeterías:", error);
      }
    };

    fetchCafeterias();
  }, []);

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

      // Crear empleado
      const empleadoResponse = await EmpleadoService.create({
        ...empleado,
        DatosPersonaleId: datosPersonalesId
      });
      const empleadoId = empleadoResponse.id;

      // Crear barista
      await BaristaService.create({
        ...barista,
        EmpleadoId: empleadoId
      });

      alert("Barista creado exitosamente");
      navigate("/baristas"); // Redirigir a la lista de baristas
    } catch (error) {
      console.error("Error al crear el barista:", error);
      alert("Error al crear el barista");
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
          <span>BARISTA</span>
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

        {/* Campos de Empleado */}
        <input
          type="text"
          name="cargoEmpleado"
          placeholder="Cargo"
          value={empleado.cargoEmpleado}
          onChange={(e) => handleInputChange(e, setEmpleado)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="text"
          name="curp"
          placeholder="CURP"
          value={empleado.curp}
          onChange={(e) => handleInputChange(e, setEmpleado)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="text"
          name="rfc"
          placeholder="RFC"
          value={empleado.rfc}
          onChange={(e) => handleInputChange(e, setEmpleado)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="number"
          name="costoHora"
          placeholder="Costo por Hora"
          value={empleado.costoHora}
          onChange={(e) => handleInputChange(e, setEmpleado)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <select
          name="CafeteriumId"
          value={empleado.CafeteriumId}
          onChange={(e) => handleInputChange(e, setEmpleado)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        >
          <option value="">Seleccione una Cafetería</option>
          {cafeterias.map((cafeteria) => (
            <option key={cafeteria.id} value={cafeteria.id}>
              {cafeteria.nombre}
            </option>
          ))}
        </select>

        {/* Campos de Barista */}
        <input
          type="text"
          name="especialidad"
          placeholder="Especialidad"
          value={barista.especialidad}
          onChange={(e) => handleInputChange(e, setBarista)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full px-4 py-2 bg-gradient-to-br from-blue-700 to-teal-500 text-white font-bold rounded hover:bg-gradient-to-br focus:outline-none"
        >
          Ingresar Barista
        </button>
        <button
          onClick={() => navigate('/barista-component')}
          className="w-full px-4 py-2 bg-gradient-to-br from-blue-700 to-teal-500 text-white font-bold rounded hover:bg-gradient-to-br focus:outline-none"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default Form;