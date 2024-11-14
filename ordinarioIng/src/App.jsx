import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DatosPersonalesComponent from './Components/DatosPersonalesComponent';
import ClienteComponent from './Components/ClienteComponent';
import MenuComponent from './Components/MenuComponent';
import CafeteriaComponent from './Components/CafeteriaComponent';
import BaristaComponent from './Components/BaristaComponent';
import IngresoBaristaComponent from './Components/IngresoBaristaComponent';
function App() {
  
  return (
    <>
      
      <IngresoBaristaComponent/>
    
    </>
  );
}

export default App
