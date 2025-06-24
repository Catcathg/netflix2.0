import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';

function App() {
    return (
       <Router>
           <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/category/:id" element={<CategoryPage />} />
           </Routes>
       </Router>
    )
}

export default App
