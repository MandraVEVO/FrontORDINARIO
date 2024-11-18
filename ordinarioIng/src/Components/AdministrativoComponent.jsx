import React, { useEffect, useState } from 'react';
import AdministrativoService from '../Api/AdministrativoService';
import EmpleadoService from '../Api/EmpleadoService';
import DatosPersonalesService from '../Api/DatosPersonalesService';
import { useNavigate } from 'react-router-dom';

const AdministrativoComponent = () => {
  const [administrativos, setAdministrativos] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedAdministrativo, setSelectedAdministrativo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook para redirigir

  // Cargar todos los administrativos al iniciar el componente
  useEffect(() => {
    AdministrativoService.getAll()
      .then((response) => {
        setAdministrativos(response);
      })
      .catch((error) => {
        console.error('Error al obtener los administrativos:', error);
      });
  }, []);

  const handleSelectAdministrativo = (administrativo) => {
    setSelectedAdministrativo(administrativo);
    navigate(`/actualizar-administrativo/${administrativo.id}`);
  };

  const confirmDelete = (administrativo) => {
    setSelectedAdministrativo(administrativo);
  };

  // Manejar la eliminación secuencial
  const handleDelete = async () => {
    if (selectedAdministrativo) {
      setLoading(true);
      try {
        const empleadoId = selectedAdministrativo.Empleado.id;
        const datosPersonalesId = selectedAdministrativo.Empleado.DatosPersonale.id;

        // Eliminar Administrativo
        await AdministrativoService.remove(selectedAdministrativo.id);

        // Eliminar Empleado
        await EmpleadoService.remove(empleadoId);

        // Eliminar DatosPersonales
        await DatosPersonalesService.remove(datosPersonalesId);

        // Actualizar la lista de administrativos
        setAdministrativos(administrativos.filter((a) => a.id !== selectedAdministrativo.id));
        setSelectedAdministrativo(null);
      } catch (error) {
        console.error('Error al eliminar el registro completo:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredAdministrativos = administrativos.filter((administrativo) =>
    `${administrativo.Empleado.DatosPersonale.nombre} ${administrativo.Empleado.DatosPersonale.apellido} ${administrativo.Empleado.DatosPersonale.correo}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-none overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-gray-800">
        <button
          onClick={() => navigate('/ingreso-administrativo')}
          className="bg-yellow-950 text-yellow-400 border border-yellow-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
        >
          <span className="bg-yellow-400 shadow-yellow-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
          Ingresar Administrativo
        </button>

        <div className="pb-4 px-6 pt-6 bg-white dark:bg-gray-800">
          <label htmlFor="table-search" className="sr-only">
            Buscar
          </label>
          <div className="relative mt-1">
            <input
              type="text"
              id="table-search"
              className="block w-80 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Apellido</th>
              <th className="px-4 py-3">Cargo</th>
              <th className="px-4 py-3">CURP</th>
              <th className="px-4 py-3">Cafetería</th>
              <th className="px-4 py-3">Ubicación Cafetería</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdministrativos.map((administrativo, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {administrativo.Empleado.DatosPersonale.nombre}
                </td>
                <td className="px-4 py-2">{administrativo.Empleado.DatosPersonale.apellido}</td>
                <td className="px-4 py-2">{administrativo.Empleado.cargoEmpleado}</td>
                <td className="px-4 py-2">{administrativo.Empleado.curp}</td>
                <td className="px-4 py-2">{administrativo.Empleado.Cafeterium.nombre}</td>
                <td className="px-4 py-2">{administrativo.Empleado.Cafeterium.ubicacion}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => handleSelectAdministrativo(administrativo)}
                    className="bg-sky-950 text-sky-400 border border-sky-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                  >
                    Actualizar
                  </button>
                  <button
                    onClick={() => confirmDelete(administrativo)}
                    className="flex justify-center items-center gap-2 w-28 h-12 cursor-pointer rounded-md shadow-2xl text-white font-semibold bg-gradient-to-r from-[#fb7185] via-[#e11d48] to-[#be123c] hover:shadow-xl hover:shadow-red-500 hover:scale-105 duration-300 hover:from-[#be123c] hover:to-[#fb7185]"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedAdministrativo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold">¿Estás seguro de borrar el registro?</h3>
            <p className="text-gray-600 my-4">
              Se eliminará toda la información relacionada con este registro.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setSelectedAdministrativo(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Borrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministrativoComponent;
