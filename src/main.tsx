import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { initSignedFetch } from '@utils/signedFetch.tsx';
import { LanguageProvider } from '@utils/languageProvider';
import { ConfirmProvider } from '@utils/confirmProvider.tsx';
import './index.css';
import App from './App.tsx';

await initSignedFetch();

const params = new URLSearchParams(window.location.search);
const redirect = params.get("__redirect__");

if (redirect) {
  window.history.replaceState(null, "", redirect);
}

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
