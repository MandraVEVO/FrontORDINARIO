import React, { useEffect, useState } from 'react';
import MenuService from '../Api/MenuService.js';
import ArticuloService from '../Api/ArticuloService.js';
import { SmileOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, Result } from 'antd';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
    const [menus, setMenus] = useState([]);
    const [articulos, setArticulos] = useState([]);
    const [selectedArticulos, setSelectedArticulos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const data = await MenuService.getAll();
                setMenus(data);
            } catch (error) {
                console.error("Error fetching menus:", error);
            }
        };

        const fetchArticulos = async () => {
            try {
                const data = await ArticuloService.getAll();
                const formattedArticulos = data.map(articulo => ({
                    value: articulo.id,
                    label: articulo.nombre,
                    color: articulo.color || 'blue',
                }));
                setArticulos(formattedArticulos);
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        };

        fetchMenus();
        fetchArticulos();
    }, []);

    const handleAddMenu = async () => {
        try {
            const newMenu = {
                articulos: selectedArticulos.map(articulo => articulo.label),
                CafeteriumId: 1,
            };
            await MenuService.create(newMenu);
            setMenus(await MenuService.getAll());
            setSelectedArticulos([]);
            setIsSuccess(true);
        } catch (error) {
            console.error("Error adding menu:", error);
            setIsSuccess(false);
        } finally {
            setModalVisible(false);
        }
    };

    const handleEditMenu = async () => {
        try {
            const updatedMenu = {
                ...editingMenu,
                articulos: selectedArticulos.map(articulo => articulo.label),
            };
            await MenuService.update(editingMenu.id, updatedMenu);
            setMenus(await MenuService.getAll());
            setEditingMenu(null);
            setSelectedArticulos([]);
            setIsSuccess(true);
        } catch (error) {
            console.error("Error editing menu:", error);
        } finally {
            setModalVisible(false);
        }
    };

    const handleDeleteMenu = async () => {
        try {
            setLoading(true);
            await MenuService.remove(selectedMenu.id);
            setMenus(await MenuService.getAll());
            setSelectedMenu(null);
        } catch (error) {
            console.error("Error deleting menu:", error);
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (menu) => {
        const preSelected = menu.articulos.map(articulo =>
            articulos.find(option => option.label === articulo)
        ).filter(Boolean);

        setEditingMenu(menu);
        setSelectedArticulos(preSelected);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setSelectedArticulos([]);
    };

    const customStyles = {
        control: (base) => ({
            ...base,
            borderRadius: '8px',
            padding: '2px',
            borderColor: '#d1d5db',
            boxShadow: 'none',
            '&:hover': { borderColor: '#a1a1aa' },
        }),
        option: (styles, { data, isFocused, isSelected }) => ({
            ...styles,
            backgroundColor: isSelected ? data.color : isFocused ? '#f3f4f6' : '#fff',
            color: isSelected ? '#fff' : '#000',
            cursor: 'pointer',
        }),
        multiValue: (styles, { data }) => ({
            ...styles,
            backgroundColor: data.color,
            color: '#fff',
            borderRadius: '4px',
            padding: '4px',
        }),
        multiValueLabel: (styles) => ({
            ...styles,
            color: '#fff',
        }),
        multiValueRemove: (styles) => ({
            ...styles,
            color: '#fff',
            ':hover': {
                backgroundColor: '#e11d48',
                color: '#fff',
            },
        }),
    };

    return (
        <div className="p-4">
            <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mb-4"
                onClick={() => navigate("/articulo-component")}
            >
                Artículos
            </button>
            <h1 className="text-2xl font-bold mb-4 text-center">Menús</h1>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setModalVisible(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Ingresar Menú
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {menus.map(menu => (
                    <div
                        key={menu.id}
                        className="border rounded-lg shadow-md p-4 bg-white"
                    >
                        <h2 className="text-xl font-semibold">Menú {menu.id}</h2>
                        <p className="text-gray-600">Artículos: {menu.articulos.join(", ")}</p>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => openEditModal(menu)}
                                className="bg-yellow-500 text-white px-2 py-1 rounded-lg flex items-center gap-1"
                            >
                                <EditOutlined /> Editar
                            </button>
                            <button
                                onClick={() => setSelectedMenu(menu)}
                                className="bg-red-500 text-white px-2 py-1 rounded-lg flex items-center gap-1"
                            >
                                <DeleteOutlined /> Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                visible={modalVisible}
                onCancel={handleModalClose}
                onOk={editingMenu ? handleEditMenu : handleAddMenu}
                title={editingMenu ? "Editar Menú" : "Crear Nuevo Menú"}
                okText={editingMenu ? "Guardar Cambios" : "Guardar"}
                cancelText="Cancelar"
            >
                <h3 className="text-lg font-semibold mb-2">
                    {editingMenu ? "Edita los artículos del menú:" : "Selecciona los artículos para el menú:"}
                </h3>
                <Select
                    isMulti
                    options={articulos}
                    value={selectedArticulos}
                    onChange={setSelectedArticulos}
                    placeholder="Buscar y seleccionar artículos"
                    styles={customStyles}
                />
            </Modal>

            {selectedMenu && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 text-center">
                        <h3 className="text-xl font-bold">¿Estás seguro de borrar el registro?</h3>
                        <p className="text-gray-600 my-4">
                            Se eliminará toda la información relacionada con este registro.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setSelectedMenu(null)}
                                className="px-4 py-2 bg-gray-300 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteMenu}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                                disabled={loading}
                            >
                                {loading ? 'Eliminando...' : 'Borrar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Modal
                visible={isSuccess}
                onCancel={() => setIsSuccess(false)}
                footer={null}
                closable={false}
            >
                <Result
                    icon={<SmileOutlined />}
                    title="¡Operación realizada exitosamente!"
                    extra={
                        <Button type="primary" onClick={() => setIsSuccess(false)}>
                            Continuar
                        </Button>
                    }
                />
            </Modal>
        </div>
    );
};

export default Menu;