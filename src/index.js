import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContextProvider } from './Context/AuthContext';
import { ToastProvider } from './Context/ToastContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
