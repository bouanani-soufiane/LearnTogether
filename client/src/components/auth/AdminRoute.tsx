import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { UserRole } from "../../types";

interface AdminRouteProps {
    children?: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();
    const navigate = useNavigate();
    const isAdmin = user?.role === UserRole.ADMIN;

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", {
                replace: true,
                state: { from: window.location.pathname, message: "Please login to continue" }
            });
        } else if (!isAdmin) {
            navigate("/unauthorized", {
                replace: true
            });
        }
    }, [isAuthenticated, isAdmin, navigate]);

    // If authenticated and admin, render the children or outlet
    if (isAuthenticated && isAdmin) {
        return children ? <>{children}</> : <Outlet />;
    }

    // Return null while the navigation is happening
    return null;
};

export default AdminRoute;