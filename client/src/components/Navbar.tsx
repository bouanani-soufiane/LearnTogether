import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FaSearch, FaBars, FaUserCircle, FaBell, FaInbox } from 'react-icons/fa';

const Navbar: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    };

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and hamburger menu */}
                    <div className="flex items-center">
                        <button
                            className="mr-2 md:hidden text-gray-600 hover:text-gray-900"
                            onClick={toggleMobileMenu}
                        >
                            <FaBars size={20} />
                        </button>
                        <Link to="/" className="flex items-center">

                            <span className="hidden sm:block font-bold text-3xl text-gray-900">LearnTogether</span>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl mx-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full py-2 pr-10 pl-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-blue-500"
                            >
                                <FaSearch />
                            </button>
                        </form>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <button className="text-gray-600 hover:text-gray-900">
                                    <FaBell size={18} />
                                </button>
                                <button className="text-gray-600 hover:text-gray-900">
                                    <FaInbox size={18} />
                                </button>
                                <div className="relative group">
                                    <button className="flex items-center text-gray-600 hover:text-gray-900">
                                        <FaUserCircle size={20} className="mr-1" />
                                        <span className="text-sm font-medium truncate max-w-[100px]">
                      {user?.fullName || 'User'}
                    </span>
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Profile
                                        </Link>
                                        <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Settings
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                navigate('/login');
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden">
                        {isAuthenticated ? (
                            <button className="text-gray-600 hover:text-gray-900">
                                <FaUserCircle size={24} />
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium"
                            >
                                Log in
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {showMobileMenu && (
                <div className="md:hidden bg-white pt-2 pb-3 border-t border-gray-200">
                    <div className="px-2 space-y-1">
                        <Link
                            to="/"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                            Home
                        </Link>
                        <Link
                            to="/questions"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                            Questions
                        </Link>
                        <Link
                            to="/tags"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                            Tags
                        </Link>
                        <Link
                            to="/users"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                            Users
                        </Link>
                        {isAuthenticated ? (
                            <button
                                onClick={() => {
                                    logout();
                                    navigate('/login');
                                }}
                                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                                Sign out
                            </button>
                        ) : (
                            <Link
                                to="/register"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                                Sign up
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;