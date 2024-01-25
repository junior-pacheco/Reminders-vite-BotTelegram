import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Login from './components/login/index.jsx'
import { BrowserRouter } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Login>
      </Login>
    </BrowserRouter>
  </React.StrictMode>,
)
