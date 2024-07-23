import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { PrivateRouteProps } from './privateRouteTypes';

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    return isAuthenticated ? (
        element
    ) : (
        <Navigate to="/login" state={{ from: location }} replace/>
    );
};

export default PrivateRoute;
