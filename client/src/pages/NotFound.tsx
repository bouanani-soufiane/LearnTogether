import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-md border border-sky-100">
                <div className="flex justify-center mb-4">
                    <FileQuestion size={64} className="text-sky-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
                <p className="text-gray-600 mb-6">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 bg-white border border-sky-200 text-sky-600 hover:bg-sky-50 py-2 px-4 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Go Back
                    </button>
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                        <Home size={16} />
                        Home Page
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
