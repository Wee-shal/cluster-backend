import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Signin from './buttons/Signin';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [id, setID] = useState(null);


  useEffect(() => {
    const storedId = window.localStorage.getItem('id');
    if (storedId) {
      setID(storedId);
    }
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (menuItem) => {
    console.log(`Clicked on ${menuItem}`);
    handleClose();
    {/*logout*/}
    if(menuItem === 'Logout'){
      //logic for clearing session, tokens etc.
      window.localStorage.removeItem('id');

      //reloading of page and other actions if needed
      window.location.href='/';  //home page
    }
  };

  return (
        <nav style={{ backgroundColor: '#333', padding: '1rem', color: 'white', position: 'sticky', top: '0', zIndex: '1000' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Dummy Logo Text */}
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor:'pointer' }} onClick={() => (window.location.href = '/')}>konnect</div>
        {/* Search Bar */}
        {/* User Icon and Menu */}
        {id ?(
        <div className='pressable-icon'>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuClick}
            style={{ color: 'white' }}
          >
            <AccountCircleRoundedIcon fontSize="large" />
          </IconButton>
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
        ):(
          <Signin/>
        )}
          
      </div>
    </nav>
  );
};

export default Navbar;
