import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const role = localStorage.getItem('role');

  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        {role && (
          <>
            <li>
              <Link to="/products" className="text-white">
                Productos
              </Link>
            </li>
            <li>
              <Link to="/orders" className="text-white">
                Órdenes
              </Link>
            </li>
          </>
        )}
        <li>
          <Link to="/login" className="text-white">
            {role ? 'Cerrar Sesión' : 'Iniciar Sesión'}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;