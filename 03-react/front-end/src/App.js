import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './S100_Registry/Register';
import Detail from './S100_Registry/Detail';

function App() {
  return (
    <Router>
      <Routes>
        {/* 하위 페이지들을 렌더링하고 url을 명시함 */}
        <Route path="/" element={<Register />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </Router>
  );
}

export default App;