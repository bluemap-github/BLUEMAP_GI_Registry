import React from 'react';

const Introduce = () => {
    return (
        <div className="container p-5" style={{textAlign: "center"}}>
            <h1>BLUMAP GI Registery</h1>
            <div>
                <button 
                    className='btn btn-outline-secondary'
                    onClick={() => {window.location.href = '/user/signin'}}
                    >signIn</button>
                <button 
                    className='btn btn-outline-info'
                    onClick={() => {window.location.href = '/user/signup'}}
                    >signUp</button>
            </div>
            
        </div>
    );
};

export default Introduce;