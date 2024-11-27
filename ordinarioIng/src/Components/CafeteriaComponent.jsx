import React, { useEffect, useState } from 'react';
import CafeteriaService from '../Api/CafeteriaService';
import MenuService from '../Api/MenuService';
import { SmileOutlined } from '@ant-design/icons';
import { Button, Modal, Result } from 'antd';

const CafeteriaComponent = () => {
    const [cafeterias, setCafeterias] = useState([]);
    const [selectedCafeteria, setSelectedCafeteria] = useState(null);
    const [menus, setMenus] = useState([]);
    const [newCafeteriaName, setNewCafeteriaName] = useState("");
    const [newCafeteriaLocation, setNewCafeteriaLocation] = useState("");
    const [selectedMenuId, setSelectedMenuId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const fetchCafeterias = async () => {
            try {
                const data = await CafeteriaService.getAll();
                setCafeterias(data);
            } catch (error) {
                console.error("Error fetching cafeterias:", error);
            }
        };

        const fetchMenus = async () => {
            try {
                const data = await MenuService.getAll();
                setMenus(data);
            } catch (error) {
                console.error("Error fetching menus:", error);
            }
        };

        fetchCafeterias();
        fetchMenus();
    }, []);

    const handleCafeteriaClick = (id) => {
        const cafeteria = cafeterias.find(c => c.id === id);
        setSelectedCafeteria(cafeteria);
        setSelectedMenuId(cafeteria.MenuId); // Establecer el menú para la edición
    };

    const handleAddCafeteria = async () => {
        try {
            const newCafeteria = {
                nombre: newCafeteriaName,
                ubicacion: newCafeteriaLocation,
                empleado: [],
                MenuId: selectedMenuId,
            };
            console.log("Adding new cafeteria:", newCafeteria);
            await CafeteriaService.create(newCafeteria);
            const updatedCafeterias = await CafeteriaService.getAll();
            console.log("Updated cafeterias:", updatedCafeterias);
            setCafeterias(updatedCafeterias);
            setNewCafeteriaName(""); // Resetea el nombre
            setNewCafeteriaLocation(""); // Resetea la ubicación
            setSelectedMenuId(null); // Resetea el menú seleccionado para evitar que se guarde
            setIsSuccess(true);
        } catch (error) {
            console.error("Error adding cafeteria:", error);
            setIsSuccess(false);
        } finally {
            setModalVisible(true);
        }
    };

    const handleEditCafeteria = async () => {
        if (selectedCafeteria) {
            try {
                const updatedCafeteria = {
                    ...selectedCafeteria,
                    nombre: selectedCafeteria.nombre,
                    ubicacion: selectedCafeteria.ubicacion,
                    MenuId: selectedMenuId,  // Mantén el valor seleccionado si es una actualización
                };
                await CafeteriaService.update(selectedCafeteria.id, updatedCafeteria);
                setCafeterias(await CafeteriaService.getAll());
                setSelectedCafeteria(null);
                setSelectedMenuId(null); // Resetea el menú seleccionado tras la actualización
                setIsSuccess(true);
            } catch (error) {
                console.error("Error updating cafeteria:", error);
                setIsSuccess(false);
            } finally {
                setModalVisible(true);
            }
        }
    };

    const handleDeleteCafeteria = async () => {
        Modal.confirm({
            title: "¿Estás seguro de que deseas eliminar esta cafetería?",
            content: "Esta acción no se puede deshacer.",
            okText: "Eliminar",
            cancelText: "Cancelar",
            onOk: async () => {
                try {
                    await CafeteriaService.remove(selectedCafeteria.id);
                    setCafeterias(await CafeteriaService.getAll());
                    setSelectedCafeteria(null);
                    setSelectedMenuId(null); // Resetea el menú tras eliminar
                    setIsSuccess(true);
                } catch (error) {
                    console.error("Error deleting cafeteria:", error);
                    setIsSuccess(false);
                } finally {
                    setModalVisible(true);
                }
            },
        });
    };

    const handleCancelEdit = () => {
        setSelectedCafeteria(null);
        setSelectedMenuId(null); // Resetea el menú seleccionado al cancelar la edición
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    return (
        <div className="p-4">
            {selectedCafeteria ? (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Editar Cafetería</h2>
                    <input
                        type="text"
                        value={selectedCafeteria.nombre}
                        onChange={(e) =>
                            setSelectedCafeteria({ ...selectedCafeteria, nombre: e.target.value })
                        }
                        placeholder="Nombre de la cafetería"
                        className="border p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        value={selectedCafeteria.ubicacion}
                        onChange={(e) =>
                            setSelectedCafeteria({ ...selectedCafeteria, ubicacion: e.target.value })
                        }
                        placeholder="Ubicación de la cafetería"
                        className="border p-2 mb-4 w-full"
                    />
                    <select
                        value={selectedMenuId || ""}
                        onChange={(e) => setSelectedMenuId(e.target.value)}
                        className="border p-2 mb-4 w-full"
                    >
                        <option value="">Seleccionar Menú</option>
                        {menus.map(menu => (
                            <option key={menu.id} value={menu.id}>{`Menú ${menu.id}`}</option>
                        ))}
                    </select>
                    <div className="flex gap-4">
                        <button onClick={handleEditCafeteria} className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
                            Guardar Cambios
                        </button>
                        <button onClick={handleCancelEdit} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                            Cancelar
                        </button>
                        <button onClick={handleDeleteCafeteria} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                            Borrar Cafetería
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-4">Cafeterías</h1>
                    <div className="flex gap-4 mb-6">
                        <input
                            type="text"
                            value={newCafeteriaName}
                            onChange={(e) => setNewCafeteriaName(e.target.value)}
                            placeholder="Nombre de la cafetería"
                            className="border p-2 w-full"
                        />
                        <input
                            type="text"
                            value={newCafeteriaLocation}
                            onChange={(e) => setNewCafeteriaLocation(e.target.value)}
                            placeholder="Ubicación de la cafetería"
                            className="border p-2 w-full"
                        />
                        <select
                            value={selectedMenuId || ""}
                            onChange={(e) => setSelectedMenuId(e.target.value)}
                            className="border p-2 w-full"
                        >
                            <option value="">Seleccionar Menú</option>
                            {menus.map(menu => (
                                <option key={menu.id} value={menu.id}>{`Menú ${menu.id}`}</option>
                            ))}
                        </select>
                        <button onClick={handleAddCafeteria} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                            Ingresar Cafetería
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cafeterias.map(cafeteria => (
                            <div
                                key={cafeteria.id}
                                className="border rounded-lg shadow-md p-4 bg-white cursor-pointer hover:bg-gray-100"
                                onClick={() => handleCafeteriaClick(cafeteria.id)}
                            >
                                <h2 className="text-xl font-semibold">{cafeteria.nombre}</h2>
                                <p className="text-gray-600">Ubicación: {cafeteria.ubicacion}</p>
                                <p className="text-gray-600">Menú ID: {cafeteria.MenuId}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}

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
                        title="¡Algo salió mal!"
                        extra={<Button type="primary" onClick={handleModalClose}>Intentar de nuevo</Button>}
                    />
                )}
            </Modal>
        </div>
    );
};

export default CafeteriaComponent;