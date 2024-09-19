import React, { createContext, useState, useContext } from 'react'
import { login as loginService, logout as logoutService, register as signupService, deleteUser as unsignService, getUserInfo } from '../services/api'

// Creazione del contesto di autenticazione
const AuthContext = createContext()

// Componente provider per gestire lo stato dell'autenticazione e fornire le funzioni di autenticazione ai componenti figli
const AuthProvider = ({ children }) => {
  // Stato dell'utente corrente
  const [user, setUser] = useState(null)

  // Funzione per effettuare il login
  const login = async (username, password) => {
    const user = await loginService(username, password) // Chiamata all'API di login
    setUser(user) // Imposta lo stato dell'utente con i dati ricevuti
  }

  // Funzione per effettuare il logout
  const logout = async () => {
    await logoutService() // Chiamata all'API di logout
    setUser(null) // Reset dello stato dell'utente
  }

  // Funzione per registrare un nuovo utente e loggarlo automaticamente
  const signup = async (username, password) => {
    await signupService(username, password) // Chiamata all'API di registrazione
    const user = await loginService(username, password) // Effettua il login con il nuovo utente
    setUser(user) // Imposta lo stato dell'utente con i dati ricevuti
  }

  // Funzione per eliminare l'utente corrente
  const deleteUser = async () => {
    await unsignService() // Chiamata all'API di eliminazione utente
    setUser(null) // Reset dello stato dell'utente
  }

  return (
    // Fornisce il contesto di autenticazione ai componenti figli
    <AuthContext.Provider value={{ user, login, logout, signup, deleteUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

// Hook personalizzato per utilizzare il contesto di autenticazione
export const useAuth = () => {
  return useContext(AuthContext)
}
