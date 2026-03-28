import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useState , useEffect } from 'react'
import './css/index.css'
import App from './App.jsx'
import Test from './Test.jsx'
import Cards from './Cards.jsx'
import CardList from './CardList.jsx'
import MainPage from './components/MainPage.jsx'

const cards = [
  {symbole:'pic', affichage:'hidden'},
  {symbole:'coeur', affichage:'visible'}
]



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />

  </StrictMode>,
)