import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MenuService from '../Api/MenuService'; // Ruta actualizada

const MenuDetail = () => {
    const { id } = useParams();
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [articulos, setArticulos] = useState('');

    useEffect(() => {
        const fetchMenuById = async () => {
            try {
                const data = await MenuService.getById(id);
                setMenu(data);
                // Inicializa los artículos del menú en el estado para el input
                setArticulos(data.articulos.join(', ')); // Separa por comas
            } catch (error) {
                console.error(`Error fetching menu with id ${id}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuById();
    }, [id]);

    const handleInputChange = (event) => {
        setArticulos(event.target.value); // Actualiza el estado con el valor del input
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Validar que haya al menos un artículo ingresado
        if (articulos.trim() === '') {
            alert('Por favor, ingresa al menos un artículo para actualizar.');
            return;
        }

        try {
            const updatedMenu = {
                ...menu,
                articulos: articulos.split(',').map(articulo => articulo.trim()), // Convierte el string de nuevo a array
            };
            await MenuService.update(id, updatedMenu); // Asegúrate de que el método update esté implementado en MenuService
            alert('Menú actualizado con éxito.');
        } catch (error) {
            console.error('Error updating menu:', error);
            alert('Error al actualizar el menú.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que deseas borrar este menú?')) {
            try {
                await MenuService.remove(id); // Asegúrate de que el método remove esté implementado en MenuService
                alert('Menú borrado con éxito.');
                // Aquí puedes redirigir a otra página si es necesario
            } catch (error) {
                console.error('Error deleting menu:', error);
                alert('Error al borrar el menú.');
            }
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Detalles del Menú {menu.id}</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <label htmlFor="articulos" className="block text-lg mb-2">Artículos:</label>
                <input
                    type="text"
                    id="articulos"
                    value={articulos} // El input muestra los artículos actuales para editar
                    onChange={handleInputChange} // Actualiza el estado en cada cambio
                    className="border border-gray-300 rounded p-2 w-full"
                />
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Actualizar Menú
                </button>
            </form>
            <button
                onClick={handleDelete}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
                Borrar Menú
            </button>
            <h2 className="text-xl font-semibold mt-4">Artículos actuales:</h2>
            <ul className="list-disc pl-5">
                {menu.articulos.map((articulo, index) => (
                    <li key={index} className="text-lg">{articulo}</li>
                ))}
            </ul>
        </div>
    );
};

export default MenuDetail;
