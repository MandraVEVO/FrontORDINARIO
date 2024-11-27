import React from 'react';

const Home = () => {
    return (
        <div className="relative min-h-screen bg-gray-900">
            {/* Imagen de fondo */}
            <img
                src="https://odisaequipa.com.mx/wp-content/uploads/2021/03/cafeteria-tray-with-homemade-scones-and-croissants-6W85B5X-1-scaled.jpg"
                alt="Cafetería"
                className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Superposición de color */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            {/* Contenido principal */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
                <h1 className="text-6xl font-bold text-white mb-4">
                    SISTEMA CAFETERÍA
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                    Simplifica la gestión de tu cafetería con nuestro sistema integral. Controla pedidos, administra inventarios y mejora la experiencia de tus clientes.
                </p>
                <div className="flex space-x-4">
                  
                </div>
            </div>
        </div>
    );
};

export default Home;
