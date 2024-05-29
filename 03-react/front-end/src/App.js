import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ConceptRegister from './S100_Registry/Concept/ConceptRegister';
import Home from './S100_Registry/Home';
import Detail from './S100_Registry/Concept/Detail/Detail';
import InsertItem from './S100_Registry/Insert/Item';
import Navbar from './S100_Registry/Navbar';
import './App.css';
import DataDictionaryRegister from './S100_Registry/DataDictionary/DataDictionaryRegister';
import PortrayalRegister from './S100_Registry/Portrayal/PortrayalRegister';

function App() {
  return (
    <Router>
      <div className="app-container">
      <Navbar />
        <div className={'navBar-rest-wide'}></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/concept" element={<ConceptRegister />} />
          <Route path="/concept/detail/:id" element={<Detail />} />
          <Route path="/concept/create/:register_id" element={<InsertItem />} />
          <Route path='/dataDictionary' element={<DataDictionaryRegister/>} />
          <Route path='/portrayal' element={<PortrayalRegister/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
