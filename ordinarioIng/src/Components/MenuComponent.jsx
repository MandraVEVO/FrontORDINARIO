import React, { useEffect, useState } from 'react';
import MenuService from '../Api/MenuService.js';
import ArticuloService from '../Api/ArticuloService.js';
import { SmileOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Result, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { confirm } = Modal;

const Menu = () => {
    const [menus, setMenus] = useState([]);
    const [articulos, setArticulos] = useState([]); // Lista de artículos disponibles
    const [selectedArticulos, setSelectedArticulos] = useState([]); // Artículos seleccionados para el nuevo menú
    const [modalVisible, setModalVisible] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); // Para determinar si la operación fue exitosa
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
            setMenus(await MenuService.getAll()); // Refrescar lista de menús
            setSelectedArticulos([]); // Limpiar selección
            setIsSuccess(true); // Operación exitosa
        } catch (error) {
            console.error("Error adding menu:", error);
            setIsSuccess(false); // Operación fallida
        } finally {
            setModalVisible(false); // Cerrar modal
        }
    };

    const handleDeleteMenu = async (id) => {
        try {
            await MenuService.remove(id);
            setMenus(await MenuService.getAll()); // Refrescar lista de menús
            message.success("Menú eliminado correctamente.");
        } catch (error) {
            console.error("Error deleting menu:", error);
            message.error("Hubo un error al eliminar el menú.");
        }
    };

    const showDeleteConfirm = (id) => {
        confirm({
            title: "¿Estás seguro de eliminar este menú?",
            icon: <ExclamationCircleOutlined />,
            content: "Esta acción no se puede deshacer.",
            okText: "Sí, eliminar",
            okType: "danger",
            cancelText: "Cancelar",
            onOk: () => handleDeleteMenu(id),
        });
    };

    const handleEditMenu = async (id) => {
        const updatedMenu = {
            articulos: selectedArticulos,
            CafeteriumId: 1,
        };
        try {
            await MenuService.update(id, updatedMenu);
            setMenus(await MenuService.getAll()); // Refrescar lista de menús
            message.success("Menú actualizado correctamente.");
        } catch (error) {
            console.error("Error updating menu:", error);
            message.error("Hubo un error al actualizar el menú.");
        }
    };

    const handleModalOpen = () => {
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setSelectedArticulos([]); // Limpiar selección
    };

    const handleSelectChange = (value) => {
        setSelectedArticulos(value); // Actualizar selección
    };

    return (
        <div className="p-4">
            {/* Botón para ir a Artículos */}
            <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mb-4"
                onClick={() => navigate('/articulo-component')}
            >
                Artículos
            </button>

            <h1 className="text-2xl font-bold mb-4 text-center">Menús</h1>

            {/* Botón para abrir modal de creación de menú */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={handleModalOpen}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Ingresar Menú
                </button>
            </div>

            {/* Mostrar lista de menús */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {menus.map(menu => (
                    <div
                        key={menu.id}
                        className="border rounded-lg shadow-md p-4 bg-white hover:bg-gray-100"
                    >
                        <h2 className="text-xl font-semibold">Menú {menu.id}</h2>
                        <p className="text-gray-600">Artículos: {menu.articulos.join(", ")}</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => handleEditMenu(menu.id)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => showDeleteConfirm(menu.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
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

            {/* Resultado de operación */}
            <Modal
                visible={isSuccess}
                onCancel={() => setIsSuccess(false)}
                footer={null}
                closable={false}
            >
                <Result
                    icon={<SmileOutlined />}
                    title="¡Menú creado exitosamente!"
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
