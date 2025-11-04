import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logoImage from '../assets/images/logo.png';
import '../styles/header.css';

const Header = () => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logoImage} alt="My Logo" className="logo-img" />
      </div>

      <nav>
        <a href="/">Home</a>
        <a href="/history">History</a>

        {/* Profile Dropdown */}
        <div
          className="dropdown"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <span className="dropdown-toggle" fontcolor="black">Profile ▾</span>
          {showDropdown && (
            <div className="dropdown-menu">
              <a href="/register">SignUp</a>
              <a href="/login">SignIn</a>
              <a href="/change-password">Change-Password</a>
              <a href="/reset-password">Reset-Password</a>
            </div>
          )}
        </div>

        <form className="search-container" onSubmit={handleSearch}>
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.71 20.29l-3.388-3.388A7.92 7.92 0 0017 10a8 8 0 10-8 8 7.92 7.92 0 006.9-3.678l3.388 3.388a1 1 0 001.414-1.414zM4 10a6 6 0 116 6 6.006 6.006 0 01-6-6z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </nav>
    </header>
  );
};

export default Header;
