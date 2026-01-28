import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ModalStackProvider } from './contexts/ModalStackContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ModalStackProvider>
      <App />
    </ModalStackProvider>
  </React.StrictMode>,
)
