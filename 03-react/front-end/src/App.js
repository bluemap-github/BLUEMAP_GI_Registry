import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './S100_Registry/Register';
import Detail from './S100_Registry/Detail/Detail';
import InsertItem from './S100_Registry/Insert/Item';
import Navbar from './S100_Registry/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className='sidebard'>sp</div>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/create" element={<InsertItem />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
