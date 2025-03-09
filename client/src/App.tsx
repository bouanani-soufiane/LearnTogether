import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-16 flex">
                <Sidebar />
                <main className="flex-1 bg-gray-50/100 min-h-[calc(100vh-64px)]">
                    <div className="max-w-6xl  mx-auto px-4 py-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;