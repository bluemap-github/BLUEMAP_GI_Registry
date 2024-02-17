// import React, { useEffect } from 'react';

// function App() {
//   useEffect(() => {
//     console.log('애플리케이션이 마운트되었습니다.');
//     return () => {
//       console.log('애플리케이션이 언마운트되었습니다.');
//     };
//   }, []);

//   const handleClick = () => {
//     console.log('버튼이 클릭되었습니다.');
//   };

//   return (
//     <div className="App">
//       <button onClick={handleClick}>클릭하세요</button>
//     </div>
//   );
// }

// export default App;
// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './S100_Registry/Register';
import Home from './Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        {/* 다른 경로들을 필요에 따라 추가할 수 있습니다 */}
      </Routes>
    </Router>
  );
}

export default App;