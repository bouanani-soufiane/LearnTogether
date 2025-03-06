import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FaGlobe,
    FaQuestion,
    FaTag,
    FaUsers,
    FaTrophy,
    FaStar,
    FaBriefcase,
    FaInfoCircle
} from 'react-icons/fa';

type NavItem = {
    icon?: React.ReactNode;
    text?: string;
    path?: string;
    divider?: boolean;
};

const Sidebar: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string): boolean => {
        return location.pathname === path;
    };

    const navItems: NavItem[] = [
        { icon: <FaGlobe />, text: "Home", path: "/" },
        { icon: <FaQuestion />, text: "Questions", path: "/questions/ask" },
        { icon: <FaTag />, text: "Tags", path: "/tags" },
        { icon: <FaUsers />, text: "Users", path: "/users" },
        { divider: true },
        { icon: <FaTrophy />, text: "Leaderboard", path: "/leaderboard" },
        { icon: <FaStar />, text: "Favorites", path: "/favorites" },
        { divider: true },
        { icon: <FaBriefcase />, text: "Jobs", path: "/jobs" },
        { icon: <FaInfoCircle />, text: "About", path: "/about" }
    ];

    return (
        <div className="fixed left-0 top-16 h-[calc(100vh-64px)] w-[200px] bg-white border-r border-gray-200 overflow-y-auto hidden md:block">
            <nav className="mt-4 px-2">
                <ul className="space-y-1">
                    {navItems.map((item, index) => (
                        item.divider ? (
                            <li key={`divider-${index}`} className="my-4 border-t border-gray-200"></li>
                        ) : (
                            <li key={item.path || `nav-${index}`}>
                                {item.path && (
                                    <Link
                                        to={item.path}
                                        className={`flex items-center px-4 py-2 text-sm rounded-md ${
                                            isActive(item.path)
                                                ? 'bg-orange-100 text-orange-800 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span className="mr-3 text-lg">{item.icon}</span>
                                        {item.text}
                                    </Link>
                                )}
                            </li>
                        )
                    ))}
                </ul>
            </nav>

            <div className="mt-8 px-4">
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-800 mb-2">Custom Lists</h4>
                    <ul className="space-y-1">
                        <li>
                            <Link to="/saved-questions" className="text-xs text-blue-600 hover:text-blue-800">
                                Saved Questions
                            </Link>
                        </li>
                        <li>
                            <Link to="/watched-tags" className="text-xs text-blue-600 hover:text-blue-800">
                                Watched Tags
                            </Link>
                        </li>
                    </ul>
                    <button className="mt-3 text-xs text-gray-600 hover:text-gray-800">
                        Create new list
                    </button>
                </div>
            </div>

            <div className="px-4 mt-6 mb-6">
                <div className="flex flex-col space-y-2">
                    <h4 className="text-xs uppercase font-bold text-gray-500">Teams</h4>
                    <Link to="/create-team" className="text-xs text-blue-600 hover:text-blue-800">
                        Create free Team
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;