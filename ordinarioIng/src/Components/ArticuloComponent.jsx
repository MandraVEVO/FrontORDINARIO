import React, { useEffect, useState } from 'react';
import ArticuloService from '../Api/ArticuloService';

const ArticuloComponent = () => {
  const [articulos, setArticulos] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedArticulo, setSelectedArticulo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newArticulo, setNewArticulo] = useState({ nombre: '', precio: '', descripcion: '' });
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Cargar todos los artículos al iniciar el componente
  useEffect(() => {
    ArticuloService.getAll()
      .then((response) => setArticulos(response))
      .catch((error) => console.error('Error al obtener los artículos:', error));
  }, []);

  const handleDelete = async () => {
    if (selectedArticulo) {
      setLoading(true);
      try {
        await ArticuloService.remove(selectedArticulo.id);
        setArticulos(articulos.filter((articulo) => articulo.id !== selectedArticulo.id));
        alert('El artículo ha sido eliminado exitosamente.');
        setSelectedArticulo(null);
        setShowDeleteConfirmation(false);
      } catch (error) {
        console.error('Error al eliminar el artículo:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddArticulo = async () => {
    setLoading(true);
    try {
      const createdArticulo = await ArticuloService.create(newArticulo);
      setArticulos([...articulos, createdArticulo]);
      alert('El artículo ha sido agregado exitosamente.');
      setShowForm(false);
      setNewArticulo({ nombre: '', precio: '', descripcion: '' });
    } catch (error) {
      console.error('Error al agregar el artículo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditArticulo = async () => {
    setLoading(true);
    try {
      await ArticuloService.update(selectedArticulo.id, selectedArticulo);
      setArticulos(
        articulos.map((articulo) =>
          articulo.id === selectedArticulo.id ? selectedArticulo : articulo
        )
      );
      alert('El artículo ha sido actualizado exitosamente.');
      setShowEditForm(false);
      setSelectedArticulo(null);
    } catch (error) {
      console.error('Error al actualizar el artículo:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticulos = articulos.filter((articulo) =>
    `${articulo.nombre} ${articulo.descripcion}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-none overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center px-6 pt-6 pb-4 bg-white dark:bg-gray-800">
          <button
            onClick={() => setShowForm(true)}
            className="bg-yellow-950 text-yellow-400 border border-yellow-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
            >
            Agregar Artículo
          </button>
          <input
            type="text"
            placeholder="Buscar..."
            className="block w-80 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticulos.map((articulo) => (
              <tr
                key={articulo.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-4 py-2">{articulo.nombre}</td>
                <td className="px-4 py-2">{articulo.precio}</td>
                <td className="px-4 py-2">{articulo.descripcion}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedArticulo(articulo);
                      setShowEditForm(true);
                      setShowDeleteConfirmation(false); // Cerrar cualquier advertencia de eliminación
                    }}
                    className="bg-sky-950 text-sky-400 border border-sky-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                                    >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setSelectedArticulo(articulo);
                      setShowDeleteConfirmation(true);
                      setShowEditForm(false); // Cerrar el formulario de edición
                    }}
                    className="flex justify-center items-center gap-2 w-28 h-12 cursor-pointer rounded-md shadow-2xl text-white font-semibold bg-gradient-to-r from-[#fb7185] via-[#e11d48] to-[#be123c] hover:shadow-xl hover:shadow-red-500 hover:scale-105 duration-300 hover:from-[#be123c] hover:to-[#fb7185]">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario de agregar */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Agregar Artículo</h3>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={newArticulo.nombre}
                  onChange={(e) => setNewArticulo({ ...newArticulo, nombre: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Precio</label>
                <input
                  type="number"
                  value={newArticulo.precio}
                  onChange={(e) => setNewArticulo({ ...newArticulo, precio: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  value={newArticulo.descripcion}
                  onChange={(e) => setNewArticulo({ ...newArticulo, descripcion: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAddArticulo}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulario de edición */}
      {showEditForm && selectedArticulo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Editar Artículo</h3>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={selectedArticulo.nombre}
                  onChange={(e) =>
                    setSelectedArticulo({ ...selectedArticulo, nombre: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Precio</label>
                <input
                  type="number"
                  value={selectedArticulo.precio}
                  onChange={(e) =>
                    setSelectedArticulo({ ...selectedArticulo, precio: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  value={selectedArticulo.descripcion}
                  onChange={(e) =>
                    setSelectedArticulo({ ...selectedArticulo, descripcion: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleEditArticulo}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmación de eliminación */}
      {showDeleteConfirmation && selectedArticulo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">¿Seguro que deseas eliminar este artículo?</h3>
            <div className="flex justify-between">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticuloComponent;