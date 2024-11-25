import React, { useEffect, useState } from 'react';
import MenuService from '../Api/MenuService.js';
import ArticuloService from '../Api/ArticuloService.js';
import { SmileOutlined } from '@ant-design/icons';
import { Button, Modal, Result, Select } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const Menu = () => {
    const [menus, setMenus] = useState([]);
    const [articulos, setArticulos] = useState([]);
    const [selectedArticulos, setSelectedArticulos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [menuToEdit, setMenuToEdit] = useState(null);
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
                setArticulos(data);
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
                articulos: selectedArticulos.map(articulo => articulo),
                CafeteriumId: 1
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
                ...menuToEdit,
                articulos: selectedArticulos
            };
            await MenuService.update(menuToEdit.id, updatedMenu);
            setMenus(await MenuService.getAll());
            setIsSuccess(true);
        } catch (error) {
            console.error("Error updating menu:", error);
            setIsSuccess(false);
        } finally {
            setEditModalVisible(false);
        }
    };

    const handleDeleteMenu = async (id) => {
        try {
            await MenuService.remove(id);
            setMenus(await MenuService.getAll());
        } catch (error) {
            console.error("Error deleting menu:", error);
        }
    };

    const openEditModal = (menu) => {
        setMenuToEdit(menu);
        setSelectedArticulos(menu.articulos);
        setEditModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setSelectedArticulos([]);
    };

    const handleEditModalClose = () => {
        setEditModalVisible(false);
        setSelectedArticulos([]);
    };

    const handleSelectChange = (value) => {
        setSelectedArticulos(value);
    };

    return (
        <div className="p-4">
            <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mb-4"
                onClick={() => navigate('/articulo-component')}
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
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => openEditModal(menu)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDeleteMenu(menu.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para crear nuevo menú */}
            <Modal
                visible={modalVisible}
                onCancel={handleModalClose}
                onOk={handleAddMenu}
                title="Crear Nuevo Menú"
                okText="Guardar"
                cancelText="Cancelar"
            >
                <h3 className="text-lg font-semibold mb-2">Selecciona los artículos para el menú:</h3>
                <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    placeholder="Buscar y seleccionar artículos"
                    style={{ width: '100%' }}
                    onChange={handleSelectChange}
                    value={selectedArticulos}
                >
                    {articulos.map(articulo => (
                        <Option key={articulo.id} value={articulo.nombre}>
                            {articulo.nombre}
                        </Option>
                    ))}
                </Select>
            </Modal>

            {/* Modal para editar menú */}
            <Modal
                visible={editModalVisible}
                onCancel={handleEditModalClose}
                onOk={handleEditMenu}
                title={`Editar Menú ${menuToEdit?.id}`}
                okText="Guardar Cambios"
                cancelText="Cancelar"
            >
                <h3 className="text-lg font-semibold mb-2">Edita los artículos del menú:</h3>
                <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    placeholder="Buscar y seleccionar artículos"
                    style={{ width: '100%' }}
                    onChange={handleSelectChange}
                    value={selectedArticulos}
                >
                    {articulos.map(articulo => (
                        <Option key={articulo.id} value={articulo.nombre}>
                            {articulo.nombre}
                        </Option>
                    ))}
                </Select>
            </Modal>

            {/* Resultado de operación */}
            <Modal
                visible={isSuccess}
                onCancel={() => setIsSuccess(false)}
                footer={null}
                closable={false}
            >
                <Result
                    icon={<SmileOutlined />}
                    title="¡Operación exitosa!"
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
