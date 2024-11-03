import React, { useEffect, useState } from 'react';
import DatosPersonalesService from '../Api/DatosPersonalesService.js';
import ClienteService from '../Api/ClienteService.js';
import AdministrativoService from '../Api/AdministrativoService.js';
import BaristaService from '../Api/BaristaService.js';

const DatosPersonalesComponent = () => {
    const [datosPersonales, setDatosPersonales] = useState([]);
    const [ocupaciones, setOcupaciones] = useState({});
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchDatosPersonales = async () => {
            try {
                const datosPersonalesData = await DatosPersonalesService.getAll();
                setDatosPersonales(datosPersonalesData);

                const ocupacionMap = {};
                const [clientes, administrativos, baristas] = await Promise.all([
                    ClienteService.getAll(),
                    AdministrativoService.getAll(),
                    BaristaService.getAll(),
                ]);

                clientes.forEach(cliente => {
                    if (cliente.DatosPersonaleId) {
                        ocupacionMap[cliente.DatosPersonaleId] = 'Cliente';
                    }
                });
                administrativos.forEach(administrativo => {
                    if (administrativo.Empleado && administrativo.Empleado.DatosPersonaleId) {
                        ocupacionMap[administrativo.Empleado.DatosPersonaleId] = 'Administrativo';
                    }
                });
                baristas.forEach(barista => {
                    if (barista.Empleado && barista.Empleado.DatosPersonaleId) {
                        ocupacionMap[barista.Empleado.DatosPersonaleId] = 'Barista';
                    }
                });

                setOcupaciones(ocupacionMap);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };

        fetchDatosPersonales();
    }, []);

    const filteredDatos = datosPersonales.filter(dato =>
        `${dato.nombre || ''} ${dato.apellido || ''} ${dato.correo || ''}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-800 text-gray-100 p-10">
            <div className="p-8 bg-gray-900 rounded-lg shadow-lg w-full">
                <h1 className="text-3xl font-bold text-center mb-6">Lista de Datos Personales</h1>
                <div className="relative shadow-md sm:rounded-lg">
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
                    <table className="w-full text-lg text-left text-gray-400">
                        <thead className="text-base text-gray-300 uppercase bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-4">Nombre</th>
                                <th scope="col" className="px-6 py-4">Apellido</th>
                                <th scope="col" className="px-6 py-4">Correo</th>
                                <th scope="col" className="px-6 py-4">Género</th>
                                <th scope="col" className="px-6 py-4">Fecha de Nac.</th>
                                <th scope="col" className="px-6 py-4">Dirección</th>
                                <th scope="col" className="px-6 py-4">Teléfono</th>
                                <th scope="col" className="px-6 py-4">Ocupación</th>
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
                                        <td className="px-6 py-4">{ocupaciones[usuario.id] || "N/A"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-8">
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
