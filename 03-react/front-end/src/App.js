import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ConceptRegister from './S100_Registry/Concept/ConceptRegister';
import Home from './S100_Registry/Home';
import ConceptDetail from './S100_Registry/Concept/Detail/Detail';
import InsertItem from './S100_Registry/Insert/Item';
import Navbar from './S100_Registry/Navbar';
import './App.css';
import DataDictionaryRegister from './S100_Registry/DataDictionary/DataDictionaryRegister';
import PortrayalRegister from './S100_Registry/Portrayal/PortrayalRegister';
import DDR_Detail from './S100_Registry/DataDictionary/DDR_Detail';

function App() {
  return (
    <Router>
      <div className="app-container">
      <Navbar />
        <div className={'navBar-rest-wide'}></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/concept/:register_id" element={<ConceptRegister />} />
          <Route path="/concept/detail/:register_id/:item_id" element={<ConceptDetail />} />
          <Route path="/concept/create/:register_id" element={<InsertItem />} />
          <Route path='/dataDictionary/:register_id' element={<DataDictionaryRegister/>} />
          <Route path="/dataDictionary/:register_id/:item_id" element={<DDR_Detail />} />
          <Route path='/portrayal/:register_id' element={<PortrayalRegister/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
