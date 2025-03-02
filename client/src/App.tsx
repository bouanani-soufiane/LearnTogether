import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

const App: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className="mt-12 py-24 px-6 lg:p-14">
                <Outlet />
            </div>
        </>
    );
}

export default App;