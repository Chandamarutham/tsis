import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { AuthProvider } from '@utils/authContext.tsx';
import { LanguageProvider } from '@utils/languageProvider';
import { ConfirmProvider } from '@utils/confirmProvider.tsx';
import './index.css';
import App from './App.tsx';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID!,
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID!
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <ConfirmProvider>
            <App />
          </ConfirmProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
