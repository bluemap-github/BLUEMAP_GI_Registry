import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ConceptRegister from './S100_Registry/Concept/ConceptRegister';
import Home from './S100_Registry/Home';
import Detail from './S100_Registry/Concept/Detail/Detail';
import InsertItem from './S100_Registry/Concept/Insert/Item';
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
          <Route path="/concept" element={<ConceptRegister />} />
          <Route path="/concept/detail/:id" element={<Detail />} />
          <Route path="/concept/create/:register_id" element={<InsertItem />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
