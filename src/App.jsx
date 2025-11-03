
// import './App.css'
import React from 'react'
import {BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import Registration from '../src/components/Registration.jsx'
import LoginPage from '../src/components/Login.jsx'
import Home from '../src/components/Home.jsx'
import History from '../src/components/History.jsx'
//import SearchResults from '../src/components/Search.jsx'
import SearchBooks from "../src/components/Search.jsx";
import ChangePassword from './components/ChangPassword.jsx';




function App() {
  return (
    <Router>
    <Routes>
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/" element={<Home/>}/>
      <Route path="/history" element={<History/>}/>
      <Route path="/search" element={<SearchBooks />} />
       <Route path="/change-password" element={<ChangePassword />} />
    
    </Routes>
  </Router>
  );
}

export default App
