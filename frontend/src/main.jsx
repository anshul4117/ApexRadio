import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DemoProvider } from './context/DemoContext';
import { AlertsProvider } from './context/AlertsContext';
import { LapProvider } from './context/LapContext';
import { RadioProvider } from './context/RadioContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <DemoProvider>
          <AlertsProvider>
            <LapProvider>
              <RadioProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </RadioProvider>
            </LapProvider>
          </AlertsProvider>
        </DemoProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
