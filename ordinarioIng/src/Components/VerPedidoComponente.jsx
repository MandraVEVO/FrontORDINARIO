import React, { useEffect, useState } from 'react';
import PedidoService from '../Api/PedidoService.js';
import ClienteService from '../Api/ClienteService.js';
import DatosPersonalesService from '../Api/DatosPersonalesService.js';
import FacturaService from '../Api/FacturaService.js';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const VerPedidoComponent = () => {
    const [pedidos, setPedidos] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Cargar pedidos desde la API al montar el componente
    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const pedidosData = await PedidoService.getAll();
                const pedidosWithDetails = await Promise.all(
                    pedidosData.map(async (pedido) => {
                        let cliente = null;
                        let datosPersonales = null;
                        let factura = null;

                        if (pedido.ClienteId) {
                            cliente = await ClienteService.getById(pedido.ClienteId);
                            if (cliente.DatosPersonaleId) {
                                datosPersonales = await DatosPersonalesService.getById(cliente.DatosPersonaleId);
                            }
                        }

                        if (pedido.FacturaId) {
                            factura = await FacturaService.getById(pedido.FacturaId);
                        }

                        return {
                            ...pedido,
                            cliente: cliente ? { ...cliente, DatosPersonale: datosPersonales } : null,
                            factura,
                        };
                    })
                );
                setPedidos(pedidosWithDetails);
            } catch (error) {
                console.error('Error al obtener los pedidos:', error);
            }
        };

        fetchPedidos();
    }, []);

    // Manejar la selección de un pedido para actualizar
    const handleSelectPedido = (pedido) => {
        navigate(`/actualizar-pedido/${pedido.id}`);
    };

    // Confirmar la eliminación de un pedido
    const confirmDelete = (pedido) => {
        setSelectedPedido(pedido);
    };

    // Eliminar el pedido y sus datos relacionados
    const handleDelete = async () => {
        if (selectedPedido) {
            setLoading(true);
            try {
                const pedidoId = selectedPedido.id;
                

                // Eliminar Factura
                if (selectedPedido.factura?.id) {
                    await FacturaService.remove(selectedPedido.factura.id);
                }

               

                // Eliminar Pedido
                await PedidoService.remove(pedidoId);

                // Actualizar la lista de pedidos
                setPedidos(pedidos.filter((p) => p.id !== pedidoId));
                setSelectedPedido(null);
            } catch (error) {
                console.error('Error al eliminar el pedido:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    // Filtrar pedidos según el término de búsqueda
    const filteredPedidos = pedidos.filter((pedido) => {
        const datosPersonales = pedido?.cliente?.DatosPersonale;
        if (!datosPersonales) return false;
        const nombreCompleto = `${datosPersonales.nombre} ${datosPersonales.apellido} ${datosPersonales.correo}`;
        return nombreCompleto.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-none overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-gray-800">
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
                            <th className="px-4 py-3">Artículos</th>
                            <th className="px-4 py-3">Nombre de pedido</th>
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3">Monto Total</th>
                            <th className="px-4 py-3">Teléfono</th>
                            <th className="px-4 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPedidos.map((pedido, index) => (
                            <tr
                                key={index}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {pedido?.cliente?.DatosPersonale?.nombre || 'N/A'}
                                </td>
                                <td className="px-4 py-2">{pedido?.cliente?.DatosPersonale?.apellido || 'N/A'}</td>
                                <td className="px-4 py-2">
                                    {pedido?.articulos?.join(', ') || 'No hay artículos'}
                                </td>
                                <td className="px-4 py-2">{pedido.factura.pedido}</td>
                                <td className="px-4 py-2">
                                    {pedido.fecha
                                        ? format(new Date(pedido.fecha), 'dd/MM/yyyy')
                                        : pedido.factura?.fecha
                                        ? format(new Date(pedido.factura.fecha), 'dd/MM/yyyy')
                                        : 'N/A'}
                                </td>
                                <td className="px-4 py-2">{pedido.factura?.montoTotal || 'N/A'}</td>
                                <td className="px-4 py-2">{pedido?.cliente?.DatosPersonale?.telefono || 'N/A'}</td>
                                <td className="px-4 py-2 flex space-x-2">
                                    
                                    <button
                                        onClick={() => confirmDelete(pedido)}
                                        className="bg-red-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-600 duration-300"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedPedido && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold">¿Estás seguro de borrar el pedido?</h3>
                        <p className="text-gray-600 my-4">
                            Se eliminará toda la información relacionada con este pedido.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setSelectedPedido(null)}
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

export default VerPedidoComponent;