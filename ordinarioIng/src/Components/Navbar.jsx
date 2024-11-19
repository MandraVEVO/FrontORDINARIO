import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-white text-lg font-semibold">
            <Link to="/">Cafetería App</Link>
          </div>
          <div className="flex space-x-4">
          <Link
              to="/articulo-component"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Articulos
            </Link>
          <Link
              to="/menu"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Menu
            </Link>
          <Link
              to="/cafeterias"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Cafeterias
            </Link>
          <Link
              to="/datos-personales"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Datos Personales
            </Link>
            <Link
              to="/barista-component"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Baristas
            </Link>
            <Link
              to="/administrativo-component"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Administrativo
            </Link>
            <Link
              to="/cliente-component"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Cliente
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
