import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { RadioProvider } from './context/RadioContext';
import { LapProvider } from './context/LapContext';
import { AlertsProvider } from './context/AlertsContext';
import { DemoProvider } from './context/DemoContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AlertsProvider>
          <RadioProvider>
            <LapProvider>
              <DemoProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </DemoProvider>
            </LapProvider>
          </RadioProvider>
        </AlertsProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
