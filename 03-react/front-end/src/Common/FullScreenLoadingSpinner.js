import React from 'react';
import './FullScreenLoadingSpinner.css';

const FullScreenLoadingSpinner = () => {
    return (
        <div className="loading-overlay">
            <div className="spinner"></div>
        </div>
    );
};

export default FullScreenLoadingSpinner;
