import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClienteService from "../Api/ClienteService"; // Asegúrate de que este archivo está en la ruta correcta
import DatosPersonalesService from "../Api/DatosPersonalesService";



const ActualizarCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState({});
  const [datosPersonales,setDatosPersonales] = useState({});

  // Usamos useEffect para obtener los datos cuando el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clienteData = await ClienteService.getById(id);
        let datosPersonalesData = await DatosPersonalesService.getById(clienteData.DatosPersonaleId);

        if (datosPersonalesData.fechaNac) {
          datosPersonalesData = {
            ...datosPersonalesData,
            fechaNac: new Date(datosPersonalesData.fechaNac).toISOString().split("T")[0],
          };
        }

        setDatosPersonales(datosPersonalesData);
        setCliente(clienteData);

    
      } catch (error) {
        console.error("Error al cargar los datos del cliente:", error);
        message.error("Hubo un problema al cargar los datos del cliente.");
      }
    };

    fetchData();
  }, [id]); // Se vuelve a ejecutar cuando el `id` cambia

  // Función para manejar los cambios en los campos del formulario
  const handleInputChange = (e, setStateFunc) => {
    const { name, value } = e.target;
    setStateFunc((prevState) => ({ ...prevState, [name]: value }));
  };

  // Función para manejar la actualización de los datos
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Actualizar datos personales
      await DatosPersonalesService.update(datosPersonales.id, datosPersonales);

      // Actualizar datos del cliente
      await ClienteService.update(cliente.id, {
        ...cliente,
        DatosPersonaleId: datosPersonales.id,
      });

      alert("Datos actualizados correctamente.");
      navigate("/cliente-component");
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      message.error("Hubo un problema al actualizar los datos.");
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
          <span>CLIENTE</span>
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
        <button
          type="submit"
          className="w-full px-4 py-2 bg-gradient-to-br from-blue-700 to-teal-500 text-white font-bold rounded hover:bg-gradient-to-br focus:outline-none"
        >
          Actualizar Cliente
        </button>
        <button
          onClick={() => navigate('/cliente-component')}
          className="w-full px-4 py-2 bg-gradient-to-br from-blue-700 to-teal-500 text-white font-bold rounded hover:bg-gradient-to-br focus:outline-none"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};


export default ActualizarCliente;
