import React, { useState, useEffect } from 'react';
import { Select } from 'antd';

export default function Pedido() {
  const [articulo, setArticulo] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [listaArticulos, setListaArticulos] = useState([]);
  const [montoTotal, setMontoTotal] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');
  const [texto, setTexto] = useState('');
  const [fecha, setFecha] = useState('');
  const [data, setData] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [precios, setPrecios] = useState({});

  const apiBaseUrl = 'https://cafeteriaing.onrender.com/api/v1/';

  const buildApiUrl = (endpoint) => `${apiBaseUrl}${endpoint}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(buildApiUrl('ArticuloMenu'));
        const result = await response.json();
        setData(result);

        // Actualiza el estado de precios
        const preciosActualizados = {};
        result.forEach(item => {
          preciosActualizados[item.nombre] = item.precio;
        });
        setPrecios(preciosActualizados);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchClientes = async () => {
      try {
        const response = await fetch(buildApiUrl('Clientes'));
        const result = await response.json();
        setClientes(result);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchData();
    fetchClientes();
  }, []);

  const agregarArticulo = () => {
    if (articulo.trim() === '' || cantidad <= 0) {
      alert('Por favor, selecciona un artículo y una cantidad válida.');
      return;
    }

    const precioUnitario = precios[articulo];
    const subtotal = precioUnitario * cantidad;

    setListaArticulos([
      ...listaArticulos,
      { nombre: articulo, cantidad: parseInt(cantidad, 10), subtotal },
    ]);

    setMontoTotal(montoTotal + subtotal);

    setArticulo('');
    setCantidad(1);
  };

  const eliminarArticulo = (index) => {
    const articuloEliminado = listaArticulos[index];
    const nuevoMontoTotal = montoTotal - articuloEliminado.subtotal;

    setListaArticulos(listaArticulos.filter((_, i) => i !== index));
    setMontoTotal(nuevoMontoTotal);
  };

  const agregarPedido = async () => {
    const clienteSeleccionado = clientes.find(cliente => cliente.DatosPersonale.nombre === opcionSeleccionada);
    if (!clienteSeleccionado) {
      alert('Por favor, selecciona un cliente válido.');
      return;
    }

    const articulos = listaArticulos.map(item => `${item.nombre}x${item.cantidad}`);
    const facturaData = {
      pedido: texto,
      fecha,
      montoTotal
    };

    try {
      // Crear la factura y obtener su ID
      const responseFactura = await fetch(buildApiUrl('Factura'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(facturaData)
      });

      if (!responseFactura.ok) {
        const errorText = await responseFactura.text();
        throw new Error(`Error al agregar la factura: ${errorText}`);
      }

      const facturaResult = await responseFactura.json();
      const facturaId = facturaResult.id;

      // Crear el pedido usando el ID de la factura creada
      const pedidoData = {
        articulos,
        ArticuloMenuId: null, // Ajusta esto según tu lógica
        ClienteId: clienteSeleccionado.id,
        FacturaId: facturaId
      };

      const responsePedido = await fetch(buildApiUrl('Pedido'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedidoData)
      });

      if (!responsePedido.ok) {
        const errorText = await responsePedido.text();
        throw new Error(`Error al agregar el pedido: ${errorText}`);
      }

      const pedidoResult = await responsePedido.json();
      const pedidoId = pedidoResult.id;

      alert(`Pedido y factura agregados exitosamente. ID del pedido: ${pedidoId}`);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al agregar el pedido y la factura: ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Gestión de Pedido</h1>

        {/* Cliente y pedido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
  <label htmlFor="opciones" className="block text-lg font-medium mb-2">
    ¿Quién sos?
  </label>
  <Select
    id="opciones"
    showSearch
    value={opcionSeleccionada}
    placeholder="Selecciona un cliente"
    optionFilterProp="children"
    onChange={(value) => setOpcionSeleccionada(value)}
    filterOption={(input, option) =>
      option.children.toLowerCase().includes(input.toLowerCase())
    }
    className="w-full p-3 border rounded-lg"
  >
    {clientes.map((cliente) => (
      <Select.Option key={cliente.id} value={cliente.DatosPersonale.nombre}>
        {cliente.DatosPersonale.nombre}
      </Select.Option>
    ))}
  </Select>
</div>
          <div>
            <label htmlFor="input-texto" className="block text-lg font-medium mb-2">
              Nombre de tu pedido
            </label>
            <input
              id="input-texto"
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe aquí..."
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        {/* Fecha y selección de artículos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="fecha" className="block text-lg font-medium mb-2">
              Fecha del pedido
            </label>
            <input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="articulos" className="block text-lg font-medium mb-2">
              Selecciona un artículo
            </label>
            <select
              id="articulos"
              value={articulo}
              onChange={(e) => setArticulo(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">--Selecciona un artículo--</option>
              {data.map(item => (
                <option key={item.id} value={item.nombre}>
                  {item.nombre} - ${item.precio}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cantidad y botón agregar */}
        <div className="flex gap-4 items-center mb-6">
          <div className="flex-grow">
            <label htmlFor="cantidad" className="block text-lg font-medium mb-2">
              Cantidad
            </label>
            <input
              id="cantidad"
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <button
            className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600"
            onClick={agregarArticulo}
          >
            Agregar
          </button>
        </div>

        {/* Lista de artículos */}
        <div>
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">Lista de artículos</h3>
          <div className="space-y-4">
            {listaArticulos.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 p-4 border rounded-lg"
              >
                <span>
                  {item.nombre} - {item.cantidad} unidad(es) - Subtotal: $
                  {item.subtotal.toFixed(2)}
                </span>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                  onClick={() => eliminarArticulo(index)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Monto total */}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-blue-600 mb-2">Monto Total</h3>
          <input
            type="text"
            value={`$${montoTotal.toFixed(2)}`}
            readOnly
            className="w-full p-3 border rounded-lg text-xl text-center bg-gray-100 font-semibold"
          />
        </div>

        {/* Botón agregar pedido */}
        <div className="mt-6 text-center">
          <button
            className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600"
            onClick={agregarPedido}
          >
            Agregar pedido
          </button>
        </div>
      </div>
    </div>
  );
}
