import React, { useEffect, useState } from 'react';
import BaristaService from '../Api/BaristaService.js';

const BaristaComponent = () => {
    const [baristas, setBaristas] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        BaristaService.getAll()
            .then(response => {
                console.log("Datos obtenidos de la API:", response);
                setBaristas(response);
            })
            .catch(error => {
                console.error("Error al obtener datos:", error);
            });
    }, []);

    const handleEdit = (barista) => {
        // Lógica para editar el barista seleccionado
        console.log("Editar barista:", barista);
        // Aquí puedes redirigir a una página de edición o mostrar un formulario modal
    };

    const handleDelete = (baristaId) => {
        // Lógica para eliminar el barista seleccionado
        console.log("Eliminar barista con ID:", baristaId);
        // Puedes llamar a una función en BaristaService para eliminar el barista y luego actualizar la lista
    };

    const filteredBaristas = baristas.filter(barista =>
        `${barista.Empleado.DatosPersonale.nombre} ${barista.Empleado.DatosPersonale.apellido} ${barista.Empleado.DatosPersonale.correo}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-none overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-gray-800">
                <div className="pb-4 px-6 pt-6 bg-white dark:bg-gray-800">
                    <button class="bg-blue-500 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded-full "> Ingresar Barista</button>
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
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{barista.Empleado.DatosPersonale.nombre}</td>
                                <td className="px-4 py-2">{barista.Empleado.DatosPersonale.apellido}</td>
                                
                               
                                <td className="px-4 py-2">{barista.especialidad.join(', ')}</td>
                                <td className="px-4 py-2">{barista.Empleado.cargoEmpleado}</td>
                                <td className="px-4 py-2">{barista.Empleado.costoHora}</td>
                                <td className="px-4 py-2">{barista.Empleado.curp}</td>
                                
                                <td className="px-4 py-2">{barista.Empleado.Cafeterium.nombre}</td>
                                <td className="px-4 py-2">{barista.Empleado.Cafeterium.ubicacion}</td>
                               
                                
                                <td className="px-4 py-2 flex space-x-2">
                                    <button 
                                        onClick={() => handleEdit(barista)}
                                        className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-700 rounded-lg"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(barista.Empleado.id)}
                                        className="px-3 py-1 text-white bg-red-500 hover:bg-red-700 rounded-lg"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BaristaComponent;
