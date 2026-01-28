import React from 'react';
import { Navigate } from 'react-router-dom';
import { MY_MAIN } from './PageLinks';
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('jwt');
    return token ? <Navigate to={MY_MAIN} /> : children;
};

export default PrivateRoute;
