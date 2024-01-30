import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const NavbarContainer = styled.div`
background-color: #333;
overflow: hidden;
display: flex;
justify-content: space-between;
padding: 0 20px;
height: 60px; /* Set your desired fixed height for the navbar */

    @media (max-width: 768px) {
        flex-wrap: nowrap; /* Prevent items from wrapping to the next line */
        overflow-x: auto; /* Enable horizontal scrolling for small screens */
        padding: 0; /* Remove padding for small screens */
    }
`

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

function Navbar2({ customSearchFunction }) {
    const [activeLink, setActiveLink] = useState(null);

    const handleClick = (link) => {
        if(!activeLink){
        setActiveLink(link);
        customSearchFunction(link);
        }
        else{
            setActiveLink(null);
        customSearchFunction(null)
        }
    };

    return (
        <NavbarContainer className="navbar">
            <NavbarLink
                href="#"
                onClick={() => handleClick('Graphic Design')}
                isActive={activeLink === 'Graphic Design'}
            >
                Graphic Design
            </NavbarLink>
            <NavbarLink
                href="#"
                onClick={() => handleClick('Programming & Tech')}
                isActive={activeLink === 'Programming & Tech'}
            >
                Programming & Tech
            </NavbarLink>
            <NavbarLink
                href="#"
                onClick={() => handleClick('Digital Marketing')}
                isActive={activeLink === 'Digital Marketing'}
            >
                Digital Marketing
            </NavbarLink>
            <NavbarLink
                href="#"
                onClick={() => handleClick('Video & Animation')}
                isActive={activeLink === 'Video & Animation'}
            >
                Video & Animation
            </NavbarLink>
            <NavbarLink
                href="#"
                onClick={() => handleClick('Writing & Translation')}
                isActive={activeLink === 'Writing & Translation'}
            >
                Writing & Translation
            </NavbarLink>
            <NavbarLink
                href="#"
                onClick={() => handleClick('Music & Video')}
                isActive={activeLink === 'Music & Video'}
            >
                Music & Video
            </NavbarLink>
            <NavbarLink
                href="#"
                onClick={() => handleClick('Business')}
                isActive={activeLink === 'Business'}
            >
                Business
            </NavbarLink>
            <NavbarLink
                href="#"
                onClick={() => handleClick('Data')}
                isActive={activeLink === 'Data'}
            >
                Data
            </NavbarLink>
            <NavbarLink
                href="#"
                onClick={() => handleClick('Photography')}
                isActive={activeLink === 'Photography'}
            >
                Photography
            </NavbarLink>
            <NavbarLink
                href="#"
                onClick={() => handleClick('AI Services')}
                isActive={activeLink === 'AI Services'}
            >
                AI Services
            </NavbarLink>
        </NavbarContainer>
    );
}

Navbar2.propTypes = {
    customSearchFunction: PropTypes.func.isRequired,
};

export default Navbar2;