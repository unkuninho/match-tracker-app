import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Cria uma instância do cliente que gerenciará todo o cache e estado dos dados.
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 
        Envolvemos toda a aplicação com o QueryClientProvider.
        Isso dá a todos os componentes acesso aos hooks da biblioteca (useQuery, useMutation, etc.).
      */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);