import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ConceptRegister from './S100_Registry/Concept/ConceptRegister';
import RegiHome from './S100_Registry/RegiHome';
import ConceptDetail from './S100_Registry/Concept/Detail/Detail';
import InsertItem from './S100_Registry/Insert/Item';
import SideBar from './S100_Registry/Sidebar';
import './App.css';
import DataDictionaryRegister from './S100_Registry/DataDictionary/DataDictionaryRegister';
import PortrayalRegister from './S100_Registry/Portrayal/PortrayalRegister';
import DDR_Detail from './S100_Registry/DataDictionary/DDR_Detail';
import Introduce from './User/signIn/introduce';
import SignUp from './User/signUp/signUp';
import SignIn from './User/signIn/signIn';
import MyMain from './User/myPage/myMain';
import PrivateRoute from './PrivateRoute';
import Navbar from './Common/Navbar';
import MySidebar from './Common/MySidebar';
import GetUserInfo from './Common/GetUserInfo';
import CreateRegistry from './User/myPage/CreateRegistry';
import ErrorPage from './Common/ErrorPage';
import InnerNav from './Common/InnerNav';
import InnerMyNav from './Common/InnerMyNav';
import EnterRegi from './Common/EnterRegi';
import {ENTER_REGI, INTRO, SIGN_IN, SIGN_UP, MY_MAIN, CREATE_REGI, ACCESS, ERROR, RERI_HOME, CONCEPT_LIST, CONCEPT_DETAIL, CREATE_ITEM, DDR_LIST, DDR_DETAIL, PORTAYAL_LIST} from './Common/PageLinks';
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const hideSidebar = location.pathname.startsWith('/user');
  const hideAll = location.pathname === '/' || 
                location.pathname === '/user/signin' || 
                location.pathname === '/user/signup';


  return (
    <div>
      <div className='navBar-rest'><Navbar /></div>
      <div className="app-container">
        {hideAll ? null : (
          <>
            {!hideSidebar && <SideBar />}
            {hideSidebar && <GetUserInfo><MySidebar /></GetUserInfo>}
            <div className='side-rest-wide'></div>
          </>
        )}
        <div style={{ width: '90%'}}>
          {hideAll ? null : (
            <>
              {!hideSidebar && 
                <InnerNav/>
              }
              {hideSidebar && 
                <GetUserInfo><InnerMyNav/></GetUserInfo>
              }
            </>
          )}
          <Routes>
            <Route path=":id" element={<EnterRegi/>} />
            <Route path={INTRO} element={<Introduce />} />
            <Route path={SIGN_IN} element={<SignIn />} />
            <Route path={SIGN_UP} element={<SignUp />} />
            <Route path={MY_MAIN} element={<PrivateRoute><MyMain /></PrivateRoute>} />
            <Route path={CREATE_REGI} element={<PrivateRoute><CreateRegistry /></PrivateRoute>} />
            <Route path={ERROR} element={<ErrorPage />} />
            
            <Route path={RERI_HOME} element={<RegiHome />} />
            <Route path={CONCEPT_LIST} element={<ConceptRegister />} />
            <Route path={CONCEPT_DETAIL} element={<ConceptDetail />} />
            <Route path={CREATE_ITEM} element={<InsertItem />} />
            <Route path={DDR_LIST} element={<DataDictionaryRegister/>} />
            <Route path={DDR_DETAIL} element={<DDR_Detail />} />
            <Route path={PORTAYAL_LIST} element={<PortrayalRegister />} />
          </Routes>
        </div>
        </div>
    </div>
  );
}


export default App;
