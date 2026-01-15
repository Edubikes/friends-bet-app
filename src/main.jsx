import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/main.css'
import { BetProvider } from './lib/BetContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BetProvider>
      <App />
    </BetProvider>
  </React.StrictMode>,
)
