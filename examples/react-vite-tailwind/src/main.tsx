import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@wallet-ui/tailwind/index.css';
import { BrowserRouter } from 'react-router';
import { App } from './app/app.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
);
