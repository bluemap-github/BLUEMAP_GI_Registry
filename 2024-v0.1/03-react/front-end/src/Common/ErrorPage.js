import React from 'react';
import { useNavigate } from 'react-router-dom';
import { INTRO } from './PageLinks';

const ErrorPage = () => {
    const navigate = useNavigate();
    const goToHome = () => {
        navigate(INTRO);
    }
    return (
        <div>
            <h1>Error Page</h1>
            <p>Oops! Something went wrong.</p>
            <button onClick={goToHome}>back to home</button>
        </div>
    );
};

export default ErrorPage;