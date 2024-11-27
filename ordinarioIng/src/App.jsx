import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import DatosPersonalesComponent from './Components/DatosPersonalesComponent';
import ArticuloComponent from './Components/ArticuloComponent';
import ClienteComponent from './Components/ClienteComponent';
import MenuComponent from './Components/MenuComponent';
import CafeteriaComponent from './Components/CafeteriaComponent';
import BaristaComponent from './Components/BaristaComponent';
import PedidoComponent from './Components/PedidoComponente';
import AdministrativoComponent from './Components/AdministrativoComponent';
import IngresoBaristaComponent from './Components/IngresoBaristaComponent';
import IngresoAdministrativoComponent from './Components/IngresoAdministrativoComponent';
import IngresoClienteComponent from './Components/IngresoClienteComponent';
import ActualizarBaristaComponent from './Components/ActualizarBaristaComponent';
import ActualizarAdministrativoComponent from './Components/ActualizarAdministrativoComponent';
import ActualizarCliente from './Components/ActualizarCliente';
import VerPedidoComponente from './Components/VerPedidoComponente';
import Home from './Components/Home';
import NavBar from './Components/Navbar';

function App() {
  return (
    <Router>
      {/* Navbar fija */}
      <NavBar />

      {/* Espaciado dinámico para evitar solapamiento */}
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/datos-personales" element={<DatosPersonalesComponent />} />
          <Route path="/cliente-component" element={<ClienteComponent />} />
          <Route path="/articulo-component" element={<ArticuloComponent />} />
          <Route path="/menu" element={<MenuComponent />} />
          <Route path="/cafeterias" element={<CafeteriaComponent />} />
          <Route path="/barista-component" element={<BaristaComponent />} />
          <Route path="/administrativo-component" element={<AdministrativoComponent />} />
          <Route path="/pedido" element={<PedidoComponent />} />
          <Route path="/ver-pedido" element={<VerPedidoComponente />} />
          <Route path="/ingreso-barista" element={<IngresoBaristaComponent />} />
          <Route path="/ingreso-administrativo" element={<IngresoAdministrativoComponent />} />
          <Route path="/ingreso-cliente" element={<IngresoClienteComponent />} />
          <Route path="/actualizar-barista/:id" element={<ActualizarBaristaComponent />} />
          <Route path="/actualizar-administrativo/:id" element={<ActualizarAdministrativoComponent />} />
          <Route path="/actualizar-cliente/:id" element={<ActualizarCliente />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
