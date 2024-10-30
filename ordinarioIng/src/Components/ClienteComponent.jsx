import React, { useEffect, useState } from 'react';
import ClienteService from '../Api/ClienteService.js';

const ClienteComponent = () => {
    const [clientes, setClientes] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        ClienteService.getAll()
            .then(response => {
                console.log("Datos obtenidos de la API:", response);
                setClientes(response);
            })
            .catch(error => {
                console.error("Error al obtener datos:", error);
            });
    }, []);

    const filteredClientes = clientes.filter(cliente =>
        `${cliente.nombre} ${cliente.apellido} ${cliente.correo}`.toLowerCase().includes(search.toLowerCase())
    );

    return ();
     
    export default ClienteComponent;
