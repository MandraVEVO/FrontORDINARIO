import React, { useEffect, useState } from 'react';
import MenuService from '../Api/MenuService.js';
import { SmileOutlined } from '@ant-design/icons';
import { Button, Modal, Result } from 'antd';

const Menu = () => {
    const [menus, setMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newMenuItems, setNewMenuItems] = useState(""); // Para ingresar o editar artículos
    const [modalVisible, setModalVisible] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); // Para determinar si la operación fue exitosa

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const data = await MenuService.getAll();
                setMenus(data);
            } catch (error) {
                console.error("Error fetching menus:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, []);

    const handleMenuClick = (id) => {
        const menu = menus.find(m => m.id === id);
        setSelectedMenu(menu);
        setNewMenuItems(menu.articulos.join(", ")); // Prepara los artículos para editar
    };

    const handleAddMenu = async () => {
        try {
            const newMenu = {
                articulos: newMenuItems.split(",").map(item => item.trim()),
                CafeteriumId: 1
            };
            await MenuService.create(newMenu);
            setNewMenuItems(""); // Limpiar campo
            setMenus(await MenuService.getAll()); // Refrescar lista
            setIsSuccess(true); // Operación exitosa
        } catch (error) {
            console.error("Error adding menu:", error);
            setIsSuccess(false); // Operación fallida
        } finally {
            setModalVisible(true); // Mostrar modal
        }
    };

    const handleEditMenu = async () => {
        if (selectedMenu) {
            try {
                const updatedMenu = {
                    ...selectedMenu,
                    articulos: newMenuItems.split(",").map(item => item.trim())
                };
                await MenuService.update(selectedMenu.id, updatedMenu);
                setMenus(await MenuService.getAll());
                setSelectedMenu(null); // Volver a la lista de menús
                setNewMenuItems(""); // Limpiar campo
                setIsSuccess(true); // Operación exitosa
            } catch (error) {
                console.error("Error updating menu:", error);
                setIsSuccess(false); // Operación fallida
            } finally {
                setModalVisible(true); // Mostrar modal
            }
        }
    };

    const handleDeleteMenu = async () => {
        if (selectedMenu) {
            try {
                await MenuService.remove(selectedMenu.id);
                setMenus(await MenuService.getAll());
                setSelectedMenu(null); // Volver a la lista de menús
                setNewMenuItems(""); // Limpiar campo
                setIsSuccess(true); // Operación exitosa
            } catch (error) {
                console.error("Error deleting menu:", error);
                setIsSuccess(false); // Operación fallida
            } finally {
                setModalVisible(true); // Mostrar modal
            }
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    const handleBackToMenus = () => {
        setSelectedMenu(null); // Volver a la lista de menús
        setNewMenuItems(""); // Limpiar campo de entrada
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="p-4">
            {selectedMenu ? (
                <div>
                    <button onClick={handleBackToMenus} className="text-blue-500 underline mb-4">
                        Volver a Menús
                    </button>
                    <h2 className="text-2xl font-bold mb-4">Detalles del Menú {selectedMenu.id}</h2>
                    <ul className="list-disc list-inside mb-4">
                        {selectedMenu.articulos.map((articulo, index) => (
                            <li key={index}>{articulo}</li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        value={newMenuItems}
                        onChange={(e) => setNewMenuItems(e.target.value)}
                        placeholder="Artículos separados por comas"
                        className="border p-2 mb-4 w-full"
                    />
                    <div className="flex gap-4">
                        <button onClick={handleEditMenu} className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
                            Editar Menú
                        </button>
                        <button onClick={handleDeleteMenu} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                            Borrar Menú
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-4 text-center">Menús</h1>
                    <div className="flex gap-4 mb-6">
                        <input
                            type="text"
                            value={newMenuItems}
                            onChange={(e) => setNewMenuItems(e.target.value)}
                            placeholder="Artículos separados por comas"
                            className="border p-2 w-full"
                        />
                        <button onClick={handleAddMenu} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                            Ingresar Menú
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {menus.map(menu => (
                            <div
                                key={menu.id}
                                className="border rounded-lg shadow-md p-4 bg-white cursor-pointer hover:bg-gray-100"
                                onClick={() => handleMenuClick(menu.id)}
                            >
                                <h2 className="text-xl font-semibold">Menú {menu.id}</h2>
                                <p className="text-gray-600">Artículos: {menu.articulos.join(", ")}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
            
            {/* Modal para mostrar el resultado de la operación */}
            <Modal
                visible={modalVisible}
                onCancel={handleModalClose}
                footer={null}
                closable={false}
            >
                {isSuccess ? (
                    <Result
                        icon={<SmileOutlined />}
                        title="¡Operación exitosa!"
                        extra={<Button type="primary" onClick={handleModalClose}>Continuar</Button>}
                    />
                ) : (
                    <Result
                        status="warning"
                        title="Hay algunos problemas con tu operación."
                        extra={<Button type="primary" onClick={handleModalClose}>Volver a Intentarlo</Button>}
                    />
                )}
            </Modal>
        </div>
    );
};

export default Menu;
