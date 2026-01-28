// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ItemProvider } from './context/ItemContext'; 
import { UserProvider } from './context/UserContext'; // UserProvider 임포트

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider> {/* UserProvider로 ItemProvider를 감싸기 */}
      <ItemProvider>
        <App />
      </ItemProvider>
    </UserProvider>
  </React.StrictMode>
);
