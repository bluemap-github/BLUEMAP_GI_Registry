import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('jwt');
    return token ? children : <Navigate to="/user/signin" />;
};

export default PrivateRoute;
