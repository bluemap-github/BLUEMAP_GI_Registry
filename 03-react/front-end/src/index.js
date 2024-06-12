import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ItemProvider } from './context/ItemContext'; // ItemProvider 임포트

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ItemProvider> {/* ItemProvider로 App을 감싸기 */}
      <App />
    </ItemProvider>
  </React.StrictMode>
);
