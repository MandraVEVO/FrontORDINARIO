import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import DatosPersonalesComponent from './Components/DatosPersonalesComponent';
import ClienteComponent from './Components/ClienteComponent';
import MenuComponent from './Components/MenuComponent';
import CafeteriaComponent from './Components/CafeteriaComponent';
import BaristaComponent from './Components/BaristaComponent';
import AdministrativoComponent from './Components/AdministrativoComponent';
import IngresoBaristaComponent from './Components/IngresoBaristaComponent';
import IngresoAdministrativoComponent from './Components/IngresoAdministrativoComponent';
import ActualizarBaristaComponent from './Components/ActualizarBaristaComponent';
import ActualizarAdministrativoComponent from './Components/ActualizarAdministrativoComponent';
import NavBar from './Components/Navbar';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<DatosPersonalesComponent />} />
        <Route path="/clientes" element={<ClienteComponent />} />
        <Route path="/menu" element={<MenuComponent />} />
        <Route path="/cafeterias" element={<CafeteriaComponent />} />
        <Route path="/baristas" element={<BaristaComponent />} />
        <Route path="/administrativos" element={<AdministrativoComponent />} />
        <Route path="/ingreso-barista" element={<IngresoBaristaComponent />} />
        <Route path="/ingreso-administrativo" element={<IngresoAdministrativoComponent />} />
        <Route path="/actualizar-barista/:id" element={<ActualizarBaristaComponent />} />
        <Route path="/actualizar-administrativo/:id" element={<ActualizarAdministrativoComponent />} />
      </Routes>
    </Router>
  );
}

export default App;