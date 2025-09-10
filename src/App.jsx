
// import './App.css'
import React from 'react'
import {BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import Registration from '../src/components/Registration.jsx'
import LoginPage from '../src/components/Login.jsx'



function App() {
  return (
    <Router>
    <Routes>
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<LoginPage />}/>
     
    
    </Routes>
  </Router>
  );
}

export default App
