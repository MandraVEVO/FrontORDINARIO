import React, { useEffect, useState } from 'react';
import BaristaService from '../Api/BaristaService';
import EmpleadoService from '../Api/EmpleadoService';
import DatosPersonalesService from '../Api/DatosPersonalesService';
import { useNavigate } from 'react-router-dom';

const BaristaComponent = () => {
    const [baristas, setBaristas] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedBarista, setSelectedBarista] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Hook para redirigir
  
    // Cargar todos los baristas al iniciar el componente
    useEffect(() => {
      BaristaService.getAll()
        .then((response) => {
          setBaristas(response);
        })
        .catch((error) => {
          console.error('Error al obtener los baristas:', error);
        });
    }, []);

    const handleSelectBarista = (barista) => {
      setSelectedBarista(barista);
      navigate(`/actualizar-barista/${barista.id}`);
    };
  
    const confirmDelete = (barista) => {
        setSelectedBarista(barista);
    };

    const handleDelete = async () => {
        if (selectedBarista) {
            setLoading(true);
            try {
                const empleadoId = selectedBarista.Empleado.id;
                const datosPersonalesId = selectedBarista.Empleado.DatosPersonale.id;

                // Eliminar Barista
                await BaristaService.remove(selectedBarista.id);

                // Eliminar Empleado
                await EmpleadoService.remove(empleadoId);

                // Eliminar DatosPersonales
                await DatosPersonalesService.remove(datosPersonalesId);

                // Actualizar la lista de baristas
                setBaristas(baristas.filter((b) => b.id !== selectedBarista.id));
                setSelectedBarista(null);
            } catch (error) {
                console.error('Error al eliminar el registro completo:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const filteredBaristas = baristas.filter((barista) =>
        `${barista.Empleado.DatosPersonale.nombre} ${barista.Empleado.DatosPersonale.apellido} ${barista.Empleado.DatosPersonale.correo}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-none overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-gray-800">
                <button
                    onClick={() => navigate('/ingreso-barista')}
                    className="bg-yellow-950 text-yellow-400 border border-yellow-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                >
                    <span className="bg-yellow-400 shadow-yellow-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                    Ingresar Barista
                </button>

                <div className="pb-4 px-6 pt-6 bg-white dark:bg-gray-800">
                    <label htmlFor="table-search" className="sr-only">Buscar</label>
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
                            <th className="px-4 py-3">Especialidad</th>
                            <th className="px-4 py-3">Cargo</th>
                            <th className="px-4 py-3">Costo por Hora</th>
                            <th className="px-4 py-3">CURP</th>
                            <th className="px-4 py-3">Cafetería</th>
                            <th className="px-4 py-3">Ubicación Cafetería</th>
                            <th className="px-4 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBaristas.map((barista, index) => (
                            <tr
                                key={index}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {barista.Empleado.DatosPersonale.nombre}
                                </td>
                                <td className="px-4 py-2">{barista.Empleado.DatosPersonale.apellido}</td>
                                <td className="px-4 py-2">{barista.especialidad.join(', ')}</td>
                                <td className="px-4 py-2">{barista.Empleado.cargoEmpleado}</td>
                                <td className="px-4 py-2">{barista.Empleado.costoHora}</td>
                                <td className="px-4 py-2">{barista.Empleado.curp}</td>
                                <td className="px-4 py-2">{barista.Empleado.Cafeterium.nombre}</td>
                                <td className="px-4 py-2">{barista.Empleado.Cafeterium.ubicacion}</td>
                                <td className="px-4 py-2 flex space-x-2">
                                    <button
                                        onClick={() => handleSelectBarista(barista)}
                                        className="bg-sky-950 text-sky-400 px-4 py-2 rounded-md"
                                    >
                                        Actualizar
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(barista)}
                                        className="bg-red-600 text-white px-4 py-2 rounded-md"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedBarista && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold">¿Estás seguro de borrar el registro?</h3>
                        <p className="text-gray-600 my-4">
                            Se eliminará toda la información relacionada con este registro.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setSelectedBarista(null)}
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

export default BaristaComponent;