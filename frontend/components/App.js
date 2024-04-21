import React from 'react'
import Home from './Home'
import Form from './Form'
import { NavLink, Routes, Route } from 'react-router-dom'; // to use NavLink components 


function App() {
  return (
    <div id="app">
      <nav>
       
        <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink> 
        <NavLink to="/order" className={({ isActive }) => isActive ? "active" : ""}>Order</NavLink> 
      </nav>
  
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home component renders when URL is at the root */}
        <Route path="/order" element={<Form />} /> {/* Form component renders when URL is at '/order' */}
      </Routes>
    </div>
  )
}

export default App;

