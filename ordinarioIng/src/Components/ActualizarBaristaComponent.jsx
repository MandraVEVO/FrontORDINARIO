import React, { useState, useEffect } from "react";
import DatosPersonalesService from "../Api/DatosPersonalesService";
import EmpleadoService from "../Api/EmpleadoService";
import BaristaService from "../Api/BaristaService";
import CafeteriaService from "../Api/CafeteriaService";
import { useNavigate, useParams } from "react-router-dom";

const ActualizarBarista = () => {
  const { id } = useParams(); // Obtener el ID del barista desde la URL
  const navigate = useNavigate();
  
  const [datosPersonales, setDatosPersonales] = useState({});
  const [empleado, setEmpleado] = useState({});
  const [barista, setBarista] = useState({});
  const [cafeterias, setCafeterias] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del barista, empleado y personales
        const baristaData = await BaristaService.getById(id);
        const empleadoData = await EmpleadoService.getById(baristaData.EmpleadoId);
        let datosPersonalesData = await DatosPersonalesService.getById(empleadoData.DatosPersonaleId);

        if (datosPersonalesData.fechaNac) {
          datosPersonalesData = {
            ...datosPersonalesData,
            fechaNac: new Date(datosPersonalesData.fechaNac).toISOString().split("T")[0],
          };
        }

        // Precargar valores
        setDatosPersonales(datosPersonalesData);
        setEmpleado(empleadoData);
        setBarista(baristaData);

        // Obtener todas las cafeterías para el dropdown
        const cafeteriasData = await CafeteriaService.getAll();
        setCafeterias(cafeteriasData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e, setStateFunc) => {
    const { name, value } = e.target;
    setStateFunc((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Actualizar datos personales
      await DatosPersonalesService.update(datosPersonales.id, datosPersonales);

      // Actualizar datos del empleado
      await EmpleadoService.update(empleado.id, {
        ...empleado,
        DatosPersonaleId: datosPersonales.id,
      });

      // Actualizar datos del barista
      await BaristaService.update(barista.id, {
        ...barista,
        EmpleadoId: empleado.id,
      });

      alert("Barista actualizado exitosamente");
      navigate("/"); // Redirigir a la página principal o lista
    } catch (error) {
      console.error("Error al actualizar el barista:", error);
      alert("Error al actualizar los datos");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-teal-900">
      <form
        onSubmit={handleUpdate}
        className="relative p-8 max-w-xs w-full bg-gradient-to-tr from-blue-900 via-blue-800 to-teal-700 border border-white shadow-lg rounded-lg space-y-4 text-white"
      >
        <div className="text-center text-lg font-mono font-semibold tracking-wide">
          <span>ACTUALIZAR DATOS</span>
        </div>
        <div className="text-center text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
          <span>BARISTA</span>
        </div>

        {/* Campos de DatosPersonales */}
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={datosPersonales.nombre || ""}
          onChange={(e) => handleInputChange(e, setDatosPersonales)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={datosPersonales.apellido || ""}
          onChange={(e) => handleInputChange(e, setDatosPersonales)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={datosPersonales.correo || ""}
          onChange={(e) => handleInputChange(e, setDatosPersonales)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={datosPersonales.telefono || ""}
          onChange={(e) => handleInputChange(e, setDatosPersonales)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={datosPersonales.direccion || ""}
          onChange={(e) => handleInputChange(e, setDatosPersonales)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="text"
          name="genero"
          placeholder="Género"
          value={datosPersonales.genero || ""}
          onChange={(e) => handleInputChange(e, setDatosPersonales)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="date"
          name="fechaNac"
          placeholder="Fecha de Nacimiento"
          value={datosPersonales.fechaNac || ""}
          onChange={(e) => handleInputChange(e, setDatosPersonales)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />

        {/* Campos de Empleado */}
        <input
          type="text"
          name="cargoEmpleado"
          placeholder="Cargo"
          value={empleado.cargoEmpleado || ""}
          onChange={(e) => handleInputChange(e, setEmpleado)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="text"
          name="curp"
          placeholder="CURP"
          value={empleado.curp || ""}
          onChange={(e) => handleInputChange(e, setEmpleado)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="text"
          name="rfc"
          placeholder="RFC"
          value={empleado.rfc || ""}
          onChange={(e) => handleInputChange(e, setEmpleado)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="number"
          name="costoHora"
          placeholder="Costo por Hora"
          value={empleado.costoHora || ""}
          onChange={(e) => handleInputChange(e, setEmpleado)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <select
          name="CafeteriumId"
          value={empleado.CafeteriumId || ""}
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

        {/* Campo de Barista */}
        <input
          type="text"
          name="especialidad"
          placeholder="Especialidad"
          value={barista.especialidad || ""}
          onChange={(e) => handleInputChange(e, setBarista)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full px-4 py-2 bg-gradient-to-br from-blue-700 to-teal-500 text-white font-bold rounded hover:bg-gradient-to-br focus:outline-none"
        >
          Actualizar Barista
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

export default ActualizarBarista;
