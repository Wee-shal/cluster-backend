import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
// Import CSS file for styling if needed



const NavbarContainer = styled.div`
background-color: #333;
overflow: hidden;
display: flex;
justify-content: space-between;
padding: 0 20px;

@media (max-width: 768px) {
    flex-wrap: wrap;
}
`;

const NavbarLink = styled.a`
    float: left;
    display: block;
    color: ${({ isActive }) => (isActive ? 'black' : 'white')};
    background-color: ${({ isActive }) => (isActive ? '#ddd' : 'transparent')};
    text-align: center;
    padding: 14px 20px;
    text-decoration: none;
    cursor: pointer;
    &:hover {
        background-color: ${({ isActive }) => (isActive ? '#ddd' : '#555')};
        color: ${({ isActive }) => (isActive ? 'black' : '#ddd')};
    }
  

`;
const NavbarList = styled.ul`
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333;
`;
const CategoriesButton = styled.button`
    background-color: black;
    color: white;
    padding: 20px; /* Increase padding for larger size */
    border: none;
    cursor: pointer;
    width: 100%; /* Take the full width of the container */

    &:hover {
        opacity: 0.8;
    }
`;
function Navbar2({ customSearchFunction }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  

    const handleClick = (link) => {
        if (activeLink === link) {
            // If the clicked link is already active, reset to show all cards
            setActiveLink(null);
            customSearchFunction(null); // Pass null to indicate showing all cards
        } else {
            setActiveLink(link);
            customSearchFunction(link);
        }
        setIsOpen(false);
    };


  return (
    <div className="navbar2">
      <CategoriesButton onClick={toggleDropdown} className="dropdown-btn">
        Categories
      </CategoriesButton>
      {isOpen && (
        <div className="dropdown-content">
        
        <NavbarContainer className="navbar">
            <NavbarList>
            <li><NavbarLink
                href="#"
                onClick={() => handleClick('Graphic Design')}
                isActive={activeLink === 'Graphic Design'}
            >
                Graphic Design
            </NavbarLink></li>
            <li> <NavbarLink
                href="#"
                onClick={() => handleClick('Programming & Tech')}
                isActive={activeLink === 'Programming & Tech'}
            >
                Programming & Tech
            </NavbarLink></li>
            <li><NavbarLink
                href="#"
                onClick={() => handleClick('Digital Marketing')}
                isActive={activeLink === 'Digital Marketing'}
            >
                Digital Marketing
            </NavbarLink></li>
            <li><NavbarLink
                href="#"
                onClick={() => handleClick('Video & Animation')}
                isActive={activeLink === 'Video & Animation'}
            >
                Video & Animation
            </NavbarLink></li>
            <li><NavbarLink
                href="#"
                onClick={() => handleClick('Writing & Translation')}
                isActive={activeLink === 'Writing & Translation'}
            >
                Writing & Translation
            </NavbarLink></li>
            <li><NavbarLink
                href="#"
                onClick={() => handleClick('Music & Video')}
                isActive={activeLink === 'Music & Video'}
            >
                Music & Video
            </NavbarLink></li>
            <li><NavbarLink
                href="#"
                onClick={() => handleClick('Business')}
                isActive={activeLink === 'Business'}
            >
                Business
            </NavbarLink></li>
            <li><NavbarLink
                href="#"
                onClick={() => handleClick('Data')}
                isActive={activeLink === 'Data'}
            >
                Data
            </NavbarLink>
            </li>
            <li><NavbarLink
                href="#"
                onClick={() => handleClick('Photography')}
                isActive={activeLink === 'Photography'}
            >
                Photography
            </NavbarLink></li>
            <li><NavbarLink
                href="#"
                onClick={() => handleClick('AI Services')}
                isActive={activeLink === 'AI Services'}
            >
                AI Services
            </NavbarLink></li>
            </NavbarList>
        </NavbarContainer>
    
        
        </div>
      )}
    </div>
  );
}

Navbar2.propTypes = {
    customSearchFunction: PropTypes.func.isRequired,
};

export default Navbar2;