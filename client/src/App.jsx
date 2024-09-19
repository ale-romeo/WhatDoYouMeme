import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavHeader from './components/NavHeader'
import Home from './components/Home'
import Game from './components/Game'
import Login from './components/Login'
import Signup from './components/Signup'
import Profile from './components/Profile'
import AuthProvider from './contexts/AuthContext'
import './App.css'

// Componente principale dell'applicazione
function App() {
  return (
    // Fornisce il contesto di autenticazione a tutta l'applicazione
    <AuthProvider>
      {/* Configurazione del router per gestire le varie rotte */}
      <Router>
        {/* Componente di navigazione globale */}
        <NavHeader />
        {/* Definizione delle rotte dell'applicazione */}
        <Routes>
          {/* Rotta per la homepage */}
          <Route path="/" element={<Home />} />
          {/* Rotta per la pagina di login */}
          <Route path="/login" element={<Login />} />
          {/* Rotta per la pagina di registrazione */}
          <Route path="/signup" element={<Signup />} />
          {/* Rotta per il gioco */}
          <Route path="/game" element={<Game />} />
          {/* Rotta per il profilo utente */}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
