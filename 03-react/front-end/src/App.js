import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ConceptRegister from './S100_Registry/Concept/ConceptRegister';
import Home from './S100_Registry/Home';
import Detail from './S100_Registry/Concept/Detail/Detail';
import InsertItem from './S100_Registry/Concept/Insert/Item';
import NavbarWide from './S100_Registry/NavBar/NavbarWide';
import NavbarNarrow from './S100_Registry/NavBar/NavbarNarrow';
import './App.css';

function App() {
  const [isWide, setIsWide] = useState(true);

  const toggleNavbar = () => {
    setIsWide(!isWide);
  };

  return (
    <Router>
      {/* <button style={{position: 'fixed', zIndex:'200000'}} onClick={toggleNavbar}>이거</button> */}
      <div className="app-container">
        {isWide ? <NavbarWide /> : <NavbarNarrow />}
        <div className={isWide ? 'navBar-rest-wide' : 'navBar-rest-narrow'}></div>
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
