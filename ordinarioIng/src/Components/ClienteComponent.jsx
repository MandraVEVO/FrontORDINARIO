import React, { useEffect, useState } from 'react';
import ClienteService from '../Api/ClienteService.js';

const ClienteComponent = () => {
    const [clientes, setClientes] = useState([]);
    const [search, setSearch] = useState('');

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

    const filteredClientes = clientes.filter(cliente =>
        `${cliente.DatosPersonale.nombre} ${cliente.DatosPersonale.apellido} ${cliente.DatosPersonale.correo}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-5xl relative overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-gray-800">
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
                            <th className="px-6 py-3">Nombre</th>
                            <th className="px-6 py-3">Apellido</th>
                            <th className="px-6 py-3">Correo</th>
                            <th className="px-6 py-3">Género</th>
                            <th className="px-6 py-3">Fecha de Nacimiento</th>
                            <th className="px-6 py-3">Dirección</th>
                            <th className="px-6 py-3">Teléfono</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClientes.map((cliente, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{cliente.DatosPersonale.nombre}</td>
                                <td className="px-6 py-4">{cliente.DatosPersonale.apellido}</td>
                                <td className="px-6 py-4">{cliente.DatosPersonale.correo}</td>
                                <td className="px-6 py-4">{cliente.DatosPersonale.genero}</td>
                                <td className="px-6 py-4">{cliente.DatosPersonale.fechaNac}</td>
                                <td className="px-6 py-4">{cliente.DatosPersonale.direccion}</td>
                                <td className="px-6 py-4">{cliente.DatosPersonale.telefono}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClienteComponent;
