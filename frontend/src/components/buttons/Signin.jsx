import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Signin() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const buttonStyle = {
    backgroundColor: '#495057',
    color: 'white',
    padding:'8px 5px',
    borderRadius: '5px',
    fontSize: '16px', 
    cursor: 'pointer',
    float: 'right',
    border: 'none',
    outline: 'none',
    transition: 'background-color 0.3s',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <Link to="/login">
        <button style={buttonStyle}>
        {isSmallScreen ? 'Sign up' : 'Sign in/Sign up'}
        </button>
      </Link>
    </div>
  );
}