import React from 'react';
import { Navigate } from 'react-router-dom';
import { SIGN_IN } from './Common/PageLinks';
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('jwt');
    return token ? children : <Navigate to={SIGN_IN} />;
};

export default PrivateRoute;
