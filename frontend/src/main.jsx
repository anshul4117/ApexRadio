import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { RadioProvider } from './context/RadioContext';
import { LapProvider } from './context/LapContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RadioProvider>
          <LapProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </LapProvider>
        </RadioProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
