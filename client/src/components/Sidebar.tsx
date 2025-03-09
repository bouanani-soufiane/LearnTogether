import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { Globe, HelpCircle, Tag, Users, Trophy, Star, Briefcase, Info, Plus, ChevronRight } from "lucide-react"

type NavItem = {
    icon?: React.ReactNode
    text?: string
    path?: string
    divider?: boolean
}

const Sidebar: React.FC = () => {
    const location = useLocation()

    const isActive = (path: string): boolean => {
        return location.pathname === path
    }

    const navItems: NavItem[] = [
        { icon: <Globe size={18} />, text: "Home", path: "/" },
        { icon: <HelpCircle size={18} />, text: "Questions", path: "/questions/ask" },
        { icon: <Tag size={18} />, text: "Tags", path: "/tags" },
        { icon: <Users size={18} />, text: "Users", path: "/users" },
        { divider: true },
        { icon: <Trophy size={18} />, text: "Leaderboard", path: "/leaderboard" },
        { divider: true },
        { icon: <Info size={18} />, text: "About", path: "/about" },
    ]

    return (
        <div className="fixed left-0 top-16 h-[calc(100vh-64px)] w-[240px] bg-gradient-to-b from-white to-sky-50/80 backdrop-blur-sm border-r border-sky-100/50 overflow-y-auto hidden md:block shadow-sm">
            <nav className="mt-6 px-3">
                <ul className="space-y-1.5">
                    {navItems.map((item, index) =>
                            item.divider ? (
                                <li key={`divider-${index}`} className="my-4 border-t border-sky-100/70"></li>
                            ) : (
                                <li key={item.path || `nav-${index}`}>
                                    {item.path && (
                                        <Link
                                            to={item.path}
                                            className={`flex items-center px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                                                isActive(item.path)
                                                    ? "bg-gradient-to-r from-sky-500/10 to-orange-500/10 text-sky-700 font-medium shadow-sm border border-sky-200/50"
                                                    : "text-gray-700 hover:bg-white/80 hover:shadow-sm hover:border hover:border-sky-100/50"
                                            }`}
                                        >
                    <span className={`mr-3 ${isActive(item.path) ? "text-orange-500" : "text-sky-500"}`}>
                      {item.icon}
                    </span>
                                            {item.text}
                                        </Link>
                                    )}
                                </li>
                            ),
                    )}
                </ul>
            </nav>

            <div className="mt-8 px-4">
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-sky-100/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <h4 className="text-sm font-bold bg-gradient-to-r from-sky-600 to-orange-500 bg-clip-text text-transparent mb-3">
                        Custom Lists
                    </h4>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/saved-questions"
                                className="flex items-center text-xs text-gray-700 hover:text-sky-600 transition-colors"
                            >
                                <ChevronRight size={14} className="mr-1 text-orange-400" />
                                Saved Questions
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/watched-tags"
                                className="flex items-center text-xs text-gray-700 hover:text-sky-600 transition-colors"
                            >
                                <ChevronRight size={14} className="mr-1 text-orange-400" />
                                Watched Tags
                            </Link>
                        </li>
                    </ul>
                    <button className="mt-3 text-xs flex items-center text-sky-600 hover:text-orange-500 transition-colors">
                        <Plus size={14} className="mr-1" />
                        Create new list
                    </button>
                </div>
            </div>

            <div className="px-4 mt-6 mb-6">
                <div className="flex flex-col space-y-2">
                    <h4 className="text-xs uppercase font-bold text-gray-500">Teams</h4>
                    <Link
                        to="/create-team"
                        className="text-xs flex items-center text-sky-600 hover:text-orange-500 transition-colors"
                    >
                        <Plus size={14} className="mr-1" />
                        Create free Team
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Sidebar

