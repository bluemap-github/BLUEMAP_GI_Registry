import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ConceptRegister from './S100_Registry/Concept/ConceptRegister';
import RegiHome from './S100_Registry/Home';
import ConceptDetail from './S100_Registry/Concept/Detail/Detail';
import InsertItem from './S100_Registry/Insert/Item';
import Navbar from './S100_Registry/Navbar';
import './App.css';
import DataDictionaryRegister from './S100_Registry/DataDictionary/DataDictionaryRegister';
import PortrayalRegister from './S100_Registry/Portrayal/PortrayalRegister';
import DDR_Detail from './S100_Registry/DataDictionary/DDR_Detail';
import Introduce from './User/signIn/introduce';
import SignUp from './User/signUp/signUp';
import SignIn from './User/signIn/signIn';
import MyMain from './User/myPage/myMain';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/' || location.pathname.startsWith('/user');

  return (
    <div className="app-container">
      {!hideNavbar && <Navbar />}
      <div className={!hideNavbar ? 'navBar-rest-wide' : ''}></div>
      <Routes>
        <Route path="/" element={<Introduce />} />
        <Route path="/user/signin" element={<SignIn />} />
        <Route path="/user/signup" element={<SignUp />} />
        <Route path="/user/mymain" element={<PrivateRoute><MyMain /></PrivateRoute>} />

        <Route path="/concept/:register_id" element={<ConceptRegister />} />
        <Route path="/concept/detail" element={<ConceptDetail />} />
        <Route path="/concept/create/:register_id" element={<InsertItem />} />
        <Route path='/dataDictionary/:register_id' element={<DataDictionaryRegister/>} />
        <Route path="/dataDictionary" element={<DDR_Detail />} />
        <Route path='/portrayal/:register_id' element={<PortrayalRegister/>} />
      </Routes>
    </div>
  );
}

export default App;
