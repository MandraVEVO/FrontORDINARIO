import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import DatosPersonalesComponent from './Components/DatosPersonalesComponent';
import ArticuloComponent from './Components/ArticuloComponent';
import ClienteComponent from './Components/ClienteComponent';
import MenuComponent from './Components/MenuComponent';
import CafeteriaComponent from './Components/CafeteriaComponent';
import BaristaComponent from './Components/BaristaComponent';
import AdministrativoComponent from './Components/AdministrativoComponent';
import IngresoBaristaComponent from './Components/IngresoBaristaComponent';
import IngresoAdministrativoComponent from './Components/IngresoAdministrativoComponent';
import IngresoClienteComponent from './Components/IngresoClienteComponent';
import ActualizarBaristaComponent from './Components/ActualizarBaristaComponent';
import ActualizarAdministrativoComponent from './Components/ActualizarAdministrativoComponent';

import NavBar from './Components/Navbar';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/datos-personales" element={<DatosPersonalesComponent />} />
        <Route path="/cliente-component" element={<ClienteComponent />} />
        <Route path="/articulo-component" element={<ArticuloComponent />} />
        <Route path="/menu" element={<MenuComponent />} />
        <Route path="/cafeterias" element={<CafeteriaComponent />} />
        <Route path="/barista-component" element={<BaristaComponent />} />
        <Route path="/administrativo-component" element={<AdministrativoComponent />} />
        <Route path="/ingreso-barista" element={<IngresoBaristaComponent />} />
        <Route path="/ingreso-administrativo" element={<IngresoAdministrativoComponent />} />
        <Route path="/ingreso-cliente" element={<IngresoClienteComponent />} />
        <Route path="/actualizar-barista/:id" element={<ActualizarBaristaComponent />} />
        <Route path="/actualizar-administrativo/:id" element={<ActualizarAdministrativoComponent />} />
      </Routes>
    </Router>
  );
}

export default App;