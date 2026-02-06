import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '@utils/languageProvider';
import { ConfirmProvider } from '@utils/confirmProvider.tsx';
import './index.css';
import App from './App.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <LanguageProvider>
          <ConfirmProvider>
            <App />
          </ConfirmProvider>
        </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);
