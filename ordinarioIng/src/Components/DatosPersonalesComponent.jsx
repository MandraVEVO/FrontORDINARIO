import React, { useEffect, useState } from 'react';
import DatosPersonalesService from '../Api/DatosPersonalesService.js';
import ClienteService from '../Api/ClienteService.js';

const DatosPersonalesComponent = () => {
    const [datosPersonales, setDatosPersonales] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        DatosPersonalesService.getAll()
            .then(response => {
                console.log("Datos obtenidos de la API:", response);
                setDatosPersonales(response);
            })
            .catch(error => {
                console.error("Error al obtener datos:", error);
            });
    }, []);

    const filteredDatos = datosPersonales.filter(dato =>
        `${dato.nombre} ${dato.apellido} ${dato.correo}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <div className="pb-4 bg-white dark:bg-gray-900">
                <label htmlFor="table-search" className="sr-only">Buscar</label>
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 19L15 15M10 14a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" />
                        </svg>
                    </div>
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
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3">Nombre</th>
                        <th scope="col" className="px-6 py-3">Apellido</th>
                        <th scope="col" className="px-6 py-3">Correo</th>
                        <th scope="col" className="px-6 py-3">Género</th>
                        <th scope="col" className="px-6 py-3">Fecha de Nac.</th>
                        <th scope="col" className="px-6 py-3">Dirección</th>
                        <th scope="col" className="px-6 py-3">Teléfono</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {filteredDatos.map((dato, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="p-4">
                                <div className="flex items-center">
                                </div>
                            </td>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {dato.nombre}
                            </th>
                            <td className="px-6 py-4">{dato.apellido}</td>
                            <td className="px-6 py-4">{dato.correo}</td>
                            <td className="px-6 py-4">{dato.genero}</td>
                            <td className="px-6 py-4">{dato.fechaNac}</td>
                            <td className="px-6 py-4">{dato.direccion}</td>
                            <td className="px-6 py-4">{dato.telefono}</td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DatosPersonalesComponent;
