import React, { useEffect, useState } from 'react';
import DatosPersonalesService from '../Api/DatosPersonalesService.js';

const DatosPersonalesComponent = () => {
    const [datosPersonales, setDatosPersonales] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        DatosPersonalesService.getAll()
            .then(response => {
                console.log("Datos obtenidos de la API:", response);  // Muestra la respuesta de la API en la consola
                setDatosPersonales(response);  // Asegúrate de asignar response aquí
            })
            .catch(error => {
                console.error("Error al obtener datos:", error);
            });
    }, []);

    const filteredDatos = datosPersonales.filter(dato =>
        `${dato.nombre || ''} ${dato.apellido || ''} ${dato.correo || ''}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-800 text-gray-100 p-10">
            <div className="max-w-5xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Lista de Datos Personales</h1>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="pb-4">
                        <label htmlFor="table-search" className="sr-only">Buscar</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 19L15 15M10 14a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" />
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                id="table-search" 
                                className="block w-80 p-3 pl-10 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Buscar..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <table className="w-full text-base text-left text-gray-400">
                        <thead className="text-sm text-gray-300 uppercase bg-gray-700">
                            <tr>
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
                            {filteredDatos.length > 0 ? (
                                filteredDatos.map((usuario, index) => (
                                    <tr key={index} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                                            {usuario.nombre || "N/A"}
                                        </th>
                                        <td className="px-6 py-4">{usuario.apellido || "N/A"}</td>
                                        <td className="px-6 py-4">{usuario.correo || "N/A"}</td>
                                        <td className="px-6 py-4">{usuario.genero || "N/A"}</td>
                                        <td className="px-6 py-4">{usuario.fechaNac || "N/A"}</td>
                                        <td className="px-6 py-4">{usuario.direccion || "N/A"}</td>
                                        <td className="px-6 py-4">{usuario.telefono || "N/A"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        No hay datos disponibles.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DatosPersonalesComponent;
