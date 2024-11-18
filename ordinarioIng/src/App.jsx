import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import DatosPersonalesComponent from './Components/DatosPersonalesComponent';
import ClienteComponent from './Components/ClienteComponent';
import MenuComponent from './Components/MenuComponent';
import CafeteriaComponent from './Components/CafeteriaComponent';
import BaristaComponent from './Components/BaristaComponent';
import AdministrativoComponent from './Components/AdministrativoComponent';
import IngresoBarista from './Components/IngresoBaristaComponent';
import { Menu } from 'antd';
import IngresoAdministrativoComponent from './Components/IngresoAdministrativoComponent';
import ActualizarBaristaComponent from './Components/ActualizarBaristaComponent';
import ActualizarAdministrativoComponent from './Components/ActualizarAdministrativoComponent';
import NavBar from './Components/Navbar';





function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/barista-component" element={<BaristaComponent />} />
        <Route path="/datos-personales" element={<DatosPersonalesComponent />} />
        <Route path="/administrativo-component" element={<AdministrativoComponent />} />
        <Route path="/cliente-component" element={<ClienteComponent />} />
        <Route path="/ingreso-barista" element={<IngresoBarista />} />
        <Route path="/actualizar-barista/:id" element={<ActualizarBaristaComponent />} />

        <Route path="/ingreso-administrativo" element={<IngresoAdministrativoComponent />} />
        <Route path="/actualizar-administrativo/:id" element={<ActualizarAdministrativoComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
