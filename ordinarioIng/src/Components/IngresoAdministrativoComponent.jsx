import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import DatosPersonalesService from "../Api/DatosPersonalesService";
import EmpleadoService from "../Api/EmpleadoService";
import AdministrativoService from "../Api/AdministrativoService";
import CafeteriaService from "../Api/CafeteriaService";

const IngresoAdministrativoComponent = () => {
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

  const [administrativo, setAdministrativo] = useState({
    area: "",
    nivelAcceso: ""
  });

  const [cafeterias, setCafeterias] = useState([]);
  const navigate = useNavigate(); // Hook para redirigir

  // Calcular valores mínimos y máximos para la fecha
  const minDate = "1950-01-01";
  const maxDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 18)
  )
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    const fetchCafeterias = async () => {
      const data = await CafeteriaService.getAll();
      setCafeterias(data);
    };
    fetchCafeterias();
  }, []);

  const limpiarFormulario = () => {
    setDatosPersonales({
      telefono: "",
      direccion: "",
      correo: "",
      genero: "",
      nombre: "",
      apellido: "",
      fechaNac: ""
    });
    setEmpleado({
      cargoEmpleado: "",
      curp: "",
      rfc: "",
      costoHora: "",
      CafeteriumId: ""
    });
    setAdministrativo({
      area: "",
      nivelAcceso: ""
    });
  };

  const verificarUsuarioExistente = async () => {
    const usuarios = await DatosPersonalesService.getAll();
    return usuarios.some(
      (usuario) =>
        usuario.correo === datosPersonales.correo ||
        (usuario.nombre === datosPersonales.nombre &&
          usuario.apellido === datosPersonales.apellido)
    );
  };

  const verificarCurpUnico = async (curp) => {
    const empleados = await EmpleadoService.getAll();
    return !empleados.some((empleado) => empleado.curp === curp);
  };

  const handleInputChange = (e, setStateFunc) => {
    const { name, value } = e.target;
    setStateFunc((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuarioExiste = await verificarUsuarioExistente();
    if (usuarioExiste) {
      alert("El usuario ya existe. Por favor, ingrese datos diferentes.");
      limpiarFormulario();
      return;
    }

    const curpEsUnico = await verificarCurpUnico(empleado.curp);
    if (!curpEsUnico) {
      alert("El CURP ingresado ya existe. Por favor, ingrese un CURP diferente.");
      limpiarFormulario();
      return;
    }

    try {
      const newDatosPersonales = await DatosPersonalesService.create(datosPersonales);
      const datosPersonalesId = newDatosPersonales.id;

      const newEmpleado = await EmpleadoService.create({
        ...empleado,
        DatosPersonaleId: datosPersonalesId
      });
      const empleadoId = newEmpleado.id;

      await AdministrativoService.create({
        departamento: administrativo.departamento,
        EmpleadoId: empleadoId
      });

      alert("Administrativo creado exitosamente");
      limpiarFormulario();
    } catch (error) {
      console.error("Error al crear el administrativo:", error);
      alert("Error al crear el administrativo");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-teal-900">
      <form
        onSubmit={handleSubmit}
        className="relative p-8 max-w-xs w-full bg-gradient-to-tr from-blue-900 via-blue-800 to-teal-700 border border-white shadow-lg rounded-lg space-y-4 text-white"
      >
        <div className="text-center text-lg font-mono font-semibold tracking-wide">
          <span>INGRESA TU</span>
        </div>
        <div className="text-center text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
          <span>ADMINISTRATIVO</span>
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
          value={datosPersonales.fechaNac}
          min={minDate}
          max={maxDate}
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

        {/* Campo de Administrativo */}
        <input
          type="text"
          name="departamento"
          placeholder="Departamento"
          value={administrativo.departamento}
          onChange={(e) => handleInputChange(e, setAdministrativo)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />

        <input
          type="text"
          name="area"
          placeholder="Área"
          value={administrativo.area}
          onChange={(e) => handleInputChange(e, setAdministrativo)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="text"
          name="nivelAcceso"
          placeholder="Nivel de Acceso"
          value={administrativo.nivelAcceso}
          onChange={(e) => handleInputChange(e, setAdministrativo)}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-700 text-white font-bold rounded hover:bg-blue-800"
        >
          Registrar Administrativo
        </button>
        <button
          type="button" // Cambia el tipo a "button" para evitar la validación
          onClick={() => navigate('/administrativo-component')} // Redirige a la página deseada
          className="w-full px-4 py-2 bg-gradient-to-br from-blue-700 to-teal-500 text-white font-bold rounded hover:bg-gradient-to-br focus:outline-none"
        >
          Regresar
        </button>
      </form>
    </div>
  );
};

export default IngresoAdministrativoComponent;