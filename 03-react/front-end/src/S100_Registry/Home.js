import React from "react";
import { TEST } from './api';

const Home = () => {
    const testText = TEST("USer");
    return (
        <div className="container p-5" style={{textAlign: "center"}}>
            <h1>GI Register</h1>
            <h4>{testText}</h4>
        </div>
    );
};

export default Home;
