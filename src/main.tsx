import { applyTheme, getTheme } from './lib/theme';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ProgressProvider } from './lib/progress';
import { BankStateProvider } from './pages/bank-state';
import App from './App';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/jetbrains-mono';
import './styles.css';
import { captureRef } from './lib/referral';

captureRef();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <BankStateProvider>
            <App />
          </BankStateProvider>
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

applyTheme(getTheme());
