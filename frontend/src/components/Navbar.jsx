import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Signin from './buttons/Signin';
import Wallet from './Wallet';
import { getUser } from '../services/helpers';
import ClustleLogo from '../assets/clustlelogo.jpeg'

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [id, setID] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const storedId = window.localStorage.getItem('id');
    if (storedId) {
      setID(storedId);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser(id);
        setUserName(user.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClick = () => {
    window.location.href = '/';
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (menuItem) => {
    console.log(`Clicked on ${menuItem}`);
    handleClose();
    if (menuItem === 'Logout') {
      // logic for clearing session, tokens, etc.
      window.localStorage.removeItem('id');
      // reloading of page and other actions if needed
      window.location.href = '/'; // home page
    }
  };

  useEffect(() => {
		const handleResize = () => {
			setIsSmallScreen(window.innerWidth <= 768)
		}

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])
	const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768)

	useEffect(() => {
		const handleResize = () => {
			setIsSmallScreen(window.innerWidth <= 768)
		}

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

  return (
   
    <nav style={{ backgroundColor: 'black', padding: '0.5rem', color: 'white', position: 'sticky', top: '0', zIndex: '1000', maxWidth: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Dummy Logo Text */}
        <div style={{ cursor: 'pointer', textDecoration: 'none', marginRight:'1px'}} onClick={handleClick}>
          <img src={ClustleLogo} style={{maxHeight:isSmallScreen?'25px':'40px'}}></img>
        </div>
        {/* Search Bar */}
        {/* User Icon and Menu */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          {id ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <Wallet />
              </div>
              <div style={{ margin: '0 10px' }}>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenuClick}
                  style={{ color: 'white' }}
                >
                  <AccountCircleRoundedIcon fontSize="large" />
                </IconButton>
                <h1 style={{ margin: 0, fontSize: '0.8rem', marginLeft: '4px' }}>{userName}</h1>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  getContentAnchorEl={null}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem style={{ fontSize: '1.3rem', marginRight: '10px', marginLeft: '10px' }} onClick={() => handleMenuItemClick('Logout')}>Logout</MenuItem>
                </Menu>
              </div>
            </>
          ) : (
            <Signin />
          )}
        </div>
      </div>
    </nav>
    
  );
};

export default Navbar;
