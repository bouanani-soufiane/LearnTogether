import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Unauthorized: React.FC = () => {
    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-md border border-red-100">
                <div className="flex justify-center mb-4">
                    <ShieldAlert size={64} className="text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
                <p className="text-gray-600 mb-6">
                    You don't have permission to access this page. This area is restricted to administrators only.
                </p>
                <Link
                    to="/"
                    className="block w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white py-2 px-4 rounded-lg text-center transition-colors"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;