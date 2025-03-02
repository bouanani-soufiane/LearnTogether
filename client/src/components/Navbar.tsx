import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isDark, setIsDark] = useState<boolean>(false);

    const toggleDarkMode = () => {
        setIsDark(!isDark);
    };

    return (
        <nav
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} fixed w-full z-20 top-0 left-0 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Logo/Brand */}
                <a href="/" className="flex items-center">
                  <span>
                    <img src="/logo.svg" alt="logo" className="w-1/3"/>
                  </span>
                </a>

                {/* Navigation Items */}
                <div className="flex md:order-2">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className={`px-4 py-2 mr-2 text-sm rounded-lg border 
                        ${isDark
                            ? 'text-white border-gray-600 hover:bg-gray-700'
                            : 'text-gray-800 border-gray-200 hover:bg-gray-100'}`}
                    >
                        {isDark ? '☀️' : '🌙'}
                    </button>

                    {/* Auth Buttons */}
                    <Link
                        to="/login"
                        className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 
                        ${isDark ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    >
                        Login
                    </Link>
                </div>

                {/* Menu Items */}
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
                    <ul className={`flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 
                        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                        <li>
                            <Link
                                to="/"
                                className={`block py-2 pl-3 pr-4 rounded md:p-0 
                                ${isDark ? 'text-white hover:text-blue-500' : 'text-gray-900 hover:text-blue-700'}`}
                                aria-current="page"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className={`block py-2 pl-3 pr-4 rounded md:p-0 
                                ${isDark ? 'text-white hover:text-blue-500' : 'text-gray-900 hover:text-blue-700'}`}
                                aria-current="page"
                            >
                                About
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;