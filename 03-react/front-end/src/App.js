import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './S100_Registry/Register';
import Home from './S100_Registry/Home';
import Detail from './S100_Registry/Detail/Detail';
import InsertItem from './S100_Registry/Insert/Item';
import Navbar from './S100_Registry/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className='sidebard'></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/concept" element={<Register />} />
          <Route path="/concept/detail/:id" element={<Detail />} />
          <Route path="/concept/create" element={<InsertItem />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
