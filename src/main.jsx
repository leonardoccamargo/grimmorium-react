import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CharactersProvider } from './context/CharactersContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import './index.css' // Ou o seu style.css antigo adaptado

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <CharactersProvider>
          <App />
        </CharactersProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)