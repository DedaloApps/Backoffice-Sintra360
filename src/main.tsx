import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Participantes from './pages/Participantes.tsx';
import Problemas from './pages/Problemas.tsx';
import Propostas from './pages/Propostas.tsx';
import Agenda from './pages/Agenda.tsx';
import Notificacoes from './pages/Notificacoes.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<App />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/participantes" element={<App />}>
          <Route index element={<Participantes />} />
        </Route>
        <Route path="/problemas" element={<App />}>
  <Route index element={<Problemas />} />
</Route>
<Route path="/propostas" element={<App />}>
  <Route index element={<Propostas />} />
</Route>
<Route path="/agenda" element={<App />}>
  <Route index element={<Agenda />} />
</Route>
<Route path="/notificacoes" element={<App />}>
  <Route index element={<Notificacoes />} />
</Route>

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
