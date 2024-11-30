import React, { useState } from "react";
import DatosPersonalesService from "../Api/DatosPersonalesService";
import ClienteService from "../Api/ClienteService";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const navigate = useNavigate();

  const [datosPersonales, setDatosPersonales] = useState({
    telefono: "",
    direccion: "",
    correo: "",
    genero: "",
    nombre: "",
    apellido: "",
    fechaNac: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosPersonales((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateInputs = () => {
    // Validar solo texto en nombre y apellido
    const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!textRegex.test(datosPersonales.nombre)) {
      setError("El nombre solo debe contener letras.");
      return false;
    }
    if (!textRegex.test(datosPersonales.apellido)) {
      setError("El apellido solo debe contener letras.");
      return false;
    }

    // Validar fecha de nacimiento mayor a 6 años
    const fechaIngresada = new Date(datosPersonales.fechaNac);
    const fechaLimite = new Date();
    fechaLimite.setFullYear(fechaLimite.getFullYear() - 6);
    if (fechaIngresada > fechaLimite) {
      setError("La fecha de nacimiento debe indicar que el cliente tiene al menos 6 años.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    try {
      const datosPersonalesResponse = await DatosPersonalesService.create(datosPersonales);
      const datosPersonalesId = datosPersonalesResponse.id;

      await ClienteService.create({ DatosPersonaleId: datosPersonalesId });

      alert("Cliente creado exitosamente");
      navigate("/clientes");
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
  onChange={(e) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/; // Permite solo letras y espacios
    if (regex.test(e.target.value)) {
      handleInputChange(e); // Actualiza el estado si el valor es válido
    }
  }}
  pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+" // Validación HTML al enviar el formulario
  className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
  required
/>
<input
  type="text"
  name="apellido"
  placeholder="Apellido"
  value={datosPersonales.apellido}
  onChange={(e) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/; // Permite solo letras y espacios
    if (regex.test(e.target.value)) {
      handleInputChange(e); // Actualiza el estado si el valor es válido
    }
  }}
  pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+" // Validación HTML al enviar el formulario
  className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
  required
/>

        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={datosPersonales.correo}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={datosPersonales.telefono}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={datosPersonales.direccion}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
          required
        />
        <select
  name="genero"
  value={datosPersonales.genero}
  onChange={handleInputChange}
  className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
  required
>
  <option value="" disabled>
    Seleccione género
  </option>
  <option value="M">M</option>
  <option value="F">F</option>
</select>

<input
  type="date"
  name="fechaNac"
  placeholder="Fecha de Nacimiento"
  value={datosPersonales.fechaNac}
  onChange={handleInputChange}
  className="w-full px-4 py-2 border border-white bg-white text-gray-800 rounded focus:outline-none"
  required
  max={new Date(new Date().setFullYear(new Date().getFullYear() - 6))
    .toISOString()
    .split("T")[0]} // Fecha máxima: 6 años atrás de hoy
/>


        {/* Mostrar mensaje de error */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-gradient-to-br from-blue-700 to-teal-500 text-white font-bold rounded hover:bg-gradient-to-br focus:outline-none"
        >
          Ingresar Cliente
        </button>
        <button
          onClick={() => navigate("/cliente-component")}
          className="w-full px-4 py-2 bg-gradient-to-br from-blue-700 to-teal-500 text-white font-bold rounded hover:bg-gradient-to-br focus:outline-none"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default Form;
