import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Outlet } from 'react-router-dom';
import RegiHome from './S100_Registry/RegiHome';
import InsertItem from './S100_Registry/Insert/Item';
import SideBar from './S100_Registry/Sidebar';
import './App.css';
import PortrayalRegister from './S100_Registry/Portrayal/PortrayalRegister';
import SignUp from './User/signUp/signUp';
import SignIn from './User/signIn/signIn';
import Navbar from './Common/Navbar';
import MySidebar from './Common/MySidebar';
import GetUserInfo from './Common/GetUserInfo';
import ErrorPage from './Common/ErrorPage';
import InnerNav from './Common/InnerNav';
import InnerMyNav from './Common/InnerMyNav';
import Browsing from './Common/Browsing/Browsing';
import EnterRegi from './Common/EnterRegi';
import IsLogined from './Common/IsLogined';
import IsOwnRegi from './Common/IsOwnRegi';
import NotAllowed from './Common/NotAllowed'; 

import ConceptPage from './rootComponent/ConceptPage';
import DataDictionaryPage from './rootComponent/DataDictionaryPage';
import UserPage from './rootComponent/UserPage';

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
                location.pathname === '/user/signup' || 
                location.pathname === '/browsing';

  return (
    <div>
      <div className='navBar-rest'><GetUserInfo><Navbar /></GetUserInfo></div>
      
      <div className="app-container">
        {hideAll ? null : (
          <div className='container-navTop'>
            {!hideSidebar && <SideBar />}
            {hideSidebar && <GetUserInfo><MySidebar /></GetUserInfo>}
            <div className='side-rest-wide'></div>
          </div>
        )}
        <div style={{ width: '90%', minWidth: "1300px"}} className='container-navTop'>
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
          <div>
            <Routes>
              <Route path="/" element={<IsLogined><SignIn /></IsLogined>} />
              <Route path="user/signin" element={<IsLogined><SignIn /></IsLogined>} />
              <Route path="user/signup" element={<IsLogined><SignUp /></IsLogined>} />

              <Route path="user/*" element={<UserPage />} />
              <Route path=":id/*" element={<RegistryPage />} />
              <Route path="/notallowed" element={<NotAllowed />} />
              <Route path="/browsing" element={<Browsing />}/>

              <Route path="/error" element={<ErrorPage />} />
            </Routes>
          </div>
          
        </div>
        </div>
    </div>
  );
}

function RegistryPage() {
  return (
    <>
      <div>
        <Outlet />
      </div>
      
      <Routes>
        <Route path="/" element={<EnterRegi><RegiHome /></EnterRegi>} />
        <Route path="concept/*" element={<ConceptPage />} />
        <Route path="dataDictionary/*" element={<DataDictionaryPage />} />
        <Route path="portrayal/*" element={<PortrayalRegister />} />
        <Route path="create" element={<IsOwnRegi><InsertItem /></IsOwnRegi>} />
      </Routes>
    </>
  );
}
export default App;
