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
        if (activeLink === link) {
            setActiveLink(null);
            customSearchFunction(null);
        } else {
            setActiveLink(link);
            customSearchFunction(link);
        }
    };

    return (
        <NavbarContainer className="navbar">
            <NavbarLink
                href="#"
                onClick={() => handleClick('Development & IT')}
                isActive={activeLink === 'Development & IT'}
            >
                Development & IT
            </NavbarLink>
            <NavbarLink
                href="#"
                onClick={() => handleClick('Finance & Accounting')}
                isActive={activeLink === 'Finance & Accounting'}
            >
                Finance & Accounting
            </NavbarLink>
            <NavbarLink
                href="#"
                onClick={() => handleClick('Legal')}
                isActive={activeLink === 'Legal'}
            >
                Legal
            </NavbarLink>
            <NavbarLink
                href="#"
                onClick={() => handleClick('AI Services')}
                isActive={activeLink === 'AI Services'}
            >
                AI Services
            </NavbarLink>
            <NavbarLink
                href="#"
                onClick={() => handleClick('Marketing & Sales')}
                isActive={activeLink === 'Marketing & Sales'}
            >
                Marketing & Sales
            </NavbarLink>
            <NavbarLink
                href="#"
                onClick={() => handleClick('Design & UI/UX')}
                isActive={activeLink === 'Design & UI/UX'}
            >
                Design & UI/UX
            </NavbarLink>
            <NavbarLink
                href="#"
                onClick={() => handleClick('Academics & Tutors')}
                isActive={activeLink === 'Academics & Tutors'}
            >
               Academics & Tutors
            </NavbarLink>
            <NavbarLink
                href="#"
                onClick={() => handleClick('Health & Fitness')}
                isActive={activeLink === 'Health & Fitness'}
            >
                Health & Fitness
            </NavbarLink>
        </NavbarContainer>
    );
}

Navbar2.propTypes = {
    customSearchFunction: PropTypes.func.isRequired,
};

export default Navbar2;