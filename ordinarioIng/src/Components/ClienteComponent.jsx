import React, { useEffect, useState } from 'react';
import DatosPersonalesService from '../Api/DatosPersonalesService.js';
import ClienteService from '../Api/ClienteService.js';
import { useNavigate } from 'react-router-dom';

const ClienteComponent = () => {
    const [clientes, setClientes] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        ClienteService.getAll()
            .then(response => {
                console.log("Datos obtenidos de la API:", response);
                setClientes(response);
            })
            .catch(error => {
                console.error("Error al obtener datos:", error);
            });
    }, []);

    const handleSelectCliente = (cliente) => {
        setSelectedCliente(cliente);
        navigate(`/actualizar-cliente/${cliente.id}`);
    };

    const confirmDelete = (cliente) => {
        setSelectedCliente(cliente);
    };

    const handleDelete = async () => {
        if (selectedCliente) {
            setLoading(true);
            try {
                const datosPersonalesId = selectedCliente.DatosPersonale.id;

                // Eliminar Cliente
                await ClienteService.remove(selectedCliente.id);

                // Eliminar DatosPersonales
                await DatosPersonalesService.remove(datosPersonalesId);

                // Actualizar la lista de clientes
                setClientes(clientes.filter((c) => c.id !== selectedCliente.id));
                setSelectedCliente(null);
            } catch (error) {
                console.error('Error al eliminar el registro completo:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const filteredClientes = clientes.filter(cliente =>
        `${cliente.DatosPersonale.nombre} ${cliente.DatosPersonale.apellido} ${cliente.DatosPersonale.correo}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-5xl relative overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-gray-800">
                <button
                    onClick={() => navigate('/ingreso-cliente')}
                    className="bg-yellow-950 text-yellow-400 border border-yellow-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                >
                    <span className="bg-yellow-400 shadow-yellow-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                    Ingresar Cliente
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
                            <th className="px-4 py-3">Correo</th>
                            <th className="px-4 py-3">Género</th>
                            <th className="px-4 py-3">Fecha de Nacimiento</th>
                            <th className="px-4 py-3">Dirección</th>
                            <th className="px-4 py-3">Teléfono</th>
                            <th className="px-4 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClientes.map((cliente, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{cliente.DatosPersonale.nombre}</td>
                                <td className="px-4 py-2">{cliente.DatosPersonale.apellido}</td>
                                <td className="px-4 py-2">{cliente.DatosPersonale.correo}</td>
                                <td className="px-4 py-2">{cliente.DatosPersonale.genero}</td>
                                <td className="px-4 py-2">{cliente.DatosPersonale.fechaNac}</td>
                                <td className="px-4 py-2">{cliente.DatosPersonale.direccion}</td>
                                <td className="px-4 py-2">{cliente.DatosPersonale.telefono}</td>
                                <td className="px-4 py-2 flex space-x-2">
                                    <button
                                        onClick={() => handleSelectCliente(cliente)}
                                        className="bg-sky-950 text-sky-400 border border-sky-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                                    >
                                        Actualizar
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(cliente)}
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

            {selectedCliente && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold">¿Estás seguro de borrar el registro?</h3>
                        <p className="text-gray-600 my-4">
                            Se eliminará toda la información relacionada con este registro.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setSelectedCliente(null)}
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

export default ClienteComponent;
