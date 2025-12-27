import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const PrivateRoute: React.FC = () => {
    const { currentUser, loading } = useAuth();

    // Explicitly wait for loading to be false
    if (loading === true) {
        return <div className="flex h-screen items-center justify-center text-primary font-medium">Carregando...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
